import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const find = await prisma.find.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      answers: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!find) {
    return NextResponse.json({ error: "Find not found" }, { status: 404 });
  }

  return NextResponse.json(find);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const findId = parseInt(id);

  // Get the find and check ownership
  const find = await prisma.find.findUnique({
    where: { id: findId },
    select: { userId: true },
  });

  if (!find) {
    return NextResponse.json({ error: "Find not found" }, { status: 404 });
  }

  if (find.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const category = formData.get("category") as string;
  const imageFiles = formData.getAll("images") as File[];
  const existingImages = formData.get("existingImages") as string;

  // Start with existing images
  let imageUrls: string[] = [];
  if (existingImages) {
    try {
      imageUrls = JSON.parse(existingImages);
    } catch {
      imageUrls = [];
    }
  }

  // Upload new images
  for (const file of imageFiles) {
    if (file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      try {
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "finds-community",
        });
        imageUrls.push(result.secure_url);
      } catch (error) {
        console.error("Cloudinary upload error:", error);
      }
    }
  }

  const updatedFind = await prisma.find.update({
    where: { id: findId },
    data: {
      title,
      description,
      location,
      category,
      images: JSON.stringify(imageUrls),
    },
  });

  return NextResponse.json(updatedFind);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const findId = parseInt(id);

  // Get the find and check ownership or moderator status
  const [find, user] = await Promise.all([
    prisma.find.findUnique({
      where: { id: findId },
      select: { userId: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    }),
  ]);

  if (!find) {
    return NextResponse.json({ error: "Find not found" }, { status: 404 });
  }

  const isOwner = find.userId === session.user.id;
  const isModerator = user?.role === "moderator";

  if (!isOwner && !isModerator) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.find.delete({
      where: { id: findId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
