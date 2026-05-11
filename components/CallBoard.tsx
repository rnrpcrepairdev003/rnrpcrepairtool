"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { CallAiPanel } from "./CallAiPanel";
import type { CallRecord } from "./CallAiPanel";

const AUTO_REFRESH_MS = 3 * 60 * 1000;

function AiResponseDisplay({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="flex flex-col gap-0.5 text-xs leading-relaxed">
      {lines.map((line, i) => {
        if (/^###\s/.test(line)) return <p key={i} className="text-slate-200 font-semibold text-sm mt-3 first:mt-0">{line.replace(/^###\s/, "")}</p>;
        if (/^##\s/.test(line)) return <p key={i} className="text-slate-100 font-bold text-sm mt-4 first:mt-0">{line.replace(/^##\s/, "")}</p>;
        if (/^#\s/.test(line)) return <p key={i} className="text-slate-100 font-bold text-base mt-4 first:mt-0">{line.replace(/^#\s/, "")}</p>;
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

type DetailTab = "transcript" | "ai";

function CallDetail({
  call,
  onClose,
  onSaved,
}: {
  call: CallRecord;
  onClose: () => void;
  onSaved: (updated: CallRecord) => void;
}) {
  const [tab, setTab] = useState<DetailTab>("transcript");
  const [transcript, setTranscript] = useState(call.transcript ?? "");
  const [aiResponse, setAiResponse] = useState(call.aiResponse ?? "");
  const [reviewed, setReviewed] = useState(call.reviewed);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // sync when selected call changes
  useEffect(() => {
    setTranscript(call.transcript ?? "");
    setAiResponse(call.aiResponse ?? "");
    setReviewed(call.reviewed);
    setTab("transcript");
    setSaveError("");
    setAiPanelOpen(false);
  }, [call.threecxCallId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch(`/api/3cx/calls/${call.threecxCallId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, aiResponse, reviewed }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSaveError(body.error ?? `Server error ${res.status}`);
        return;
      }
      const updated: CallRecord = await res.json();
      onSaved(updated);
    } finally {
      setSaving(false);
    }
  }

  const callWithCurrentData: CallRecord = { ...call, transcript, aiResponse, reviewed };

  const date = new Date(call.callDate).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const directionColor = call.direction?.toLowerCase().includes("inbound")
    ? "text-emerald-400"
    : "text-slate-500";

  return (
    <div className="relative flex flex-col h-full bg-slate-900 border-l border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-medium ${directionColor}`}>
              {call.direction ?? "Call"}
            </span>
            {call.status && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                call.status.toLowerCase() === "answered"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : call.status.toLowerCase() === "unanswered"
                  ? "bg-red-500/15 text-red-400"
                  : "bg-slate-700 text-slate-400"
              }`}>
                {call.status}
              </span>
            )}
          </div>
          <p className="text-slate-100 text-sm font-semibold font-mono">{call.callerPhone}</p>
          {call.callerName && <p className="text-slate-500 text-xs">{call.callerName}</p>}
          <p className="text-slate-600 text-[10px] mt-0.5">{date}{call.duration ? ` · ${call.duration}` : ""}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAiPanelOpen(true)}
            className="text-xs font-medium text-brand border border-brand/40 hover:bg-brand/10 px-2.5 py-1 rounded-md transition-colors"
          >
            Send to AI ✦
          </button>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Recording link */}
      {call.recordingUrl && (
        <div className="px-4 py-2 border-b border-slate-800 shrink-0">
          <a
            href={call.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-brand hover:text-brand-hover border border-brand/30 hover:border-brand/60 px-3 py-1 rounded-md transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download recording
          </a>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 shrink-0 px-4">
        {(["transcript", "ai"] as DetailTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "text-slate-200 border-brand"
                : "text-slate-500 border-transparent hover:text-slate-400"
            }`}
          >
            {t === "transcript" ? "Transcript" : (
              <span className="flex items-center gap-1">
                AI Response
                {aiResponse.trim() && <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {tab === "transcript" && (
          <div className="flex-1 flex flex-col px-4 py-3 gap-2">
            <p className="text-slate-600 text-[10px]">
              Download the recording → send to Otter.ai → paste the transcript below.
            </p>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste Otter.ai transcript here…"
              className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 text-slate-300 text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand resize-none leading-relaxed font-mono min-h-0"
            />
          </div>
        )}

        {tab === "ai" && (
          <div className="flex-1 flex flex-col min-h-0">
            {aiResponse.trim() ? (
              <div className="flex-1 relative overflow-hidden">
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <CopyTextButton text={aiResponse} />
                  <button
                    onClick={() => setAiResponse("")}
                    className="text-[10px] text-slate-700 hover:text-slate-400 bg-slate-900/80 border border-slate-800 px-2 py-1 rounded transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="h-full overflow-y-auto scrollbar-thin px-4 pt-4 pb-4">
                  <AiResponseDisplay text={aiResponse} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col px-4 py-3 gap-2">
                <p className="text-slate-600 text-[10px]">Paste the AI&apos;s full markdown response here. It will be saved with this call record.</p>
                <textarea
                  value={aiResponse}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const stripped = raw.replace(/^```[^\n]*\n?/, "").replace(/\n?```$/, "");
                    setAiResponse(stripped);
                  }}
                  placeholder="Paste AI response here…"
                  className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 text-slate-300 text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand resize-none leading-relaxed font-mono min-h-0"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-800 shrink-0 bg-slate-900/80">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={reviewed}
            onChange={(e) => setReviewed(e.target.checked)}
            className="accent-brand"
          />
          <span className="text-slate-500 text-xs">Reviewed</span>
        </label>
        <div className="flex items-center gap-3">
          {saveError && <span className="text-red-400 text-xs font-mono">{saveError}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-brand hover:bg-brand-hover disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </>
            ) : "Save"}
          </button>
        </div>
      </div>

      {aiPanelOpen && (
        <CallAiPanel call={callWithCurrentData} onClose={() => setAiPanelOpen(false)} />
      )}
    </div>
  );
}

export function CallBoard() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCalls = useCallback(async (silent = false) => {
    if (!silent) setError("");
    try {
      const res = await fetch("/api/3cx/calls");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      const data: CallRecord[] = await res.json();
      setCalls(data);
      setLastUpdated(new Date());
      setError("");
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : "Failed to load calls");
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleRefresh = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchCalls(true);
      scheduleRefresh();
    }, AUTO_REFRESH_MS);
  }, [fetchCalls]);

  useEffect(() => {
    fetchCalls(false);
    scheduleRefresh();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [fetchCalls, scheduleRefresh]);

  const selectedCall = calls.find((c) => c.threecxCallId === selectedId) ?? null;
  const reviewed = calls.filter((c) => c.reviewed).length;

  function handleSaved(updated: CallRecord) {
    setCalls((prev) => prev.map((c) => c.threecxCallId === updated.threecxCallId ? updated : c));
  }

  return (
    <div className="bg-slate-950 flex flex-col h-screen">
      <Topbar
        total={calls.length}
        high={0}
        medium={0}
        low={0}
        pending={calls.length}
        reviewed={reviewed}
        lastUpdated={lastUpdated}
        hiddenCount={0}
        onHidden={() => {}}
        label="3CX Calls"
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="overflow-hidden flex-1 min-h-0 flex flex-col">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading calls…
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
                <p className="text-slate-300 text-sm font-medium mb-1">Failed to load calls</p>
                <p className="text-slate-600 text-xs font-mono max-w-sm">{error}</p>
              </div>
              <button
                onClick={() => { setLoading(true); fetchCalls(false); }}
                className="text-sm text-white bg-brand hover:bg-brand-hover px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className={`flex flex-1 min-h-0 ${selectedCall ? "grid grid-cols-[1fr_380px]" : ""}`}>
              {/* Call list */}
              <div className="overflow-y-auto scrollbar-thin flex flex-col">
                {calls.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-slate-600 text-sm">
                    No call records found.
                  </div>
                ) : (
                  calls.map((call) => {
                    const isSelected = call.threecxCallId === selectedId;
                    const isInbound = call.direction?.toLowerCase().includes("inbound");
                    const date = new Date(call.callDate).toLocaleString("en-GB", {
                      day: "numeric", month: "short",
                      hour: "2-digit", minute: "2-digit",
                    });
                    return (
                      <button
                        key={call.threecxCallId}
                        onClick={() => setSelectedId(isSelected ? null : call.threecxCallId)}
                        className={`flex items-center gap-3 px-4 py-3 border-b border-slate-800/60 text-left transition-colors w-full ${
                          isSelected ? "bg-slate-800/60" : "hover:bg-slate-900/50"
                        }`}
                      >
                        {/* Direction arrow */}
                        <span className={`shrink-0 text-base ${isInbound ? "text-emerald-400" : "text-slate-600"}`} title={call.direction ?? ""}>
                          {isInbound ? "↓" : "↑"}
                        </span>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-200 text-sm font-mono font-medium truncate">{call.callerPhone}</span>
                            {call.callerName && (
                              <span className="text-slate-500 text-xs truncate">{call.callerName}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-slate-600 text-[10px]">{date}</span>
                            {call.duration && <span className="text-slate-700 text-[10px]">· {call.duration}</span>}
                          </div>
                        </div>

                        {/* Status + reviewed */}
                        <div className="flex items-center gap-2 shrink-0">
                          {call.status && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              call.status.toLowerCase() === "answered"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : call.status.toLowerCase() === "unanswered"
                                ? "bg-red-500/15 text-red-400"
                                : "bg-slate-700 text-slate-400"
                            }`}>
                              {call.status}
                            </span>
                          )}
                          <span className={`text-[10px] ${call.reviewed ? "text-brand" : "text-slate-800"}`}>✓</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Detail panel */}
              {selectedCall && (
                <CallDetail
                  call={selectedCall}
                  onClose={() => setSelectedId(null)}
                  onSaved={handleSaved}
                />
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
