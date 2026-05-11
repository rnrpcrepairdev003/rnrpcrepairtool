import { NextRequest, NextResponse } from "next/server";

type ReportCard = {
  rank: number;
  name: string;
  shortUrl: string;
  score: number;
  tier: string;
  notes: string | null;
};

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json({ error: "GOOGLE_CHAT_WEBHOOK_URL not configured" }, { status: 500 });
  }

  const { cards }: { cards: ReportCard[] } = await req.json();

  const today = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const tierDot: Record<string, string> = {
    HIGH: "🔴", MEDIUM: "🟡", LOW: "🟢", PENDING: "⚪",
  };

  const tierLabel: Record<string, string> = {
    HIGH: "HIGH", MEDIUM: "MED", LOW: "LOW", PENDING: "—",
  };

  const lines = cards.map((c) => {
    let line = `${String(c.rank).padStart(2, " ")}. ${tierDot[c.tier] ?? "⚪"} [${tierLabel[c.tier] ?? "—"} · ${c.score}]  ${c.name}\n      ${c.shortUrl}`;
    if (c.notes?.trim()) line += `\n      Note: ${c.notes.trim()}`;
    return line;
  });

  const text =
    `*RNRPC Repair — Priority Queue*\n` +
    `${today}\n` +
    `${"─".repeat(36)}\n\n` +
    lines.join("\n\n") +
    `\n\n${"─".repeat(36)}\n` +
    `_Top 15 active jobs ranked by AI score_`;

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Google Chat error: ${err}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
