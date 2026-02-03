import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const body = await request.json();
  const { content, verdict, findId, authorName } = body;

  const answer = await prisma.answer.create({
    data: {
      content,
      userId: session.user.id,
      verdict: verdict || null,
      findId: parseInt(findId),
      authorName: user?.role === "moderator" && authorName ? authorName : null,
    },
  });

  return NextResponse.json(answer, { status: 201 });
}
