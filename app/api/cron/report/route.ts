import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBoardLists, getListCards } from "@/lib/trello";
import { scoreTier, tierOrder } from "@/lib/scoring";
import type { TrelloCard } from "@/lib/trello";
import type { TrelloCardOverride } from "@/lib/types";

export async function GET(req: Request) {
  // Verify this is called by Vercel cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.setting.findMany({
    where: { key: { in: ["google_chat_webhook_url"] } },
  });
  const db = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const webhookUrl = db.google_chat_webhook_url ?? process.env.GOOGLE_CHAT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return NextResponse.json({ error: "No webhook configured" }, { status: 400 });

  const boardId = process.env.TRELLO_BOARD_ID!.trim();
  const pinnedListId = process.env.TRELLO_LIST_ID?.trim();

  let targetListId: string;
  if (pinnedListId) {
    targetListId = pinnedListId;
  } else {
    const lists = await getBoardLists(boardId);
    const targetList = lists[0];
    if (!targetList) return NextResponse.json({ error: "No list found" }, { status: 404 });
    targetListId = targetList.id;
  }

  const [cards, overrides] = await Promise.all([
    getListCards(targetListId),
    prisma.trelloCardOverride.findMany(),
  ]);

  const overrideMap = new Map(overrides.map((o) => [o.trelloCardId, o as unknown as TrelloCardOverride]));
  const isNoteCard = (name: string) => name.length > 80 && !/\d/.test(name);

  const scored = cards
    .filter((c: TrelloCard) => !isNoteCard(c.name))
    .map((card: TrelloCard) => {
      const override = overrideMap.get(card.id) ?? null;
      const score = override?.aiScore ?? 0;
      const tier = scoreTier(score);
      return { ...card, override, tier, score };
    })
    .sort((a, b) => {
      const tDiff = tierOrder(b.tier) - tierOrder(a.tier);
      return tDiff !== 0 ? tDiff : b.score - a.score;
    })
    .slice(0, 15);

  const tierDot: Record<string, string> = { HIGH: "🔴", MEDIUM: "🟡", LOW: "🟢", PENDING: "⚪" };
  const tierLabel: Record<string, string> = { HIGH: "HIGH", MEDIUM: "MED", LOW: "LOW", PENDING: "—" };
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const lines = scored.map((c, i) => {
    const override = c.override as TrelloCardOverride | null;
    let line = `${String(i + 1).padStart(2, " ")}. ${tierDot[c.tier] ?? "⚪"} [${tierLabel[c.tier] ?? "—"} · ${c.score}]  ${c.name}\n      ${c.shortUrl}`;
    if (override?.notes?.trim()) line += `\n      Note: ${override.notes.trim()}`;
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
    return NextResponse.json({ error: await res.text() }, { status: 502 });
  }

  return NextResponse.json({ ok: true, sent: scored.length });
}
