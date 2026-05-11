import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ cardId: string }>;

export async function POST(_req: NextRequest, { params }: { params: Params }) {
  const { cardId } = await params;
  await prisma.hiddenCard.upsert({
    where: { trelloCardId: cardId },
    update: {},
    create: { trelloCardId: cardId },
  });
  return NextResponse.json({ hidden: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { cardId } = await params;
  await prisma.hiddenCard.deleteMany({ where: { trelloCardId: cardId } });
  return NextResponse.json({ hidden: false });
}
