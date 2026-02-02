import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(apiKey);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(apiKey, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

function validateApiKey(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const providedKey = authHeader.slice(7);
  const validKey = process.env.BOT_API_KEY;

  if (!validKey || providedKey !== validKey) {
    return null;
  }

  return providedKey;
}

const VALID_CATEGORIES = [
  "coins",
  "pottery",
  "tools",
  "jewelry",
  "fossils",
  "military",
  "other",
];

export async function POST(request: NextRequest) {
  // Validate API key
  const apiKey = validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid or missing API key" },
      { status: 401 }
    );
  }

  // Check rate limit
  if (!checkRateLimit(apiKey)) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Too many requests. Try again later.",
      },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", message: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const { title, description, location, category, images, botUserId } = body;

  // Validate required fields
  if (!title || typeof title !== "string" || title.length < 3) {
    return NextResponse.json(
      {
        error: "Validation error",
        message: "Title is required and must be at least 3 characters",
      },
      { status: 400 }
    );
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.length < 10
  ) {
    return NextResponse.json(
      {
        error: "Validation error",
        message: "Description is required and must be at least 10 characters",
      },
      { status: 400 }
    );
  }

  if (!location || typeof location !== "string") {
    return NextResponse.json(
      { error: "Validation error", message: "Location is required" },
      { status: 400 }
    );
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      {
        error: "Validation error",
        message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // Validate botUserId if provided
  let userId: string | null = null;
  if (botUserId) {
    const user = await prisma.user.findUnique({ where: { id: botUserId } });
    if (!user) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Invalid botUserId - user not found",
        },
        { status: 400 }
      );
    }
    userId = botUserId;
  }

  // Process images (base64)
  const imageUrls: string[] = [];

  if (images && Array.isArray(images)) {
    if (images.length > 10) {
      return NextResponse.json(
        { error: "Validation error", message: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    for (const image of images) {
      if (typeof image !== "string") continue;

      try {
        // Check if it's a base64 data URI or raw base64
        let dataUri = image;
        if (!image.startsWith("data:")) {
          // Assume it's raw base64, default to JPEG
          dataUri = `data:image/jpeg;base64,${image}`;
        }

        // Validate base64 size (max 10MB)
        const base64Data = dataUri.split(",")[1] || dataUri;
        const sizeInBytes = (base64Data.length * 3) / 4;
        if (sizeInBytes > 10 * 1024 * 1024) {
          return NextResponse.json(
            {
              error: "Validation error",
              message: "Image size exceeds 10MB limit",
            },
            { status: 400 }
          );
        }

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "finds-community",
        });
        imageUrls.push(result.secure_url);
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
          { error: "Upload error", message: "Failed to upload image to storage" },
          { status: 500 }
        );
      }
    }
  }

  // Create the find
  const find = await prisma.find.create({
    data: {
      title,
      description,
      location,
      category,
      userId,
      images: JSON.stringify(imageUrls),
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return NextResponse.json(
    {
      success: true,
      find: {
        id: find.id,
        title: find.title,
        description: find.description,
        location: find.location,
        category: find.category,
        images: JSON.parse(find.images),
        createdAt: find.createdAt,
        user: find.user,
      },
    },
    { status: 201 }
  );
}
