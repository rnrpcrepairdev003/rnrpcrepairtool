type Tier = "HIGH" | "MEDIUM" | "LOW" | "PENDING";

const styles: Record<Tier, string> = {
  HIGH:    "bg-red-500/15 text-red-400 ring-1 ring-red-500/30 light:bg-red-100 light:text-red-700 light:ring-red-300",
  MEDIUM:  "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30 light:bg-amber-100 light:text-amber-700 light:ring-amber-300",
  LOW:     "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 light:bg-emerald-100 light:text-emerald-700 light:ring-emerald-300",
  PENDING: "bg-slate-700/60 text-slate-500 ring-1 ring-slate-600/40",
};

const labels: Record<Tier, string> = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  PENDING: "PENDING",
};

export function TierPill({ tier }: { tier: Tier }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${styles[tier]}`}>
      {labels[tier]}
    </span>
  );
}
