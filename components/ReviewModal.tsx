"use client";

import { useState, useEffect, useRef } from "react";
import { TierPill } from "./TierPill";
import { scoreTier } from "@/lib/scoring";
import type { ScoredCard } from "@/app/api/cards/route";
import type { TrelloComment, TrelloAttachment } from "@/lib/trello";

type LeftTab = "desc" | "comments" | "photos" | "ai";

type FormState = {
  aiScore: string;
  notes: string;
  aiResponse: string;
};

type ReviewModalProps = {
  cards: ScoredCard[];
  initialIndex: number;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

function formFromCard(card: ScoredCard): FormState {
  return {
    aiScore: card.override?.aiScore != null ? String(card.override.aiScore) : "",
    notes: card.override?.notes ?? "",
    aiResponse: card.override?.aiResponse ?? "",
  };
}

export function ReviewModal({ cards, initialIndex, onClose, onSaved }: ReviewModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [idx, setIdx] = useState(initialIndex);
  const card = cards[idx];
  const rank = idx + 1;

  const [pushing, setPushing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState<FormState>(() => formFromCard(card));

  const [leftTab, setLeftTab] = useState<LeftTab>("desc");
  const [comments, setComments] = useState<TrelloComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [attachments, setAttachments] = useState<TrelloAttachment[]>([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
    return () => dialogRef.current?.close();
  }, []);

  useEffect(() => {
    setForm(formFromCard(cards[idx]));
    setSaveError("");
    setLeftTab("desc");
    setComments([]);
    setAttachments([]);
    setAiPanelOpen(false);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (leftTab !== "comments" || comments.length > 0) return;
    setCommentsLoading(true);
    fetch(`/api/cards/${card.id}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, [leftTab, card.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (leftTab !== "photos" || attachments.length > 0) return;
    setAttachmentsLoading(true);
    fetch(`/api/cards/${card.id}/attachments`)
      .then((r) => r.json())
      .then((data) => setAttachments(Array.isArray(data) ? data : []))
      .catch(() => setAttachments([]))
      .finally(() => setAttachmentsLoading(false));
  }, [leftTab, card.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
      if (e.key === "ArrowRight") { e.preventDefault(); setIdx((i) => Math.min(cards.length - 1, i + 1)); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cards.length]);

  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  async function saveOverride(sync: boolean): Promise<boolean> {
    const aiScore = form.aiScore.trim() !== "" ? parseInt(form.aiScore, 10) : null;
    const url = `/api/cards/${card.id}${sync ? `?sync=true&rank=${rank}` : ""}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aiScore, notes: form.notes, aiResponse: form.aiResponse }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setSaveError(body.error ?? `Server error ${res.status}`);
      return false;
    }
    setSaveError("");
    return true;
  }

  async function handleSave() {
    setPushing(true);
    const ok = await saveOverride(false);
    if (ok) {
      await onSaved();
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        if (idx < cards.length - 1) {
          setIdx((i) => i + 1);
        } else {
          onClose();
        }
      }, 1500);
    }
    setPushing(false);
  }

  const liveScore = form.aiScore.trim() !== "" ? parseInt(form.aiScore, 10) : null;
  const liveTier = scoreTier(liveScore);
  const hasPrev = idx > 0;
  const hasNext = idx < cards.length - 1;

  return (
    <>
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      onClose={onClose}
      className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl p-0 m-auto backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      style={{ height: "88vh" }}
    >
      <div className="relative flex flex-col h-full">
        {/* ── Saved toast — inside dialog so it renders in the top layer ── */}
        {saved && (
          <div className="toast-in fixed top-6 left-1/2 z-[9999] pointer-events-none" style={{ transform: "translateX(-50%)" }}>
            <div className="flex items-center gap-3.5 bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 shadow-2xl" style={{ boxShadow: "0 0 0 1px rgba(16,185,129,0.25), 0 24px 64px rgba(0,0,0,0.8)" }}>
              <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-100 text-sm font-semibold leading-tight">Card #{rank} saved</span>
                <span className="text-slate-500 text-xs mt-0.5">{hasNext ? "Moving to next card…" : "All done"}</span>
              </div>
            </div>
          </div>
        )}



        {/* ── Header ── */}
        <div className="flex items-start gap-4 px-5 py-4 border-b border-slate-800 shrink-0 select-none">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                onMouseDown={(e) => e.preventDefault()}
                disabled={!hasPrev}
                title="Previous card (←)"
                className="text-slate-500 hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-0.5 rounded hover:bg-slate-800"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span className="text-slate-600 text-xs font-mono tabular-nums select-none">
                #{rank} <span className="text-slate-700">/ {cards.length}</span>
              </span>
              <button
                onClick={() => setIdx((i) => Math.min(cards.length - 1, i + 1))}
                onMouseDown={(e) => e.preventDefault()}
                disabled={!hasNext}
                title="Next card (→)"
                className="text-slate-500 hover:text-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-0.5 rounded hover:bg-slate-800"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              {card.dateLastActivity && (
                <span className="text-slate-600 text-xs">
                  Last activity:{" "}
                  {new Date(card.dateLastActivity).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              )}
              {card.due && (
                <span className="text-amber-500 text-xs font-medium">
                  · Due {new Date(card.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </div>
            <h2 className="text-slate-100 font-semibold text-base leading-snug">{card.name}</h2>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <a
                href={card.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-brand text-xs transition-colors border border-slate-700 hover:border-brand/30 px-2.5 py-1 rounded-md"
              >
                Open in Trello ↗
              </a>
              <button
                onClick={() => setAiPanelOpen(true)}
                className="text-xs font-medium text-brand border border-brand/40 hover:bg-brand/10 px-2.5 py-1 rounded-md transition-colors"
              >
                Send to AI ✦
              </button>
              <button
                onClick={async () => {
                  await fetch(`/api/cards/${card.id}/hide`, { method: "POST" });
                  onClose();
                  onSaved();
                }}
                title="Hide this card from the board"
                className="text-slate-600 hover:text-red-400 text-xs transition-colors border border-slate-700 hover:border-red-500/30 px-2.5 py-1 rounded-md"
              >
                Hide card
              </button>
              <button
                onClick={onClose}
                className="text-slate-600 hover:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {liveScore != null && (
                <span className="text-slate-100 text-2xl font-bold font-mono leading-none">{liveScore}</span>
              )}
              <TierPill tier={liveTier} />
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 min-h-0">

          {/* Left panel */}
          <div className="flex flex-col flex-1 min-w-0 border-r border-slate-800">

            {/* Tab bar */}
            <div className="flex items-center gap-0 px-5 border-b border-slate-800 shrink-0 select-none">
              {(["desc", "comments", "photos", "ai"] as LeftTab[]).map((tab) => (
                <button
                  key={tab}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setLeftTab(tab)}
                  className={`px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                    leftTab === tab
                      ? "text-slate-200 border-brand"
                      : "text-slate-500 border-transparent hover:text-slate-400"
                  }`}
                >
                  {tab === "desc" ? "Description" : tab === "comments" ? "Comments" : tab === "photos" ? "Photos" : (
                    <span className="flex items-center gap-1">
                      AI Response
                      {form.aiResponse.trim() && <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {leftTab === "desc" && (
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {card.desc ? (
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{card.desc}</p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-700 text-sm italic">No description on this card.</p>
                  </div>
                )}
              </div>
            )}

            {leftTab === "comments" && (
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {commentsLoading && <p className="text-slate-600 text-xs">Loading comments…</p>}
                {!commentsLoading && comments.length === 0 && (
                  <p className="text-slate-700 text-sm italic">No comments on this card.</p>
                )}
                {comments.map((c) => {
                  const initials = c.memberCreator.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <div key={c.id} className="flex gap-3">
                      <div className="shrink-0 w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand text-[10px] font-bold select-none mt-0.5">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-slate-200 text-xs font-medium">{c.memberCreator.fullName}</span>
                          <span className="text-slate-600 text-[10px]">
                            {new Date(c.date).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap">{c.data.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {leftTab === "photos" && (
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {attachmentsLoading && <p className="text-slate-600 text-xs">Loading photos…</p>}
                {!attachmentsLoading && attachments.length === 0 && (
                  <p className="text-slate-700 text-sm italic">No photos attached to this card.</p>
                )}
                {attachments.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CopyAllPhotosButton srcs={attachments.map((a) => `/api/trello-image?src=${encodeURIComponent(a.url)}`)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {attachments.map((att) => {
                        const src = `/api/trello-image?src=${encodeURIComponent(att.url)}`;
                        return (
                          <div key={att.id} className="group relative rounded-lg overflow-hidden border border-slate-800 hover:border-slate-600 transition-colors bg-slate-900 aspect-video">
                            <button
                              onClick={() => setLightboxSrc(src)}
                              className="absolute inset-0 w-full h-full"
                              title={att.name}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={att.name} className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
                            </button>
                            <CopyImageButton src={src} />
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
            {leftTab === "ai" && (
              <div className="flex-1 flex flex-col min-h-0">
                {form.aiResponse.trim() ? (
                  <div className="flex-1 relative overflow-hidden">
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      {card.override?.updatedAt && (
                        <span className="text-[10px] text-slate-600 font-mono">
                          {new Date(card.override.updatedAt).toLocaleString("en-US", {
                            month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      )}
                      <CopyTextButton text={form.aiResponse} />
                      <button
                        onClick={() => setForm((f) => ({ ...f, aiResponse: "" }))}
                        className="text-[10px] text-slate-700 hover:text-slate-400 bg-slate-900/80 border border-slate-800 px-2 py-1 rounded transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="h-full overflow-y-auto scrollbar-thin px-5 pt-4 pb-4">
                      <AiResponseDisplay text={form.aiResponse} />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col px-5 py-4 gap-2">
                    <p className="text-slate-600 text-xs">Paste the AI&apos;s full markdown response here. It will be saved with this card so you can reference the analysis, score reasoning, and parts links later without re-prompting.</p>
                    <textarea
                      value={form.aiResponse}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const stripped = raw.replace(/^```[^\n]*\n?/, "").replace(/\n?```$/, "");
                        const scoreMatch = stripped.match(/\b(\d{1,3})\s*[·•\-]\s*(HIGH|MEDIUM|LOW)/i);
                        const noteMatch = stripped.match(/#+\s*\d*\.?\s*REPORT NOTE[^\n]*\n+([\s\S]*?)(?=\n#+\s*\d|$)/i);
                        const reportNote = noteMatch ? noteMatch[1].trim() : null;
                        setForm((f) => ({
                          ...f,
                          aiResponse: stripped,
                          ...(scoreMatch ? { aiScore: scoreMatch[1] } : {}),
                          ...(reportNote ? { notes: reportNote } : {}),
                        }));
                      }}
                      placeholder="Paste AI response here…"
                      className="flex-1 min-h-0 w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 text-slate-300 text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand resize-none leading-relaxed font-mono"
                    />
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Review panel */}
          <div className="w-56 xl:w-64 shrink-0 flex flex-col overflow-y-auto px-4 py-5 gap-5">

            {/* Tier indicator */}
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wide">Priority</span>
              <div className="flex gap-1.5">
                {(["HIGH", "MEDIUM", "LOW"] as const).map((tier) => {
                  const active = liveTier === tier;
                  const style = active
                    ? tier === "HIGH" ? "bg-red-500 border-red-400 text-white"
                      : tier === "MEDIUM" ? "bg-amber-500 border-amber-400 text-white"
                      : "bg-emerald-500 border-emerald-400 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-600";
                  return (
                    <div key={tier} className={`flex-1 py-2 text-xs font-semibold rounded-lg border text-center select-none ${style}`}>
                      {tier}
                    </div>
                  );
                })}
              </div>
              <p className="text-slate-600 text-[10px]">Auto-set from score · 67–100 High · 34–66 Medium · 1–33 Low</p>
            </div>

            {/* AI Score */}
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wide">AI Score</span>
              <input
                type="number"
                min={1}
                max={100}
                value={form.aiScore}
                onChange={(e) => setForm((f) => ({ ...f, aiScore: e.target.value }))}
                placeholder="1 – 100"
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand font-mono"
              />
              <p className="text-slate-600 text-[10px] leading-relaxed">Enter the score the AI assigned (1 = lowest, 100 = most urgent).</p>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wide">Notes</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={5}
                placeholder="Extra context for this job..."
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand resize-none leading-relaxed"
              />
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col border-t border-slate-800 bg-slate-900/80 shrink-0">
          <div className="flex items-center justify-between gap-3 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                Cancel
              </button>
              {saveError && <span className="text-red-400 text-xs font-mono">{saveError}</span>}
            </div>
            <button
              onClick={handleSave}
              disabled={pushing}
              className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover disabled:opacity-40 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              {pushing ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </>
              ) : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxSrc(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt="Attachment"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={() => setLightboxSrc(null)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl leading-none">
            ×
          </button>
        </div>
      )}

      {aiPanelOpen && (
        <AiPanel
          card={card}
          comments={comments}
          commentsLoading={commentsLoading}
          attachments={attachments}
          attachmentsLoading={attachmentsLoading}
          onFetchComments={() => {
            if (comments.length > 0 || commentsLoading) return;
            setCommentsLoading(true);
            fetch(`/api/cards/${card.id}/comments`)
              .then((r) => r.json())
              .then((data) => setComments(Array.isArray(data) ? data : []))
              .catch(() => setComments([]))
              .finally(() => setCommentsLoading(false));
          }}
          onFetchAttachments={() => {
            if (attachments.length > 0 || attachmentsLoading) return;
            setAttachmentsLoading(true);
            fetch(`/api/cards/${card.id}/attachments`)
              .then((r) => r.json())
              .then((data) => setAttachments(Array.isArray(data) ? data : []))
              .catch(() => setAttachments([]))
              .finally(() => setAttachmentsLoading(false));
          }}
          onClose={() => setAiPanelOpen(false)}
        />
      )}
    </dialog>
    </>
  );
}

function CopyImageButton({ src }: { src: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const pngBlob = blob.type === "image/png" ? blob : await convertToPng(blob);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 hover:bg-black/90 text-white text-[11px] px-2 py-1 rounded flex items-center gap-1"
    >
      {state === "copied" ? "Copied!" : state === "error" ? "Failed" : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

async function convertToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("load failed")); };
    img.src = url;
  });
}

function CopyAllPhotosButton({ srcs }: { srcs: string[] }) {
  const [state, setState] = useState<"idle" | "loading" | "copied" | "error">("idle");
  const [skipped, setSkipped] = useState(0);

  async function handleCopyAll() {
    setState("loading");
    setSkipped(0);

    let skippedCount = 0;

    // Build the blob asynchronously, but pass the Promise to ClipboardItem
    // so clipboard.write() is called immediately within the user-gesture window.
    const blobPromise: Promise<Blob> = (async () => {
      const results = await Promise.all(
        srcs.map(async (src) => {
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const res = await fetch(src, attempt === 1 ? { cache: "reload" } : {});
              const blob = await res.blob();
              return await createImageBitmap(blob);
            } catch {
              if (attempt === 1) return null;
            }
          }
          return null;
        })
      );
      const bitmaps = results.filter((b): b is ImageBitmap => b !== null);
      if (bitmaps.length === 0) throw new Error("No supported photos");
      skippedCount = srcs.length - bitmaps.length;

      const cols = 2;
      const cellW = 800;
      const cellH = 600;
      const rows = Math.ceil(bitmaps.length / cols);
      const canvas = document.createElement("canvas");
      canvas.width = cols * cellW;
      canvas.height = rows * cellH;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      bitmaps.forEach((bmp, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * cellW;
        const y = row * cellH;
        const scale = Math.max(cellW / bmp.width, cellH / bmp.height);
        const sw = cellW / scale;
        const sh = cellH / scale;
        const sx = (bmp.width - sw) / 2;
        const sy = (bmp.height - sh) / 2;
        ctx.drawImage(bmp, sx, sy, sw, sh, x, y, cellW, cellH);
        bmp.close();
      });

      return new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
      );
    })();

    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
      setSkipped(skippedCount);
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    } catch (e) {
      console.error("CopyAllPhotos failed:", e);
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  const label =
    state === "loading" ? "Building grid…"
    : state === "copied" ? (skipped > 0 ? `Copied (${skipped} HEIC skipped)` : "All photos copied!")
    : state === "error" ? "No supported photos"
    : "Copy all photos";

  return (
    <button
      onClick={handleCopyAll}
      disabled={state === "loading"}
      className="flex items-center gap-2 self-start text-xs bg-brand/20 hover:bg-brand/30 text-brand border border-brand/30 px-3 py-1.5 rounded-md transition-colors disabled:opacity-60"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {label}
    </button>
  );
}

function getCardCreationDate(cardId: string): Date {
  return new Date(parseInt(cardId.substring(0, 8), 16) * 1000);
}

function buildPrompt(card: ScoredCard, comments: TrelloComment[]): string {
  const createdAt = getCardCreationDate(card.id);
  const daysInShop = Math.floor((Date.now() - createdAt.getTime()) / 86_400_000);
  const droppedOff = createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const descBlock = card.desc.trim()
    ? `"""\n${card.desc.trim()}\n"""`
    : "(no description provided)";

  const commentsBlock = comments.length === 0
    ? "(none)"
    : comments.map((c) => {
        const date = new Date(c.date).toLocaleString("en-GB", {
          day: "numeric", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        });
        return `[${date} – ${c.memberCreator.fullName}]: ${c.data.text}`;
      }).join("\n");

  return `You are helping RNRPC Repair, a PC repair shop in Palm Desert, CA manage their repair queue. Customers are mixed age and demographic — do not assume tech literacy. Card names follow this pattern: [Customer Name] – [Device & Issue] [Phone Number]. The description is an AI-generated summary of a customer phone call intake — not the customer's exact words. Technician comments contain repair progress updates and logs of customer communication (calls made, approvals given, follow-ups attempted).

JOB: "${card.name}"
TRELLO: ${card.shortUrl}
DROPPED OFF: ${droppedOff} — ${daysInShop} day${daysInShop !== 1 ? "s" : ""} ago

DESCRIPTION:
${descBlock}

TECHNICIAN COMMENTS (${comments.length}):
${commentsBlock}

The photos of the device are attached separately in the next message.

---
Wrap your **entire response** in a single markdown code block (triple backticks) so it can be copied in one click. Use the exact section headings below inside the code block. Do not include citation markers, reference annotations, or footnotes of any kind (e.g. :contentReference, [oaicite], etc.) anywhere in your response.

## 1. SCORE
State the number (1–100) and tier on one line.
Format: \`[number] · [HIGH / MEDIUM / LOW]\`
Tier thresholds: 67–100 = HIGH · 34–66 = MEDIUM · 1–33 = LOW

Score using these factors in order of importance:

**A. SERVICE TYPE & COMPLEXITY** (most important)
- Data recovery, motherboard repair, liquid damage → 75–90 (complex, high risk of loss)
- Screen replacement, charging port, RAM/storage upgrade → 45–65
- OS reinstall, software issue, basic diagnostics, password reset → 15–35

**B. PRIORITY FEE PAID**
- Customer paid a priority or rush service fee → significant score boost
- No mention → neutral; do not penalise

**C. TICKET VALUE**
- High-value / expensive repair → score higher
- Low-cost or free diagnostic → score lower

**D. DAYS IN SHOP**
- Every week adds urgency, but does not override service type
- A 90-day OS reinstall is still less urgent than a 7-day data recovery

**E. CUSTOMER URGENCY SIGNALS**
- Customers do not comment on Trello directly — look for urgency in the description (words like urgent, ASAP, need for work, need for school, hard deadline) and in technician comments (customer called repeatedly, expressed frustration, mentioned a deadline, approved a quote)
- Business-critical device (work laptop, POS system) → score higher
- No urgency signals found → neutral

**F. REPAIR PROGRESS & ACTIONABILITY**
- Actively in progress, no blockers → score higher
- Parts ordered / waiting to arrive → reduce score by 15–20 points, but never below the floor of the service type (e.g. a data recovery waiting on parts stays above 55, not below)
- Waiting for customer approval or go-signal → reduce score by 10–15 points (cannot proceed without response)
- Customer stopped responding for weeks → flag as possible abandonment, score lower

## 2. STATUS SUMMARY
Write 3–5 sentences covering the current state of this repair. Include:
- What the repair is and how complex it is
- How long the device has been in the shop and whether progress is being made
- What the technician comments reveal about repair progress and customer communication
- Any red flags: customer stopped responding, waiting on parts, unpaid deposit, device possibly abandoned, stalled repair

## 3. REPORT NOTE
Write exactly 2 lines. Line 1: why this job is ranked where it is. Line 2: start with "→ " then state the single most important action the technician must take today — be specific and direct (e.g. "→ Call customer to approve $180 screen replacement before ordering part.", "→ No response in 14 days — follow up or consider closing the ticket.", "→ Part arrived — begin repair today."). Written for a technician reading a quick morning report. No jargon, no bullet points.

## 4. PARTS NEEDED
List every part identifiable from the description and comments:
- [Part name & full specification] — [Compatibility notes] — [Search term to find it on Amazon/iFixit/eBay]

If no parts are identifiable, write: None identified.`;
}

function AiPanel({
  card,
  comments,
  commentsLoading,
  attachments,
  attachmentsLoading,
  onFetchComments,
  onFetchAttachments,
  onClose,
}: {
  card: ScoredCard;
  comments: TrelloComment[];
  commentsLoading: boolean;
  attachments: TrelloAttachment[];
  attachmentsLoading: boolean;
  onFetchComments: () => void;
  onFetchAttachments: () => void;
  onClose: () => void;
}) {
  const [promptCopied, setPromptCopied] = useState(false);

  useEffect(() => {
    onFetchComments();
    onFetchAttachments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const attachmentSrcs = attachments.map((a) => `/api/trello-image?src=${encodeURIComponent(a.url)}`);
  const prompt = buildPrompt(card, comments);

  async function handleCopyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  }

  return (
    <div className="absolute inset-0 z-50 flex" style={{ borderRadius: "inherit" }}>
      <div className="absolute inset-0 bg-slate-950/80" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-slate-900 border-l border-slate-700 flex flex-col shadow-2xl" style={{ borderRadius: "0 0.75rem 0.75rem 0" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <span className="text-sm font-semibold text-slate-200">Send to AI ✦</span>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 text-xl leading-none transition-colors">×</button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto flex-1 px-5 py-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Step 1 — Copy prompt, paste into AI</p>
            {commentsLoading && <p className="text-xs text-slate-600 italic">Loading comments…</p>}
            <pre className="text-[11px] text-slate-400 bg-slate-800 rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto border border-slate-700 font-mono">
              {prompt}
            </pre>
            <button
              onClick={handleCopyPrompt}
              className="self-start flex items-center gap-2 text-xs font-medium bg-brand text-white hover:bg-brand-hover px-3 py-1.5 rounded-md transition-colors"
            >
              {promptCopied ? "Copied!" : "Copy prompt"}
            </button>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-800 pt-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Step 2 — Copy photos, paste into AI</p>
            {attachmentsLoading ? (
              <p className="text-xs text-slate-600 italic">Loading photos…</p>
            ) : attachmentSrcs.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No photos attached to this card.</p>
            ) : (
              <>
                <p className="text-xs text-slate-500">{attachmentSrcs.length} photo{attachmentSrcs.length !== 1 ? "s" : ""} will be combined into one grid image.</p>
                <CopyAllPhotosButton srcs={attachmentSrcs} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyTextButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy response"}
      className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-medium transition-all ${
        copied
          ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
          : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function AiResponseDisplay({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="flex flex-col gap-0.5 text-xs leading-relaxed">
      {lines.map((line, i) => {
        if (/^###\s/.test(line)) {
          return <p key={i} className="text-slate-200 font-semibold text-sm mt-3 first:mt-0">{line.replace(/^###\s/, "")}</p>;
        }
        if (/^##\s/.test(line)) {
          return <p key={i} className="text-slate-100 font-bold text-sm mt-4 first:mt-0">{line.replace(/^##\s/, "")}</p>;
        }
        if (/^#\s/.test(line)) {
          return <p key={i} className="text-slate-100 font-bold text-base mt-4 first:mt-0">{line.replace(/^#\s/, "")}</p>;
        }
        if (/^[-•*]\s/.test(line)) {
          return (
            <div key={i} className="flex gap-2 text-slate-400">
              <span className="text-brand shrink-0 mt-0.5">•</span>
              <span>{renderInline(line.replace(/^[-•*]\s/, ""))}</span>
            </div>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.*)/);
          return (
            <div key={i} className="flex gap-2 text-slate-400">
              <span className="text-slate-500 shrink-0 font-mono">{match?.[1]}.</span>
              <span>{renderInline(match?.[2] ?? "")}</span>
            </div>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        if (/^---+$/.test(line.trim())) return <hr key={i} className="border-slate-800 my-2" />;
        return <p key={i} className="text-slate-400">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|https?:\/\/\S+)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i} className="text-slate-200 font-semibold">{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
    if (/^`[^`]+`$/.test(part)) return <code key={i} className="text-brand bg-slate-800 px-1 py-0.5 rounded text-[10px] font-mono">{part.slice(1, -1)}</code>;
    if (/^https?:\/\/\S+$/.test(part)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline break-all">{part}</a>;
    return part;
  });
}
