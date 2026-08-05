import { SectionCard } from "@/src/components/ui";

export default function AboutPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard title="About ResumeAI Pro" subtitle="A portfolio project that demonstrates AI engineering and product thinking.">
        <div className="space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>ResumeAI Pro turns uploaded resumes into a full analysis workflow for ATS optimization, skill discovery, interview prep, and career content generation.</p>
          <p>The backend uses transparent heuristics for scoring and Gemini-ready service hooks for richer outputs when an API key is configured.</p>
        </div>
      </SectionCard>

      <SectionCard title="Architecture" subtitle="Clean, modular, and easy to extend.">
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Frontend: app router pages with reusable UI primitives and a persistent shell.</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Backend: routers, services, parsers, prompt files, and SQLite persistence.</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">Report export: PDF generation using reportlab.</div>
        </div>
      </SectionCard>
    </div>
  );
}

