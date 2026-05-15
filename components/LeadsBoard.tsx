"use client";

import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

type Turn = {
  input: string;
  result: {
    script: string;
    ifTheyAskPrice: string;
    ifTheyInsist: string;
    possibleIssues: string[];
    askCustomer: string[];
    pricing: string;
    turnaround: string;
    location: string;
    confidence: string;
    dataBackup: boolean | null;
  } | null;
  raw?: string;
};

type Lead = {
  id: string;
  createdAt: string;
  customerName: string | null;
  phone: string | null;
  device: string | null;
  issue: string | null;
  turns: string;
  status: string;
};

const STATUS_OPTIONS = ["new", "contacted", "booked", "closed"] as const;
type Status = typeof STATUS_OPTIONS[number];

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  contacted: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  booked: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  closed: "bg-slate-700/50 text-slate-500 border-slate-600/30",
};

const CONFIDENCE_DOT: Record<string, string> = {
  high: "bg-emerald-500",
  medium: "bg-amber-500",
  low: "bg-red-500",
};

export function LeadsBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [chatForm, setChatForm] = useState<{ note: string } | null>(null);
  const [sendingChat, setSendingChat] = useState(false);
  const [chatResult, setChatResult] = useState<{ error?: string; sent?: boolean } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => { setLeads(data); setLoading(false); });
  }, []);

  const parsedTurns = (lead: Lead): Turn[] => {
    try { return JSON.parse(lead.turns); } catch { return []; }
  };

  const lastConfidence = (lead: Lead): string | null => {
    const turns = parsedTurns(lead);
    for (let i = turns.length - 1; i >= 0; i--) {
      if (turns[i].result?.confidence) return turns[i].result!.confidence;
    }
    return null;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const filteredLeads = leads.filter((lead) => {
    const q = search.toLowerCase();
    return (
      (lead.customerName ?? "").toLowerCase().includes(q) ||
      (lead.phone ?? "").toLowerCase().includes(q) ||
      (lead.issue ?? "").toLowerCase().includes(q)
    );
  });

  const updateStatus = async (lead: Lead, status: Status) => {
    const updated = { ...lead, status };
    setLeads((prev) => prev.map((l) => l.id === lead.id ? updated : l));
    setSelected(updated);
    await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const deleteLead = async (lead: Lead) => {
    setDeleting(true);
    await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setSelected(null);
    setDeleting(false);
  };

  const sendToChat = async (lead: Lead) => {
    if (!chatForm) return;
    setSendingChat(true);
    setChatResult(null);
    const res = await fetch(`/api/leads/${lead.id}/send-to-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: chatForm.note }),
    });
    const data = await res.json();
    if (data.ok) {
      setChatResult({ sent: true });
      setChatForm(null);
    } else {
      setChatResult({ error: data.error ?? "Failed to send to Google Chat" });
    }
    setSendingChat(false);
  };

  return (
    <div className="bg-slate-950 flex flex-col h-screen">
      <Topbar
        label="Leads"
        total={0} high={0} medium={0} low={0} pending={0} reviewed={0}
        lastUpdated={null} hiddenCount={0} onHidden={() => {}}
        leadStats={{
          total: leads.length,
          newCount: leads.filter((l) => l.status === "new").length,
          contacted: leads.filter((l) => l.status === "contacted").length,
          booked: leads.filter((l) => l.status === "booked").length,
          closed: leads.filter((l) => l.status === "closed").length,
        }}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex min-h-0 overflow-hidden">

          {/* Lead list */}
          <div className="w-80 shrink-0 border-r border-slate-800 flex flex-col">
            {/* Search */}
            <div className="px-3 py-2.5 border-b border-slate-800 shrink-0">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, issue…"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <p className="text-xs text-slate-600">Loading…</p>
                </div>
              )}
              {!loading && filteredLeads.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 gap-2">
                  <p className="text-xs text-slate-600">
                    {search ? "No leads match your search" : "No leads saved yet"}
                  </p>
                </div>
              )}
              {filteredLeads.map((lead) => {
                const confidence = lastConfidence(lead);
                const status = lead.status as Status;
                return (
                  <button
                    key={lead.id}
                    onClick={() => { setSelected(lead); setChatForm(null); setChatResult(null); }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-800/60 transition-colors ${
                      selected?.id === lead.id ? "bg-brand/10 border-l-2 border-l-brand" : "hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {confidence && (
                          <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-0.5 ${CONFIDENCE_DOT[confidence] ?? "bg-slate-600"}`} />
                        )}
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {lead.customerName || "Unknown Customer"}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-600 shrink-0 mt-0.5">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    {lead.phone && (
                      <p className="text-xs text-slate-500 mt-0.5 pl-3">{lead.phone}</p>
                    )}
                    {lead.issue && (
                      <p className="text-xs text-slate-600 mt-1 pl-3 truncate">{lead.issue}</p>
                    )}
                    {status !== "new" && (
                      <span className={`inline-block mt-1.5 ml-3 text-[10px] px-1.5 py-0.5 rounded border capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.new}`}>
                        {status}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {!selected ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-slate-600">Select a lead to view the conversation</p>
              </div>
            ) : (
              <>
                {/* Lead header */}
                <div className="px-6 py-4 border-b border-slate-800 shrink-0 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-slate-200">
                        {selected.customerName || "Unknown Customer"}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {selected.phone && (
                          <p className="text-xs text-slate-400">{selected.phone}</p>
                        )}
                        <p className="text-xs text-slate-600">{formatDate(selected.createdAt)}</p>
                      </div>
                      {selected.device && (
                        <p className="text-xs text-slate-400 mt-1">{selected.device}</p>
                      )}
                      {selected.issue && (
                        <p className="text-xs text-slate-500 mt-1">{selected.issue}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Send to Chat */}
                      <button
                        onClick={() => { setChatForm({ note: "" }); setChatResult(null); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand/10 border border-brand/25 text-brand hover:bg-brand/20 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Send to Chat
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => deleteLead(selected)}
                        disabled={deleting}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                        {deleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>

                  {/* Chat form */}
                  {chatForm && (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 space-y-2.5">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Send to Google Chat</p>
                      <div>
                        <p className="text-[10px] text-slate-600 mb-1">Kate's Note</p>
                        <textarea
                          value={chatForm.note}
                          onChange={(e) => setChatForm({ ...chatForm, note: e.target.value })}
                          placeholder="What happened on the call? (e.g. Cx bringing device in, address given, needs callback, declined...)"
                          rows={2}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-500 resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => sendToChat(selected)}
                          disabled={sendingChat}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand/20 border border-brand/40 text-brand hover:bg-brand/30 transition-colors disabled:opacity-50"
                        >
                          {sendingChat ? "Sending…" : "Send"}
                        </button>
                        <button
                          onClick={() => { setChatForm(null); setChatResult(null); }}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Chat result */}
                  {chatResult && !chatForm && (
                    <div className={`text-xs px-3 py-2 rounded-lg border ${chatResult.sent ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                      {chatResult.sent ? "Sent to Google Chat ✓" : chatResult.error}
                    </div>
                  )}

                  {/* Status buttons */}
                  <div className="flex items-center gap-1.5">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mr-1">Status</p>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected, s)}
                        className={`text-[10px] px-2 py-1 rounded border capitalize transition-colors ${
                          selected.status === s
                            ? STATUS_STYLES[s]
                            : "bg-transparent border-slate-800 text-slate-600 hover:border-slate-600 hover:text-slate-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation replay */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
                  {parsedTurns(selected).map((turn, i) => (
                    <div key={i} className="space-y-3">
                      {/* Customer bubble */}
                      <div className="flex justify-end">
                        <div className="max-w-[65%] bg-slate-700/50 border border-slate-600/50 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-slate-200">
                          {turn.input}
                        </div>
                      </div>

                      {/* AI guidance */}
                      {turn.result && (
                        <div className="space-y-2">
                          <div className="bg-brand/10 border border-brand/25 rounded-xl px-4 py-3">
                            <p className="text-[10px] font-semibold text-brand uppercase tracking-wider mb-1">Say This</p>
                            <p className="text-sm text-slate-200 leading-relaxed">"{turn.result.script}"</p>
                          </div>
                          {(turn.result.ifTheyAskPrice || turn.result.ifTheyInsist) && (
                            <div className="border border-slate-700/50 rounded-xl overflow-hidden">
                              <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-700/50">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">If They Ask About Price</p>
                              </div>
                              <div className="divide-y divide-slate-800">
                                {turn.result.ifTheyAskPrice && (
                                  <div className="px-4 py-2.5">
                                    <p className="text-xs text-slate-600 mb-1">Starting price + redirect</p>
                                    <p className="text-sm text-slate-400">"{turn.result.ifTheyAskPrice}"</p>
                                  </div>
                                )}
                                {turn.result.ifTheyInsist && (
                                  <div className="px-4 py-2.5">
                                    <p className="text-xs text-slate-600 mb-1">If they still push</p>
                                    <p className="text-sm text-slate-400">"{turn.result.ifTheyInsist}"</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Turnaround</p>
                              <p className="text-xs font-medium text-slate-300">{turn.result.turnaround || "—"}</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Service</p>
                              <p className="text-xs font-medium text-slate-300">{turn.result.location || "—"}</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Confidence</p>
                              <p className="text-xs font-medium text-slate-300 capitalize">{turn.result.confidence}</p>
                            </div>
                          </div>
                          {turn.result.possibleIssues && turn.result.possibleIssues.length > 0 && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Possible Issues</p>
                              <ul className="space-y-1">
                                {turn.result.possibleIssues.map((issue, j) => (
                                  <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                                    <span className="text-slate-600 mt-0.5">•</span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {turn.result.askCustomer && turn.result.askCustomer.length > 0 && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Follow Up Questions</p>
                              <ul className="space-y-1">
                                {turn.result.askCustomer.map((q, j) => (
                                  <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                                    <span className="text-slate-600 mt-0.5">•</span>
                                    {q}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
}
