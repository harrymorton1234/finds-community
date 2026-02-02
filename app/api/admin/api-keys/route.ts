import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import crypto from "crypto";

// GET - List all API keys (moderators only)
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "moderator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiKeys = await prisma.apiKey.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Mask the actual key values for security (show only first/last 8 chars)
  const maskedKeys = apiKeys.map((key) => ({
    id: key.id,
    name: key.name,
    keyPreview: `${key.key.slice(0, 8)}...${key.key.slice(-8)}`,
    isActive: key.isActive,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt,
    createdBy: key.createdBy,
  }));

  return NextResponse.json(maskedKeys);
}

// POST - Create a new API key (moderators only)
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "moderator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.length < 2) {
    return NextResponse.json(
      { error: "Name is required and must be at least 2 characters" },
      { status: 400 }
    );
  }

  // Generate a secure random API key
  const key = crypto.randomBytes(32).toString("hex");

  const apiKey = await prisma.apiKey.create({
    data: {
      key,
      name,
      createdById: session.user.id,
    },
  });

  // Return the full key only on creation (won't be shown again)
  return NextResponse.json(
    {
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key, // Full key shown only once
      createdAt: apiKey.createdAt,
    },
    { status: 201 }
  );
}
