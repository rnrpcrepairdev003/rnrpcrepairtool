"use client";

import { TierPill } from "./TierPill";
import type { ScoredCard } from "@/app/api/cards/route";

type CardRowProps = {
  card: ScoredCard;
  rank: number;
  onOpen: () => void;
};

const tierAccent: Record<string, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-emerald-500",
  PENDING: "bg-slate-700",
};

export function CardRow({ card, rank, onOpen }: CardRowProps) {
  const hasOverride = card.override !== null;
  const needsReview = hasOverride && card.tier === "PENDING";

  return (
    <div
      onClick={onOpen}
      className="group flex rounded-lg overflow-hidden border border-slate-800 hover:border-slate-600 bg-slate-900 hover:bg-slate-800/80 transition-all cursor-pointer"
    >
      <div className={`w-[3px] shrink-0 ${tierAccent[card.tier]}`} />

      <div className="flex items-center gap-3 flex-1 min-w-0 px-3 py-2">
        <span className="text-slate-600 text-xs font-mono w-5 text-right shrink-0 select-none">
          {rank}
        </span>

        <span
          title={needsReview ? "Needs re-review — priority not set" : hasOverride ? "Reviewed" : "Pending review"}
          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
            needsReview ? "bg-amber-400" : hasOverride ? "bg-brand" : "bg-slate-700 group-hover:bg-slate-600"
          }`}
        />

        <span className="text-slate-200 text-sm truncate leading-none flex-1 min-w-0">
          {card.name}
        </span>

        {card.dateLastActivity && (
          <span className="text-slate-600 text-[11px] font-mono shrink-0 hidden lg:block">
            {new Date(card.dateLastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}

        {card.score > 0 && (
          <span className="text-slate-500 text-[11px] font-mono bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
            {card.score}
          </span>
        )}

        <TierPill tier={card.tier} />
      </div>
    </div>
  );
}
