import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCard, getListCards } from "@/lib/trello";

export type HiddenCardEntry = {
  trelloCardId: string;
  hiddenAt: string | null; // null = auto-filtered note card
  name: string;
  shortUrl: string;
  autoHidden: boolean;
};

const isNoteCard = (name: string) => name.length > 80 && !/\d/.test(name);

export async function GET() {
  const listId = process.env.TRELLO_LIST_ID!.trim();

  const [manuallyHidden, allCards] = await Promise.all([
    prisma.hiddenCard.findMany({ orderBy: { hiddenAt: "desc" } }),
    getListCards(listId),
  ]);

  const manualIds = new Set(manuallyHidden.map((h) => h.trelloCardId));

  // Auto-filtered note cards (not manually hidden, just auto-detected)
  const noteCards: HiddenCardEntry[] = allCards
    .filter((c) => isNoteCard(c.name) && !manualIds.has(c.id))
    .map((c) => ({
      trelloCardId: c.id,
      hiddenAt: null,
      name: c.name,
      shortUrl: c.shortUrl,
      autoHidden: true,
    }));

  // Manually hidden cards — fetch current name from Trello
  const manualResults = await Promise.allSettled(
    manuallyHidden.map(async (h) => {
      const card = await getCard(h.trelloCardId);
      const entry: HiddenCardEntry = {
        trelloCardId: h.trelloCardId,
        hiddenAt: h.hiddenAt.toISOString(),
        name: card.name,
        shortUrl: card.shortUrl,
        autoHidden: false,
      };
      return entry;
    })
  );

  const manualEntries = manualResults
    .filter((r): r is PromiseFulfilledResult<HiddenCardEntry> => r.status === "fulfilled")
    .map((r) => r.value);

  return NextResponse.json([...noteCards, ...manualEntries]);
}
