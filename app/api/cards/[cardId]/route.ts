import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ cardId: string }>;

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { cardId } = await params;

    const body = await request.json();
    const aiScore: number | null = body.aiScore != null ? Number(body.aiScore) : null;
    const notes: string | null = body.notes ?? null;
    const aiResponse: string | null = body.aiResponse ?? null;

    const fields = { aiScore, notes, aiResponse };

    const override = await prisma.trelloCardOverride.upsert({
      where: { trelloCardId: cardId },
      update: fields,
      create: { trelloCardId: cardId, ...fields },
    });

    return NextResponse.json(override);
  } catch (err) {
    console.error("PUT /api/cards/[cardId] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
