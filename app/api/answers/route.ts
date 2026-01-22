import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { content, authorName, verdict, findId } = body;

  const answer = await prisma.answer.create({
    data: {
      content,
      authorName,
      verdict: verdict || null,
      findId: parseInt(findId),
    },
  });

  return NextResponse.json(answer, { status: 201 });
}
