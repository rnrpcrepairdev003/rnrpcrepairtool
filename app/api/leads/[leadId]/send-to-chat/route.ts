import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ leadId: string }>;

const CHAT_WEBHOOK = "https://chat.googleapis.com/v1/spaces/AAQAoTKXGH0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=pGvIE2YQd2vQXdLNrMzVpl16nyTDHD1cfPTUhjjxCok";

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { leadId } = await params;
  const { note } = await req.json();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const lines: string[] = [];
  lines.push(`Name: ${lead.customerName || "Unknown"}`);
  lines.push(`Number: ${lead.phone || "—"}`);
  lines.push(`Device Brand/Model: ${lead.device || "—"}`);
  lines.push(`Customer's Description of Problem: ${lead.issue || "—"}`);
  if (note?.trim()) {
    lines.push("");
    lines.push(`-${note.trim()}`);
  }

  const text = lines.join("\n");

  try {
    const res = await fetch(CHAT_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Google Chat error: ${err}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
