import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;
  const body = await req.json();
  const transcript: string | null = body.transcript ?? null;
  const aiResponse: string | null = body.aiResponse ?? null;
  const reviewed: boolean = body.reviewed ?? false;

  try {
    const record = await prisma.callRecord.update({
      where: { threecxCallId: callId },
      data: { transcript, aiResponse, reviewed },
    });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Call record not found" }, { status: 404 });
  }
}
