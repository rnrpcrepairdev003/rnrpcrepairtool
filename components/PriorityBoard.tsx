"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { PrioritySection } from "./PrioritySection";
import { QueuePanel } from "./QueuePanel";
import { Footer } from "./Footer";
import { ReviewModal } from "./ReviewModal";
import type { ScoredCard } from "@/app/api/cards/route";
import type { HiddenCardEntry } from "@/app/api/cards/hidden/route";

const AUTO_REFRESH_MS = 2 * 60 * 1000;

export function PriorityBoard() {
  const [cards, setCards] = useState<ScoredCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hiddenCards, setHiddenCards] = useState<HiddenCardEntry[]>([]);
  const [hiddenModalOpen, setHiddenModalOpen] = useState(false);
  const [unhidingId, setUnhidingId] = useState<string | null>(null);

  const fetchCards = useCallback(async (silent = false) => {
    if (!silent) setError("");
    try {
      const res = await fetch("/api/cards");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      const data: ScoredCard[] = await res.json();
      setCards(data);
      setLastUpdated(new Date());
      setError("");
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : "Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHidden = useCallback(async () => {
    try {
      const res = await fetch("/api/cards/hidden");
      if (res.ok) setHiddenCards(await res.json());
    } catch {}
  }, []);

  async function handleUnhide(cardId: string) {
    setUnhidingId(cardId);
    try {
      await fetch(`/api/cards/${cardId}/hide`, { method: "DELETE" });
      await Promise.all([fetchCards(true), fetchHidden()]);
    } finally {
      setUnhidingId(null);
    }
  }

  const checkNotifications = useCallback(() => {
    fetch("/api/notifications").catch(() => {});
  }, []);

  const scheduleRefresh = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchCards(true);
      checkNotifications();
      scheduleRefresh();
    }, AUTO_REFRESH_MS);
  }, [fetchCards, checkNotifications]);

  useEffect(() => {
    fetchCards(false);
    fetchHidden();
    checkNotifications();
    scheduleRefresh();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [fetchCards, fetchHidden, checkNotifications, scheduleRefresh]);

  async function handleCardUpdated() {
    await fetchCards(true);
    scheduleRefresh();
  }

  const high = cards.filter((c) => c.tier === "HIGH");
  const medium = cards.filter((c) => c.tier === "MEDIUM");
  const low = cards.filter((c) => c.tier === "LOW");
  const pending = cards.filter((c) => c.tier === "PENDING");
  const reviewed = cards.filter((c) => c.override !== null).length;

  // Flat sorted list — same order as displayed (HIGH → MEDIUM → LOW → PENDING)
  const sortedCards = [...high, ...medium, ...low, ...pending];

  function handleOpenCard(cardId: string) {
    const idx = sortedCards.findIndex((c) => c.id === cardId);
    if (idx !== -1) setActiveIdx(idx);
  }

  return (
    <div className="bg-slate-950 flex flex-col h-screen">
      <Topbar
        total={cards.length}
        high={high.length}
        medium={medium.length}
        low={low.length}
        pending={pending.length}
        reviewed={reviewed}
        lastUpdated={lastUpdated}
        hiddenCount={hiddenCards.length}
        onHidden={() => { fetchHidden(); setHiddenModalOpen(true); }}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
      <Sidebar />
      <main className="overflow-hidden flex-1 min-h-0">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading jobs...
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-sm font-medium mb-1">Failed to load jobs</p>
              <p className="text-slate-600 text-xs font-mono max-w-sm">{error}</p>
            </div>
            <button
              onClick={() => { setLoading(true); fetchCards(false); }}
              className="text-sm text-white bg-brand hover:bg-brand-hover px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && cards.length === 0 && (
          <div className="flex items-center justify-center h-64 text-slate-600 text-sm">
            No jobs found in the priority list.
          </div>
        )}

        {!loading && !error && cards.length > 0 && (
          <div className="grid grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] h-full">
            <div className="overflow-y-auto scrollbar-thin px-6 py-5 pb-8 flex flex-col gap-5">
              <PrioritySection tier="HIGH" cards={high} startRank={1} onUpdated={handleCardUpdated} onOpenCard={handleOpenCard} />
              <PrioritySection tier="MEDIUM" cards={medium} startRank={high.length + 1} onUpdated={handleCardUpdated} onOpenCard={handleOpenCard} />
              <PrioritySection tier="LOW" cards={low} startRank={high.length + medium.length + 1} onUpdated={handleCardUpdated} onOpenCard={handleOpenCard} />
              <PrioritySection tier="PENDING" cards={pending} startRank={high.length + medium.length + low.length + 1} onUpdated={handleCardUpdated} onOpenCard={handleOpenCard} />
            </div>
            <div className="border-l border-slate-800 py-4 px-3 overflow-hidden flex flex-col">
              <QueuePanel cards={cards} />
            </div>
          </div>
        )}

      </main>
      </div>

      <Footer />

      {activeIdx !== null && sortedCards.length > 0 && (
        <ReviewModal
          cards={sortedCards}
          initialIndex={activeIdx}
          onClose={() => setActiveIdx(null)}
          onSaved={handleCardUpdated}
        />
      )}

      {hiddenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[70vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-200">Hidden Cards</h2>
              <button onClick={() => setHiddenModalOpen(false)} className="text-slate-500 hover:text-slate-200 transition-colors text-lg leading-none">×</button>
            </div>
            <div className="overflow-y-auto flex-1">
              {hiddenCards.length === 0 ? (
                <p className="px-5 py-6 text-sm text-slate-500 italic">No hidden cards.</p>
              ) : (
                <ul className="divide-y divide-slate-800">
                  {hiddenCards.map((h) => (
                    <li key={h.trelloCardId} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-200 truncate">{h.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {h.autoHidden
                            ? "Auto-filtered — note card"
                            : `Hidden ${new Date(h.hiddenAt!).toLocaleString("en-GB", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a href={h.shortUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                          Trello ↗
                        </a>
                        {!h.autoHidden && (
                          <button
                            onClick={async () => {
                              setUnhidingId(h.trelloCardId);
                              try {
                                await fetch(`/api/cards/${h.trelloCardId}/hide`, { method: "DELETE" });
                                await Promise.all([fetchCards(true), fetchHidden()]);
                              } finally {
                                setUnhidingId(null);
                              }
                            }}
                            disabled={unhidingId === h.trelloCardId}
                            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded transition-colors disabled:opacity-50"
                          >
                            {unhidingId === h.trelloCardId ? "Restoring…" : "Restore"}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
