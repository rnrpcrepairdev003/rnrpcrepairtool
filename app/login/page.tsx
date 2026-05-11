"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok || res.redirected) {
      window.location.href = "/";
    } else {
      setError("Incorrect password. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">

      {/* Login card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-2 h-2 rounded-full bg-brand" />
          <h1 className="text-base font-bold text-slate-100">RNRPC Priority Board</h1>
        </div>
        <p className="text-slate-500 text-sm mb-6 pl-4">Internal access only</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      {/* Intro blurb */}
      <div className="mt-8 w-full max-w-sm flex flex-col gap-4 text-[12px] text-slate-600 leading-relaxed">
        <div className="flex gap-3">
          <span className="text-brand mt-0.5">▸</span>
          <p><span className="text-slate-500 font-medium">What this is</span> — A private repair queue tool for RNRPC Repair in Palm Desert, CA. It pulls open jobs from Trello and ranks them by urgency so the team always knows what to work on next.</p>
        </div>
        <div className="flex gap-3">
          <span className="text-brand mt-0.5">▸</span>
          <p><span className="text-slate-500 font-medium">How it works</span> — Each job is sent to an AI with the full description, technician comments, and photos. The AI assigns a score (1–100) that automatically places the job into HIGH, MEDIUM, or LOW priority.</p>
        </div>
        <div className="flex gap-3">
          <span className="text-brand mt-0.5">▸</span>
          <p><span className="text-slate-500 font-medium">Google Chat</span> — The top 15 urgent jobs can be sent directly to the team chat in one click, with Trello links so technicians can jump straight to the card.</p>
        </div>
      </div>

    </div>
  );
}
