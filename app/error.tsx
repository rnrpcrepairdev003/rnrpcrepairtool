"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-sm shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-slate-300 text-sm font-semibold">Something went wrong</span>
        </div>
        <p className="text-slate-600 text-xs font-mono leading-relaxed break-all">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex-1 bg-brand hover:bg-brand-hover text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
