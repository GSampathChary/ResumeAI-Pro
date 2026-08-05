"use client";

import { SectionCard } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function SettingsPage() {
  const workspace = useResumeWorkspace();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard title="Settings" subtitle="Theme, workspace context, AI provider, and version information.">
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Theme: Dark / Light toggle in the app shell</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Language: English</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Target domain: {workspace.targetDomain || "Not set yet"}</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">LinkedIn ID: {workspace.linkedinId || "Not provided"}</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">AI Provider: Gemini-ready with mock fallback</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Database: SQLite</div>
        </div>
      </SectionCard>

      <SectionCard title="Build info" subtitle="Portfolio-friendly architecture and implementation notes.">
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Frontend: Next.js 16, TypeScript, Tailwind CSS</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Backend: FastAPI, Pydantic, SQLite, reportlab</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Parser support: PDF, DOCX, TXT</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Future providers: OpenAI, Claude, Grok, DeepSeek</div>
        </div>
      </SectionCard>
    </div>
  );
}
