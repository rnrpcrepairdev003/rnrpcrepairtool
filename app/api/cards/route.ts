import { NextResponse } from "next/server";
import { getBoardLists, getListCards } from "@/lib/trello";
import { tierOrder, scoreTier } from "@/lib/scoring";
import { prisma } from "@/lib/prisma";
import type { TrelloCard } from "@/lib/trello";
import type { TrelloCardOverride, Tier } from "@/lib/types";

const TARGET_LIST_NAME = process.env.TRELLO_LIST_NAME?.trim() ?? "";

export type ScoredCard = TrelloCard & {
  override: TrelloCardOverride | null;
  tier: Tier;
  score: number;
};

export async function GET() {
  const boardId = process.env.TRELLO_BOARD_ID!.trim();

  try {
    const pinnedListId = process.env.TRELLO_LIST_ID?.trim();
    let targetListId: string;

    if (pinnedListId) {
      targetListId = pinnedListId;
    } else {
      const lists = await getBoardLists(boardId);
      const targetList = TARGET_LIST_NAME
        ? lists.find((l) => l.name.toLowerCase() === TARGET_LIST_NAME.toLowerCase())
        : undefined;

      if (!targetList) {
        const names = lists.map((l) => `"${l.name}" (${l.id})`).join(", ");
        return NextResponse.json(
          { error: `Target list not found. Set TRELLO_LIST_ID in .env. Available lists: ${names}` },
          { status: 404 }
        );
      }
      targetListId = targetList.id;
    }

    const [cards, overrides, hiddenCards] = await Promise.all([
      getListCards(targetListId),
      prisma.trelloCardOverride.findMany(),
      prisma.hiddenCard.findMany(),
    ]);

    // Purge DB records for cards no longer on the board
    const activeIds = new Set(cards.map((c: TrelloCard) => c.id));
    const staleIds = overrides
      .map((o) => o.trelloCardId)
      .filter((id) => !activeIds.has(id));
    if (staleIds.length > 0) {
      await Promise.all([
        prisma.trelloCardOverride.deleteMany({ where: { trelloCardId: { in: staleIds } } }),
        prisma.hiddenCard.deleteMany({ where: { trelloCardId: { in: staleIds } } }),
      ]);
    }

    const hiddenIds = new Set(hiddenCards.map((h) => h.trelloCardId));
    const isNoteCard = (name: string) => name.length > 80 && !/\d/.test(name);
    const overrideMap = new Map(overrides.map((o) => [o.trelloCardId, o as unknown as TrelloCardOverride]));

    const scored: ScoredCard[] = cards
      .filter((card: TrelloCard) => !hiddenIds.has(card.id) && !isNoteCard(card.name))
      .map((card: TrelloCard) => {
        const override = overrideMap.get(card.id) ?? null;
        const score = override?.aiScore ?? 0;
        const tier = scoreTier(score);
        return { ...card, override, tier, score };
      });

    scored.sort((a, b) => {
      const tDiff = tierOrder(b.tier) - tierOrder(a.tier);
      if (tDiff !== 0) return tDiff;
      return b.score - a.score;
    });

    return NextResponse.json(scored);
  } catch (err) {
    console.error("GET /api/cards error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
