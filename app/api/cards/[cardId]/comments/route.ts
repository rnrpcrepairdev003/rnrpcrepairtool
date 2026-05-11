import { NextRequest, NextResponse } from "next/server";
import { getCardComments } from "@/lib/trello";

type Params = Promise<{ cardId: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  try {
    const { cardId } = await params;
    const comments = await getCardComments(cardId);
    return NextResponse.json(comments);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
