import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCard } from "@/lib/trello";

type Params = Promise<{ leadId: string }>;

type Turn = {
  input: string;
  result: {
    script: string;
    possibleIssues: string[];
    askCustomer: string[];
    pricing: string;
    turnaround: string;
    location: string;
    confidence: string;
    dataBackup: boolean | null;
  } | null;
};

export async function POST(_req: NextRequest, { params }: { params: Params }) {
  const { leadId } = await params;
  const listId = process.env.TRELLO_LIST_ID?.trim();

  if (!listId) {
    return NextResponse.json({ error: "TRELLO_LIST_ID not configured" }, { status: 500 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  let turns: Turn[] = [];
  try { turns = JSON.parse(lead.turns); } catch { /* empty */ }

  const lastTurn = turns[turns.length - 1];
  const lastResult = lastTurn?.result;

  const name = [
    lead.customerName || "Unknown Customer",
    lead.issue ? `– ${lead.issue}` : "",
    lead.phone ? `(${lead.phone})` : "",
  ].filter(Boolean).join(" ");

  const lines: string[] = [];

  lines.push(`📞 **Lead from CSR Assistant**`);
  lines.push(`**Date:** ${new Date(lead.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`);
  if (lead.phone) lines.push(`**Phone:** ${lead.phone}`);
  if (lead.issue) lines.push(`**Issue:** ${lead.issue}`);
  lines.push("");

  if (turns.length > 0) {
    lines.push("---");
    lines.push("**Conversation Summary**");
    lines.push("");
    turns.forEach((turn, i) => {
      lines.push(`*Turn ${i + 1}:* ${turn.input}`);
      if (turn.result?.script) {
        lines.push(`> ${turn.result.script}`);
      }
      lines.push("");
    });
  }

  if (lastResult) {
    lines.push("---");
    lines.push("**AI Diagnosis**");
    lines.push("");
    if (lastResult.possibleIssues?.length) {
      lines.push("Possible issues:");
      lastResult.possibleIssues.forEach((issue) => lines.push(`• ${issue}`));
      lines.push("");
    }
    if (lastResult.askCustomer?.length) {
      lines.push("Follow-up questions for customer:");
      lastResult.askCustomer.forEach((q) => lines.push(`• ${q}`));
      lines.push("");
    }
    const meta = [
      lastResult.turnaround && `Turnaround: ${lastResult.turnaround}`,
      lastResult.location && `Service: ${lastResult.location}`,
      lastResult.pricing && `Pricing ref: ${lastResult.pricing}`,
      lastResult.confidence && `Confidence: ${lastResult.confidence}`,
    ].filter(Boolean);
    if (meta.length) lines.push(meta.join(" · "));
  }

  const desc = lines.join("\n");

  try {
    const card = await createCard(listId, name, desc);
    return NextResponse.json({ ok: true, cardUrl: card.shortUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
