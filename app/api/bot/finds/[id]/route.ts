import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function validateApiKey(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const providedKey = authHeader.slice(7);

  // Check database for API key
  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { key: providedKey },
  });

  if (apiKeyRecord && apiKeyRecord.isActive) {
    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });
    return providedKey;
  }

  // Fallback to env var for backwards compatibility
  const envKey = process.env.BOT_API_KEY;
  if (envKey && providedKey === envKey) {
    return providedKey;
  }

  return null;
}

// GET - Get a specific find
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid or missing API key" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const findId = parseInt(id);

  if (isNaN(findId)) {
    return NextResponse.json(
      { error: "Validation error", message: "Invalid find ID" },
      { status: 400 }
    );
  }

  const find = await prisma.find.findUnique({
    where: { id: findId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { answers: true },
      },
    },
  });

  if (!find) {
    return NextResponse.json(
      { error: "Not found", message: "Find not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: find.id,
    title: find.title,
    description: find.description,
    location: find.location,
    category: find.category,
    images: JSON.parse(find.images),
    createdAt: find.createdAt,
    user: find.user,
    answerCount: find._count.answers,
  });
}

// DELETE - Delete a find
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid or missing API key" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const findId = parseInt(id);

  if (isNaN(findId)) {
    return NextResponse.json(
      { error: "Validation error", message: "Invalid find ID" },
      { status: 400 }
    );
  }

  const find = await prisma.find.findUnique({
    where: { id: findId },
  });

  if (!find) {
    return NextResponse.json(
      { error: "Not found", message: "Find not found" },
      { status: 404 }
    );
  }

  try {
    await prisma.find.delete({
      where: { id: findId },
    });

    return NextResponse.json({
      success: true,
      message: `Find ${findId} deleted successfully`,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete error", message: "Failed to delete find" },
      { status: 500 }
    );
  }
}
