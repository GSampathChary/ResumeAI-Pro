"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

import type { ThemeMode } from "@/src/lib/types";
import { useResumeWorkspace } from "@/src/lib/workspace";

const NAV_ITEMS = [
  { href: "/", label: "Landing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/analysis", label: "Analysis" },
  { href: "/ats", label: "ATS Report" },
  { href: "/skills", label: "Skill Gap" },
  { href: "/interview", label: "Interview" },
  { href: "/cover-letter", label: "Cover Letter" },
  { href: "/linkedin", label: "LinkedIn" },
  { href: "/job-match", label: "Job Match" },
  { href: "/report", label: "Report" },
  { href: "/settings", label: "Settings" },
  { href: "/about", label: "About" },
];

function setTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem("resumeai-theme", theme);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const workspace = useResumeWorkspace();
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    return (localStorage.getItem("resumeai-theme") as ThemeMode | null) ?? "dark";
  });

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const title = useMemo(() => {
    if (!pathname || pathname === "/") return "Landing";
    return NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "ResumeAI Pro";
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(30,64,175,0.16),transparent_24%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.92))] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(8,145,178,0.2),transparent_28%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.94))] dark:text-white">
      <div className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="mx-auto flex min-h-screen max-w-[1700px] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-sky-500">ResumeAI Pro</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">Career intelligence studio</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Upload a resume once, then use the same live context to power ATS, LinkedIn, interview, and job-match outputs everywhere.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextTheme = theme === "dark" ? "light" : "dark";
                setThemeState(nextTheme);
                setTheme(nextTheme);
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              Toggle theme
            </button>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-[0_18px_50px_-34px_rgba(14,29,53,0.4)] dark:border-slate-800 dark:bg-slate-950/80">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Workspace</p>
            <div className="mt-3 grid gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900/70">
                <span className="block text-xs text-slate-500 dark:text-slate-400">Resume</span>
                <span className="mt-1 block font-medium">{workspace.fileName}</span>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900/70">
                <span className="block text-xs text-slate-500 dark:text-slate-400">Target domain</span>
                <span className="mt-1 block font-medium">{workspace.targetDomain || "Not set"}</span>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900/70">
                <span className="block text-xs text-slate-500 dark:text-slate-400">LinkedIn ID</span>
                <span className="mt-1 block font-medium">{workspace.linkedinId || "Not provided"}</span>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-900/70">
                <span className="block text-xs text-slate-500 dark:text-slate-400">ATS score</span>
                <span className="mt-1 block font-medium">{workspace.analysis.ats.overall_score}</span>
              </div>
            </div>
          </div>

          <nav className="mt-6 grid gap-2 lg:mt-8">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-white/65 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-sky-500">Current view</p>
                <h2 className="mt-1 text-xl font-semibold">{title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                  {workspace.fileName}
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100">
                  {workspace.targetDomain || "Domain not set"}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  ATS {workspace.analysis.ats.overall_score}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  {workspace.linkedinId ? `LinkedIn ${workspace.linkedinId}` : "LinkedIn not set"}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  History {workspace.history.length}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
