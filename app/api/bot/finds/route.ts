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
  const apiKey = await validateApiKey(request);
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

  // Process images (base64 or URL)
  const imageUrls: string[] = [];

  if (images && Array.isArray(images)) {
    if (images.length > 10) {
      return NextResponse.json(
        { error: "Validation error", message: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (typeof image !== "string" || !image.trim()) continue;

      try {
        let uploadSource: string;

        // Check if it's a URL (http/https)
        if (image.startsWith("http://") || image.startsWith("https://")) {
          // Cloudinary can fetch from URLs directly
          uploadSource = image;
        } else if (image.startsWith("data:")) {
          // Already a data URI
          uploadSource = image;
        } else {
          // Assume raw base64 - clean it up and add proper prefix
          // Remove any whitespace/newlines that might have been added
          const cleanBase64 = image.replace(/[\s\n\r]/g, "");

          // Detect image type from base64 header if possible
          let mimeType = "image/jpeg";
          if (cleanBase64.startsWith("/9j/")) {
            mimeType = "image/jpeg";
          } else if (cleanBase64.startsWith("iVBOR")) {
            mimeType = "image/png";
          } else if (cleanBase64.startsWith("R0lGO")) {
            mimeType = "image/gif";
          } else if (cleanBase64.startsWith("UklGR")) {
            mimeType = "image/webp";
          }

          uploadSource = `data:${mimeType};base64,${cleanBase64}`;
        }

        // Validate base64 size (max 10MB) - only for base64, not URLs
        if (uploadSource.startsWith("data:")) {
          const base64Data = uploadSource.split(",")[1] || "";
          const sizeInBytes = (base64Data.length * 3) / 4;
          if (sizeInBytes > 10 * 1024 * 1024) {
            return NextResponse.json(
              {
                error: "Validation error",
                message: `Image ${i + 1} exceeds 10MB limit`,
              },
              { status: 400 }
            );
          }
        }

        const result = await cloudinary.uploader.upload(uploadSource, {
          folder: "finds-community",
        });
        imageUrls.push(result.secure_url);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Cloudinary upload error for image ${i + 1}:`, error);
        return NextResponse.json(
          {
            error: "Upload error",
            message: `Failed to upload image ${i + 1}: ${errorMessage}`,
            hint: "Images should be: a URL (https://...), a data URI (data:image/jpeg;base64,...), or raw base64 string"
          },
          { status: 400 }
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
