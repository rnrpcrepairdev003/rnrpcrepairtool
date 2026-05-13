import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_KEYS = ["google_chat_webhook_url", "report_hour", "app_password", "intro_message"];

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

export async function GET() {
  const settings = await prisma.setting.findMany();
  const db = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return NextResponse.json({
    webhook_configured: !!db.google_chat_webhook_url,
    report_hour: db.report_hour ?? "8",
    intro_message: db.intro_message ?? DEFAULT_INTRO,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.includes(key)) continue;
    if (key === "google_chat_webhook_url" && !(value as string).trim()) continue;
    await prisma.setting.upsert({
      where: { key },
      update: { value: value as string },
      create: { key, value: value as string },
    });
  }

  return NextResponse.json({ ok: true });
}
