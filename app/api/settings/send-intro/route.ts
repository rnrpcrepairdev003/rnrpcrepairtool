import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_INTRO =
  `*📋 RNRPC Repair — Priority Queue Bot*\n` +
  `${"─".repeat(36)}\n\n` +
  `This space receives the daily AI-ranked repair queue report.\n\n` +
  `*How it works:*\n` +
  `• Top 15 active jobs are ranked by urgency score (HIGH / MEDIUM / LOW)\n` +
  `• Each job includes a direct Trello link and a suggested next action\n` +
  `• Reports are sent automatically — no action needed\n\n` +
  `${"─".repeat(36)}\n` +
  `_Pin this message so all members know the purpose of this space._`;

export async function POST() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ["google_chat_webhook_url", "intro_message"] } },
  });
  const db = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const webhookUrl = db.google_chat_webhook_url ?? process.env.GOOGLE_CHAT_WEBHOOK_URL?.trim();
  const text = db.intro_message ?? DEFAULT_INTRO;

  if (!webhookUrl) {
    return NextResponse.json({ error: "No Google Chat webhook URL configured" }, { status: 400 });
  }

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
