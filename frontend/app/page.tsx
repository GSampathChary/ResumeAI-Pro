"use client";

import Link from "next/link";

import { PillList, SectionCard, StatCard } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

const features = [
  "Resume upload and parsing",
  "Transparent ATS score breakdown",
  "Skill gap analysis",
  "Interview question generator",
  "Cover letter builder",
  "LinkedIn summary writer",
  "Related jobs by domain",
  "Downloadable PDF report",
];

export default function Home() {
  const workspace = useResumeWorkspace();
  const analysis = workspace.analysis;

  const stats = [
    { label: "ATS Score", value: `${analysis.ats.overall_score}/100`, hint: "Calculated from the active resume" },
    { label: "Detected Skills", value: analysis.profile.skills.length, hint: "Updated from your uploaded file" },
    { label: "Target Domain", value: workspace.targetDomain || "Unset", hint: "Drives LinkedIn, interview, and job match outputs" },
    { label: "Job Match", value: `${analysis.job_match.matching_score}%`, hint: "Resume vs. the current target role" },
  ];

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(29,78,216,0.92),rgba(14,165,233,0.92))] p-8 text-white shadow-[0_40px_100px_-50px_rgba(2,6,23,0.9)] lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-sky-200">AI-powered career workspace</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight lg:text-6xl">
              Turn one resume into a complete career strategy.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-sky-100/90 lg:text-lg">
              Upload a resume, set your target domain, and every page updates from the same live source of truth: ATS analysis, interview prep, LinkedIn writing, cover letters, related jobs, and a downloadable report.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/upload" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
                Upload Resume
              </Link>
              <Link href="/dashboard" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Open Dashboard
              </Link>
              <Link href="/report" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Download Report
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-100">Current workspace</p>
            <div className="mt-4 grid gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-sky-100/80">{item.label}</span>
                    <span className="text-lg font-semibold">{item.value}</span>
                  </div>
                  <p className="mt-2 text-xs text-sky-100/70">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="What this platform includes" subtitle="Built as a cohesive product, not a set of disconnected pages.">
          <PillList items={features} />
        </SectionCard>
        <SectionCard title="Active focus" subtitle="Everything below updates from the uploaded resume and selected domain.">
          <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Resume text, ATS score, and skill gaps remain shared across every screen.</p>
            <p>Interview questions, cover letter language, and LinkedIn copy adapt to the target domain and LinkedIn ID.</p>
            <p>Related job suggestions help the user move from analysis into action faster.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
