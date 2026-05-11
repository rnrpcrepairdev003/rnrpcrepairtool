import type { ScoredCard } from "@/app/api/cards/route";
import { CardRow } from "./CardRow";

type Tier = "HIGH" | "MEDIUM" | "LOW" | "PENDING";

const config: Record<Tier, { label: string; dot: string; text: string }> = {
  HIGH: { label: "High Priority", dot: "bg-red-500", text: "text-red-400" },
  MEDIUM: { label: "Medium Priority", dot: "bg-amber-500", text: "text-amber-400" },
  LOW: { label: "Low Priority", dot: "bg-emerald-500", text: "text-emerald-400" },
  PENDING: { label: "Pending Review", dot: "bg-slate-600", text: "text-slate-500" },
};

type PrioritySectionProps = {
  tier: Tier;
  cards: ScoredCard[];
  startRank: number;
  onUpdated: () => void;
  onOpenCard: (cardId: string) => void;
};

export function PrioritySection({ tier, cards, startRank, onOpenCard }: PrioritySectionProps) {
  if (cards.length === 0) return null;
  const { label, dot, text } = config[tier];

  return (
    <section className="flex flex-col gap-1.5">
      {/* Section header */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${text}`}>{label}</span>
        <span className="text-slate-700 text-xs font-mono ml-1">{cards.length}</span>
        <div className="flex-1 h-px bg-slate-800 ml-1" />
      </div>

      {/* Cards */}
      {cards.map((card, i) => (
        <CardRow
          key={card.id}
          card={card}
          rank={startRank + i}
          onOpen={() => onOpenCard(card.id)}
        />
      ))}
    </section>
  );
}
