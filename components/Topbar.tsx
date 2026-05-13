"use client";
import { useTheme } from "./ThemeProvider";

type TopbarProps = {
  total: number;
  high: number;
  medium: number;
  low: number;
  pending: number;
  reviewed: number;
  lastUpdated: Date | null;
  hiddenCount: number;
  onHidden: () => void;
  label?: string;
};

export function Topbar({ total, high, medium, low, pending, reviewed, lastUpdated, hiddenCount, onHidden, label }: TopbarProps) {
  const { theme, toggle } = useTheme();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const lastUpdatedLabel = lastUpdated
    ? `Updated ${formatTimeAgo(lastUpdated)}`
    : null;

  return (
    <header className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-6 h-16 flex items-center shrink-0">
      {/* Brand */}
      <img src="/rnrpc.webp" alt="RNRPC Repair" className="h-11 w-auto" />

      {/* Stats — centered */}
      <div className="flex-1 flex items-center justify-center gap-1 text-xs">
        {label === "Settings" ? null : label ? (
          <>
            <Stat label={`${total} calls`} color="text-slate-300" />
            <Divider />
            <Stat label={`${reviewed}/${total} reviewed`} color="text-brand" dim={reviewed === 0} />
          </>
        ) : (
          <>
            <Stat label={`${total} jobs`} color="text-slate-300" />
            <Divider />
            <Stat label={`${high} high`} color="text-red-400" dim={high === 0} />
            <Divider />
            <Stat label={`${medium} medium`} color="text-amber-400" dim={medium === 0} />
            <Divider />
            <Stat label={`${low} low`} color="text-emerald-400" dim={low === 0} />
            <Divider />
            <Stat label={`${pending} pending`} color="text-slate-500" dim={pending === 0} />
            <Divider />
            <Stat label={`${reviewed}/${total} reviewed`} color="text-brand" dim={reviewed === 0} />
          </>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {lastUpdatedLabel && (
          <span className="text-slate-600 text-[11px]">{lastUpdatedLabel}</span>
        )}
        <button
          onClick={onHidden}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer px-2 py-1.5 rounded-md hover:bg-slate-800"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
          </svg>
          Hidden
          {hiddenCount > 0 && (
            <span className="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full leading-none">{hiddenCount}</span>
          )}
        </button>
        <button
          onClick={toggle}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunIcon />
          ) : (
            <MoonIcon />
          )}
        </button>
        <button
          onClick={handleLogout}
          className="text-white text-xs font-medium bg-brand hover:bg-brand-hover px-3 py-1.5 rounded-md transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 min ago";
  return `${minutes} mins ago`;
}

function Stat({ label, color, dim }: { label: string; color: string; dim?: boolean }) {
  return (
    <span className={`px-2 font-medium ${color} ${dim ? "opacity-40" : ""}`}>{label}</span>
  );
}

function Divider() {
  return <span className="text-slate-800 select-none">|</span>;
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}
