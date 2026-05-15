"use client";

import { useState, useRef, useEffect } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

type Message = { role: "user" | "assistant"; content: string };

type AiResult = {
  possibleIssues: string[];
  askCustomer: string[];
  script: string;
  ifTheyAskPrice: string;
  ifTheyInsist: string;
  pricing: string;
  turnaround: string;
  location: string;
  dataBackup: boolean | null;
  confidence: "high" | "medium" | "low";
};

type Turn = {
  input: string;
  result: AiResult | null;
  raw?: string;
};

const BEHAVIOR_CUES = [
  { id: "easy-going", label: "Easy Going" },
  { id: "questions", label: "Asking Questions" },
  { id: "rush", label: "In a Rush" },
  { id: "upset", label: "Upset" },
  { id: "price", label: "Price Focused" },
  { id: "confused", label: "Confused" },
  { id: "elderly", label: "Elderly" },
];

export function CsrAssistant() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [activeCues, setActiveCues] = useState<Set<string>>(new Set());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [savePhone, setSavePhone] = useState("");
  const [saveDevice, setSaveDevice] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function toggleCue(id: string) {
    setActiveCues((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, loading]);

  async function submit() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setLoading(true);

    const cueLabels = BEHAVIOR_CUES.filter((c) => activeCues.has(c.id)).map((c) => c.label);
    const msgWithContext =
      cueLabels.length > 0
        ? `${msg}\n\n[Customer cues: ${cueLabels.join(", ")}]`
        : msg;

    const newHistory: Message[] = [...history, { role: "user", content: msgWithContext }];

    try {
      const res = await fetch("/api/csr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgWithContext, history }),
      });
      const data = await res.json();
      const assistantMsg = data.assistantMessage ?? data.raw ?? "";
      setHistory([...newHistory, { role: "assistant", content: assistantMsg }]);
      setTurns((prev) => [...prev, { input: msg, result: data.result, raw: data.raw }]);
    } catch {
      setTurns((prev) => [...prev, { input: msg, result: null }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  async function saveLead() {
    setSaving(true);
    const issue = turns[0]?.input ?? null;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName: saveName, phone: savePhone, device: saveDevice, issue, turns }),
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setShowSaveModal(false);
      setSavedSuccess(false);
      setSaveName("");
      setSavePhone("");
      setSaveDevice("");
    }, 1500);
  }

  function newCall() {
    setTurns([]);
    setHistory([]);
    setInput("");
    setActiveCues(new Set());
    setShowSaveModal(false);
    setSaveName("");
    setSavePhone("");
    inputRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const confidenceColor = (c: string) =>
    c === "high" ? "text-emerald-400" : c === "medium" ? "text-amber-400" : "text-slate-500";

  return (
    <div className="bg-slate-950 flex flex-col h-screen">
      <Topbar label="CSR Assistant" total={0} high={0} medium={0} low={0} pending={0} reviewed={0} lastUpdated={null} hiddenCount={0} onHidden={() => {}} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 shrink-0">
            <div>
              <p className="text-sm font-semibold text-slate-200">Live Call Assistant</p>
              <p className="text-xs text-slate-500">Type what the customer says — press Enter to get guidance</p>
            </div>
            <div className="flex items-center gap-2">
              {turns.length > 0 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand/15 text-brand hover:bg-brand/25 border border-brand/30 transition-colors"
                >
                  Save Lead
                </button>
              )}
              <button
                onClick={newCall}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                End Call
              </button>
            </div>
          </div>

          {/* Save Lead Modal */}
          {showSaveModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-xl">
                {savedSuccess ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-200">Lead saved</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-200 mb-1">Save Lead</p>
                    <p className="text-xs text-slate-500 mb-4">Optionally add customer info before saving the conversation.</p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Customer name (optional)"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="Phone number (optional)"
                        value={savePhone}
                        onChange={(e) => setSavePhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="Device brand / model (optional)"
                        value={saveDevice}
                        onChange={(e) => setSaveDevice(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setShowSaveModal(false)}
                        className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveLead}
                        disabled={saving}
                        className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-brand text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {saving ? "Saving…" : "Save Lead"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6" style={{ scrollbarWidth: "none" }}>

            {turns.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.42 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l1.86-1.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">Type what the customer is describing to get started</p>
                <p className="text-slate-700 text-xs max-w-sm">Example: "My laptop turns on but the screen stays black" or "My computer is really slow and has pop-ups"</p>
              </div>
            )}

            {turns.map((turn, i) => (
              <div key={i} className="space-y-3">
                {/* Customer input — right aligned */}
                <div className="flex items-end justify-end">
                  <div className="max-w-[70%]">
                    <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-slate-200">
                      {turn.input}
                    </div>
                  </div>
                </div>

                {/* AI result */}
                {turn.result && (
                  <div className="flex-1 space-y-3">

                      {/* 70/30 layout */}
                      <div className="flex gap-3 items-start">

                        {/* Left — 70% */}
                        <div className="flex-[7] space-y-3 min-w-0">

                          {/* Say This */}
                          <div className="bg-brand/10 border border-brand/25 rounded-xl px-4 py-3">
                            <p className="text-[10px] font-semibold text-brand uppercase tracking-wider mb-1.5">Say This to the Customer</p>
                            <p className="text-sm text-slate-200 leading-relaxed">"{turn.result.script}"</p>
                          </div>

                          {/* If They Ask About Price */}
                          {(turn.result.ifTheyAskPrice || turn.result.ifTheyInsist) && (
                            <div className="border border-slate-700/50 rounded-xl overflow-hidden">
                              <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-700/50">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">If They Ask About Price</p>
                              </div>
                              <div className="divide-y divide-slate-800">
                                {turn.result.ifTheyAskPrice && (
                                  <div className="px-4 py-3">
                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Starting price + redirect</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">"{turn.result.ifTheyAskPrice}"</p>
                                  </div>
                                )}
                                {turn.result.ifTheyInsist && (
                                  <div className="px-4 py-3">
                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">If they still push</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">"{turn.result.ifTheyInsist}"</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Meta row */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Turnaround</p>
                              <p className="text-sm font-medium text-slate-300">{turn.result.turnaround || "—"}</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Service</p>
                              <p className="text-sm font-medium text-slate-300">{turn.result.location || "—"}</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Confidence</p>
                              <p className={`text-sm font-medium capitalize ${confidenceColor(turn.result.confidence)}`}>{turn.result.confidence}</p>
                            </div>
                          </div>

                        </div>

                        {/* Right — 30% */}
                        <div className="flex-[3] space-y-3 min-w-0">

                          {turn.result.possibleIssues?.length > 0 && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Possible Issues</p>
                              <ul className="space-y-1.5">
                                {turn.result.possibleIssues.map((issue, j) => (
                                  <li key={j} className="text-sm text-slate-300 flex gap-2">
                                    <span className="text-slate-600 shrink-0">•</span>{issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {turn.result.dataBackup === true && (
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                              <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Ask About Data</p>
                              <p className="text-sm text-amber-200">"Do you have any important files or photos on this device that you'd need saved?"</p>
                            </div>
                          )}

                          {turn.result.askCustomer?.length > 0 && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Follow Up Questions</p>
                              <ul className="space-y-1.5">
                                {turn.result.askCustomer.map((q, j) => (
                                  <li key={j} className="text-sm text-slate-300 flex gap-2">
                                    <span className="text-slate-600 shrink-0">?</span>{q}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                )}

                {/* Parse error fallback */}
                {!turn.result && turn.raw && (
                  <div className="flex gap-2 items-start">
                    <span className="shrink-0 text-[10px] font-semibold text-brand uppercase tracking-wider mt-1 w-12 text-right">AI</span>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex-1 text-sm text-slate-400 whitespace-pre-wrap">{turn.raw}</div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center">
                <span className="shrink-0 text-[10px] font-semibold text-brand uppercase tracking-wider w-12 text-right">AI</span>
                <div className="flex gap-1.5 px-4 py-3">
                  {[0, 1, 2].map((n) => (
                    <span key={n} className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: `${n * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Customer Cues */}
          {turns.length > 0 && (
            <div className="shrink-0 border-t border-slate-800/60 px-6 py-2.5 flex items-center gap-3">
              <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider shrink-0">Customer</span>
              <div className="flex flex-wrap gap-1.5">
                {BEHAVIOR_CUES.map((cue) => {
                  const active = activeCues.has(cue.id);
                  return (
                    <button
                      key={cue.id}
                      onClick={() => toggleCue(cue.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                        active
                          ? "bg-brand/15 border-brand/40 text-brand"
                          : "bg-transparent border-slate-700 text-slate-600 hover:text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {cue.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="shrink-0 border-t border-slate-800 px-6 py-4">
            <div className="flex gap-3 items-stretch">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type what the customer says… (Enter to send, Shift+Enter for new line)"
                rows={2}
                className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 resize-none transition-colors"
              />
              <button
                onClick={submit}
                disabled={!input.trim() || loading}
                className="px-5 bg-brand text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
              >
                Send
              </button>
            </div>
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}
