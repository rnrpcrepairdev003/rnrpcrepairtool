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
  pricing: string;
  turnaround: string;
  location: string;
  dataBackup: boolean | null;
  urgent: boolean;
  warning: string | null;
  confidence: "high" | "medium" | "low";
};

type Turn = {
  input: string;
  result: AiResult | null;
  raw?: string;
};

export function CsrAssistant() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, loading]);

  async function submit() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setLoading(true);

    const newHistory: Message[] = [...history, { role: "user", content: msg }];

    try {
      const res = await fetch("/api/csr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
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

  function newCall() {
    setTurns([]);
    setHistory([]);
    setInput("");
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
            <button
              onClick={newCall}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              New Call
            </button>
          </div>

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
                {/* Customer input */}
                <div className="flex gap-2 items-start">
                  <span className="shrink-0 text-[10px] font-semibold text-slate-600 uppercase tracking-wider mt-1 w-12 text-right">Kate</span>
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-slate-300 flex-1">
                    {turn.input}
                  </div>
                </div>

                {/* AI result */}
                {turn.result && (
                  <div className="flex gap-2 items-start">
                    <span className="shrink-0 text-[10px] font-semibold text-brand uppercase tracking-wider mt-1 w-12 text-right">AI</span>
                    <div className="flex-1 space-y-3">

                      {/* Warning */}
                      {turn.result.urgent && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">
                          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-0.5">⚠ Urgent</p>
                          <p className="text-sm text-red-300">This issue requires immediate attention — prioritize this call.</p>
                        </div>
                      )}
                      {turn.result.warning && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5">
                          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-0.5">⚠ Warning</p>
                          <p className="text-sm text-amber-300">{turn.result.warning}</p>
                        </div>
                      )}

                      {/* Script */}
                      <div className="bg-brand/10 border border-brand/25 rounded-xl px-4 py-3">
                        <p className="text-[10px] font-semibold text-brand uppercase tracking-wider mb-1.5">Say This to the Customer</p>
                        <p className="text-sm text-slate-200 leading-relaxed">"{turn.result.script}"</p>
                      </div>

                      {/* Grid: issues + questions */}
                      <div className="grid grid-cols-2 gap-3">
                        {turn.result.possibleIssues?.length > 0 && (
                          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Possible Issue</p>
                            <ul className="space-y-1">
                              {turn.result.possibleIssues.map((issue, j) => (
                                <li key={j} className="text-sm text-slate-300 flex gap-2">
                                  <span className="text-slate-600 shrink-0">•</span>{issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {turn.result.askCustomer?.length > 0 && (
                          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Ask the Customer</p>
                            <ul className="space-y-1">
                              {turn.result.askCustomer.map((q, j) => (
                                <li key={j} className="text-sm text-slate-300 flex gap-2">
                                  <span className="text-slate-600 shrink-0">?</span>{q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Pricing</p>
                          <p className="text-sm font-medium text-slate-200">{turn.result.pricing || "—"}</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Turnaround</p>
                          <p className="text-sm font-medium text-slate-200">{turn.result.turnaround || "—"}</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Service</p>
                          <p className="text-sm font-medium text-slate-200">{turn.result.location || "—"}</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Confidence</p>
                          <p className={`text-sm font-medium capitalize ${confidenceColor(turn.result.confidence)}`}>{turn.result.confidence}</p>
                        </div>
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

          {/* Input */}
          <div className="shrink-0 border-t border-slate-800 px-6 py-4">
            <div className="flex gap-3 items-end">
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
                className="px-4 py-3 bg-brand text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
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
