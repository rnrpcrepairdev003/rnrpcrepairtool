import { NextRequest, NextResponse } from "next/server";
import { getCardAttachments } from "@/lib/trello";

type Params = Promise<{ cardId: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  try {
    const { cardId } = await params;
    const attachments = await getCardAttachments(cardId);
    return NextResponse.json(attachments);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
