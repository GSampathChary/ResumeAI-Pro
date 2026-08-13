"use client";

import { ActionButton, PillList, ProgressRing, SectionCard, StatCard, VerticalBars } from "@/src/components/ui";
import type { ATSBreakdown } from "@/src/lib/types";
import { useResumeWorkspace } from "@/src/lib/workspace";

const bars = (score: ATSBreakdown) => [
  { label: "Formatting", value: score.formatting },
  { label: "Skills Match", value: score.skills_match },
  { label: "Keywords", value: score.keywords },
  { label: "Experience", value: score.experience },
];

export default function DashboardPage() {
  const workspace = useResumeWorkspace();
  const analysis = workspace.analysis;
  const history = workspace.history;
  const previousScore = history[1]?.analysis.ats.overall_score;
  const scoreDelta = typeof previousScore === "number" ? analysis.ats.overall_score - previousScore : null;
  const topJob = analysis.job_match.related_jobs[0];
  const focusSkill = analysis.skills_gap.priority_skills[0] ?? analysis.profile.skills[0] ?? "target skills";

  const stats = [
    { label: "Resume Uploaded", value: workspace.fileName, hint: workspace.uploadedAt ? new Date(workspace.uploadedAt).toLocaleString() : "No upload yet" },
    { label: "Target Domain", value: workspace.targetDomain || "Unset", hint: "Used across every generator" },
    { label: "ATS Score", value: analysis.ats.overall_score, hint: "Transparent heuristic baseline" },
    { label: "Skills Found", value: analysis.profile.skills.length, hint: "Updated from the active resume" },
    { label: "Job Match", value: `${analysis.job_match.matching_score}%`, hint: "Resume vs. current role" },
    { label: "History", value: history.length, hint: "Click an older analysis on Upload" },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Resume Pulse"
          value={analysis.ats.overall_score >= 80 ? "Strong" : analysis.ats.overall_score >= 60 ? "Balanced" : "Needs work"}
          hint="A quick health label for the active resume"
        />
        <StatCard
          label="Main Focus"
          value={focusSkill}
          hint="The next skill or gap to address"
        />
        <StatCard
          label="Top Job Fit"
          value={topJob ? `${topJob.fit_score}%` : "N/A"}
          hint={topJob ? topJob.title : "No related jobs detected yet"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="ATS score snapshot" subtitle="This score updates everywhere when you refresh the workspace.">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <ProgressRing value={analysis.ats.overall_score} label="overall score" />
            <VerticalBars items={bars(analysis.ats)} />
          </div>
        </SectionCard>

        <SectionCard title="Workspace summary" subtitle="One place to understand the active resume, domain, and improvement direction.">
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p>{analysis.profile.summary}</p>
            {scoreDelta !== null ? (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100">
                ATS change from the previous analysis: {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                Upload another resume to compare progress over time.
              </div>
            )}
            <PillList items={analysis.profile.skills.slice(0, 10)} />
            <div className="grid gap-3">
              {analysis.ats.suggestions.map((suggestion) => (
                <div key={suggestion} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Quick actions" subtitle="Jump straight into the main workflows.">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Upload a new resume",
              "Run ATS analysis",
              "Generate interview questions",
              "Build a cover letter",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm dark:border-slate-800 dark:bg-slate-950">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <ActionButton onClick={workspace.exportWorkspaceSnapshot}>Download Workspace Snapshot</ActionButton>
            <ActionButton secondary onClick={() => void workspace.refreshAnalysis()}>
              Refresh Current Analysis
            </ActionButton>
          </div>
        </SectionCard>
        <SectionCard title="Related jobs" subtitle="Roles that align with the active resume and domain.">
          <div className="grid gap-3">
            {analysis.job_match.related_jobs.map((job) => (
              <div key={job.title} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-950 dark:text-white">{job.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Fit {job.fit_score}%</span>
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{job.reason}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
