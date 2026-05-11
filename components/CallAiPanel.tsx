"use client";

import { useState } from "react";

export type CallRecord = {
  id: string;
  threecxCallId: string;
  callerPhone: string;
  callerName: string | null;
  callee: string | null;
  callDate: string;
  duration: string | null;
  direction: string | null;
  status: string | null;
  recordingUrl: string | null;
  transcript: string | null;
  aiResponse: string | null;
  reviewed: boolean;
};

function buildCallPrompt(call: CallRecord): string {
  const date = new Date(call.callDate).toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const transcript = call.transcript?.trim() || "(no transcript pasted yet — add one before sending)";

  return `You are helping RNRPC Repair, a PC repair shop in Palm Desert, CA, qualify an inbound customer call.

CALLER: ${call.callerPhone}${call.direction ? ` (${call.direction} call)` : ""}
CALLEE: ${call.callee ?? "Unknown"}
DATE: ${date}
DURATION: ${call.duration ?? "Unknown"}
STATUS: ${call.status ?? "Unknown"}

TRANSCRIPT:
"""
${transcript}
"""

---
Wrap your **entire response** in a single markdown code block (triple backticks) so it can be copied in one click. Use the exact section headings below inside the code block.

## 1. CUSTOMER INFO
- Name: [from transcript, else "Unknown"]
- Phone: ${call.callerPhone}
- Email: [if mentioned, else "Not provided"]

## 2. SERVICE REQUESTED
[What the customer wants — 2–3 sentences]

## 3. URGENCY & TONE
[How urgent or frustrated the customer sounds — 1–2 sentences]

## 4. SUGGESTED TRELLO CARD
**Title:** [e.g. "John Smith – MacBook Screen Replacement (760) 555-1234"]
**Description:**
[Full job description ready to paste into Trello]

## 5. NEXT STEP
[Call back / schedule drop-off / send quote / etc.]`;
}

export function CallAiPanel({
  call,
  onClose,
}: {
  call: CallRecord;
  onClose: () => void;
}) {
  const [promptCopied, setPromptCopied] = useState(false);
  const prompt = buildCallPrompt(call);

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
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Copy prompt → paste into AI</p>
            {!call.transcript?.trim() && (
              <p className="text-xs text-amber-500/80 italic">Tip: paste a transcript first for a better result.</p>
            )}
            <pre className="text-[11px] text-slate-400 bg-slate-800 rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto border border-slate-700 font-mono">
              {prompt}
            </pre>
            <button
              onClick={handleCopyPrompt}
              className="self-start flex items-center gap-2 text-xs font-medium bg-brand text-white hover:bg-brand-hover px-3 py-1.5 rounded-md transition-colors"
            >
              {promptCopied ? "Copied!" : "Copy prompt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
