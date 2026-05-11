import { NextRequest, NextResponse } from "next/server";
import { getBoardLabels, createLabel } from "@/lib/trello";

export async function GET() {
  const boardId = process.env.TRELLO_BOARD_ID!;
  const labels = await getBoardLabels(boardId);
  return NextResponse.json(labels);
}

export async function POST(request: NextRequest) {
  const boardId = process.env.TRELLO_BOARD_ID!;
  const body = await request.json();
  const { name, color } = body as { name: string; color: string };
  const label = await createLabel(boardId, name, color);
  return NextResponse.json(label, { status: 201 });
}
