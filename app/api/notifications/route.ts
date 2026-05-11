import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SETTING_KEY = "lastCommentCheck";

async function sendGoogleChat(text: string) {
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

export async function GET() {
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json({ skipped: "No webhook configured" });
  }

  const listId = process.env.TRELLO_LIST_ID!.trim();
  const key = process.env.TRELLO_API_KEY!.trim();
  const token = process.env.TRELLO_TOKEN!.trim();

  // Get last checked time from DB, default to 2 minutes ago on first run
  const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
  const since = setting
    ? new Date(setting.value).toISOString()
    : new Date(Date.now() - 2 * 60 * 1000).toISOString();

  const now = new Date().toISOString();

  // Fetch new comments only from cards in our target list
  const url = new URL(`https://api.trello.com/1/lists/${listId}/actions`);
  url.searchParams.set("filter", "commentCard");
  url.searchParams.set("since", since);
  url.searchParams.set("limit", "50");
  url.searchParams.set("key", key);
  url.searchParams.set("token", token);

  const res = await fetch(url.toString());
  if (!res.ok) {
    return NextResponse.json({ error: `Trello error ${res.status}` }, { status: 502 });
  }

  const actions: {
    id: string;
    date: string;
    memberCreator: { fullName: string };
    data: { text: string; card: { id: string; name: string; shortLink: string } };
  }[] = await res.json();

  const hiddenCards = await prisma.hiddenCard.findMany();
  const hiddenIds = new Set(hiddenCards.map((h) => h.trelloCardId));
  const isNoteCard = (name: string) => name.length > 80 && !/\d/.test(name);

  // Send a notification for each new comment on a visible job card
  for (const action of actions) {
    if (hiddenIds.has(action.data.card.id) || isNoteCard(action.data.card.name)) continue;
    const cardName = action.data.card.name;
    const commenter = action.memberCreator.fullName;
    const comment = action.data.text.slice(0, 300) + (action.data.text.length > 300 ? "…" : "");
    const cardUrl = `https://trello.com/c/${action.data.card.shortLink}`;
    const time = new Date(action.date).toLocaleString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    await sendGoogleChat(
      `💬 *New comment* — ${time}\n` +
      `📋 *${cardName}*\n` +
      `👤 ${commenter}: ${comment}\n` +
      `🔗 ${cardUrl}`
    );
  }

  // Update last checked timestamp
  await prisma.setting.upsert({
    where: { key: SETTING_KEY },
    update: { value: now },
    create: { key: SETTING_KEY, value: now },
  });

  return NextResponse.json({ checked: now, newComments: actions.length });
}
