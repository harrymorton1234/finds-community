import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const find = await prisma.find.findUnique({
    where: { id: parseInt(id) },
    include: {
      answers: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!find) {
    return NextResponse.json({ error: "Find not found" }, { status: 404 });
  }

  return NextResponse.json(find);
}
