"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: "Trello Integration",
    href: "/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="18" rx="1" />
        <rect x="14" y="3" width="7" height="11" rx="1" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-1 w-14 shrink-0 border-r border-slate-800 bg-slate-900/50 py-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`group relative flex items-center justify-center h-10 mx-2 rounded-lg transition-colors ${
              active
                ? "bg-brand/15 text-brand"
                : "text-slate-600 hover:text-slate-300 hover:bg-slate-800"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand rounded-r-full -ml-2" />
            )}
            {item.icon}
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              {item.label}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
