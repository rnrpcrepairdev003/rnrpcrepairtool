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
  issue: string | null;
  turns: string;
  status: string;
};

export function LeadsBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => { setLeads(data); setLoading(false); });
  }, []);

  const parsedTurns = (lead: Lead): Turn[] => {
    try { return JSON.parse(lead.turns); } catch { return []; }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="bg-slate-950 flex flex-col h-screen">
      <Topbar label="Leads" total={0} high={0} medium={0} low={0} pending={0} reviewed={0} lastUpdated={null} hiddenCount={0} onHidden={() => {}} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex min-h-0 overflow-hidden">

          {/* Lead list */}
          <div className="w-80 shrink-0 border-r border-slate-800 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-800 shrink-0">
              <p className="text-sm font-semibold text-slate-200">Saved Leads</p>
              <p className="text-xs text-slate-500">{leads.length} total</p>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <p className="text-xs text-slate-600">Loading…</p>
                </div>
              )}
              {!loading && leads.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 gap-2">
                  <p className="text-xs text-slate-600">No leads saved yet</p>
                </div>
              )}
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-800/60 transition-colors ${
                    selected?.id === lead.id ? "bg-brand/10 border-l-2 border-l-brand" : "hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {lead.customerName || "Unknown Customer"}
                    </p>
                    <span className="text-[10px] text-slate-600 shrink-0 mt-0.5">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {lead.phone && (
                    <p className="text-xs text-slate-500 mt-0.5">{lead.phone}</p>
                  )}
                  {lead.issue && (
                    <p className="text-xs text-slate-600 mt-1 truncate">{lead.issue}</p>
                  )}
                </button>
              ))}
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
                <div className="px-6 py-4 border-b border-slate-800 shrink-0">
                  <p className="text-base font-semibold text-slate-200">
                    {selected.customerName || "Unknown Customer"}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {selected.phone && (
                      <p className="text-xs text-slate-400">{selected.phone}</p>
                    )}
                    <p className="text-xs text-slate-600">{formatDate(selected.createdAt)}</p>
                  </div>
                  {selected.issue && (
                    <p className="text-xs text-slate-500 mt-1">{selected.issue}</p>
                  )}
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
