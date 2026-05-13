"use client";

import { useState } from "react";
import type { ScoredCard } from "@/app/api/cards/route";

type Tier = "HIGH" | "MEDIUM" | "LOW" | "PENDING";

const tierBar: Record<Tier, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-emerald-500",
  PENDING: "bg-slate-700",
};

const tierScore: Record<Tier, string> = {
  HIGH: "text-red-400",
  MEDIUM: "text-amber-400",
  LOW: "text-emerald-400",
  PENDING: "text-slate-500",
};

type QueuePanelProps = {
  cards: ScoredCard[];
};

export function QueuePanel({ cards }: QueuePanelProps) {
  const reviewed = cards.filter((c) => c.override !== null).length;
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSendReport() {
    setSendState("sending");
    try {
      const top20 = cards.map((c, i) => ({
        rank: i + 1,
        name: c.name,
        shortUrl: c.shortUrl,
        score: c.score,
        tier: c.tier,
        notes: c.override?.notes ?? null,
      }));
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: top20 }),
      });
      setSendState(res.ok ? "sent" : "error");
    } catch {
      setSendState("error");
    }
    setTimeout(() => setSendState("idle"), 3000);
  }

  return (
    <aside className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-full">
      {/* Panel header */}
      <div className="flex flex-col gap-2 px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Priority Queue</span>
          <span className="text-slate-600 text-xs font-mono">{reviewed}/{cards.length} reviewed</span>
        </div>
        <button
          onClick={handleSendReport}
          disabled={sendState === "sending"}
          className={`flex items-center justify-center gap-1.5 w-full py-1.5 rounded-md text-[11px] font-medium transition-colors ${
            sendState === "sent"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : sendState === "error"
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700 disabled:opacity-50"
          }`}
        >
          {sendState === "sending" ? (
            <>
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Sending…
            </>
          ) : sendState === "sent" ? (
            "✓ Sent to Google Chat"
          ) : sendState === "error" ? (
            "Failed — check webhook"
          ) : (
            <>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Send report to Google Chat
            </>
          )}
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {cards.map((card, i) => {
          const tier = card.tier;
          const isReviewed = card.override !== null;
          return (
            <div
              key={card.id}
              className="flex items-center gap-0 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40 transition-colors shrink-0"
            >
              {/* Tier accent */}
              <div className={`w-[2px] self-stretch shrink-0 ${tierBar[tier]}`} />

              <div className="flex items-center gap-2.5 flex-1 min-w-0 px-3 py-2">
                {/* Rank */}
                <span className="text-slate-600 text-xs font-mono w-5 text-right shrink-0 select-none">
                  {i + 1}
                </span>

                {/* Reviewed check */}
                <span className={`shrink-0 text-xs leading-none ${isReviewed ? "text-brand" : "text-slate-800"}`}>
                  ✓
                </span>

                {/* Name */}
                <span className="text-slate-300 text-sm truncate flex-1">
                  {card.name}
                </span>

                {/* Score */}
                <span className={`text-xs font-mono font-semibold shrink-0 ${tierScore[tier]}`}>
                  {card.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
