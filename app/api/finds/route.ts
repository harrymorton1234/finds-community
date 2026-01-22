import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const finds = await prisma.find.findMany({
    where: category && category !== "all" ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { answers: true },
      },
    },
  });

  return NextResponse.json(finds);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const category = formData.get("category") as string;
  const authorName = formData.get("authorName") as string;
  const imageFiles = formData.getAll("images") as File[];

  const imageUrls: string[] = [];

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

  const find = await prisma.find.create({
    data: {
      title,
      description,
      location,
      category,
      authorName,
      images: JSON.stringify(imageUrls),
    },
  });

  return NextResponse.json(find, { status: 201 });
}
