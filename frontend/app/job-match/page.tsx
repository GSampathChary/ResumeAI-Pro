"use client";

import { ActionButton, Input, PillList, ProgressRing, SectionCard, TextArea } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function JobMatchPage() {
  const workspace = useResumeWorkspace();
  const result = workspace.analysis.job_match;

  async function runMatch() {
    await workspace.refreshAnalysis({
      jobDescription: workspace.jobDescription,
      companyName: workspace.companyName,
      role: workspace.role,
      targetDomain: workspace.targetDomain,
      linkedinId: workspace.linkedinId,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <SectionCard title="Job comparison" subtitle="Compare the active resume against your current target role.">
        <div className="grid gap-4">
          <TextArea label="Job description" value={workspace.jobDescription} onChange={workspace.setJobDescription} rows={12} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Target domain" value={workspace.targetDomain} onChange={workspace.setTargetDomain} />
            <Input label="LinkedIn ID / URL" value={workspace.linkedinId} onChange={workspace.setLinkedinId} />
          </div>
          <ActionButton onClick={runMatch}>Compare Against Job</ActionButton>
        </div>
      </SectionCard>

      <SectionCard title="Match result" subtitle="Resume vs. target role alignment.">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <ProgressRing value={result.matching_score} label="match score" />
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Matched keywords</p>
              <PillList items={result.matched_keywords} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Missing skills</p>
              <PillList items={result.missing_skills} />
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {result.suggestions.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">Related jobs</p>
          <div className="grid gap-3">
            {result.related_jobs.map((job) => (
              <div key={job.title} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-950 dark:text-white">{job.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Fit {job.fit_score}%</span>
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{job.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
