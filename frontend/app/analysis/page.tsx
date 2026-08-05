"use client";

import { ActionButton, PillList, SectionCard, TextArea, Input } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function AnalysisPage() {
  const workspace = useResumeWorkspace();

  async function runAnalysis() {
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
      <SectionCard title="Analysis input" subtitle="Edit the live resume text, target domain, and job details before refreshing the shared analysis.">
        <div className="grid gap-4">
          <TextArea label="Resume text" value={workspace.resumeText} onChange={workspace.setResumeText} rows={14} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Target domain" value={workspace.targetDomain} onChange={workspace.setTargetDomain} />
            <Input label="LinkedIn ID / URL" value={workspace.linkedinId} onChange={workspace.setLinkedinId} />
          </div>
          <TextArea label="Job description" value={workspace.jobDescription} onChange={workspace.setJobDescription} rows={10} />
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton onClick={runAnalysis}>{workspace.isAnalyzing ? "Analyzing..." : "Refresh Analysis"}</ActionButton>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Current file: {workspace.fileName} | ATS {workspace.analysis.ats.overall_score}
            </span>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6">
        <SectionCard title="Parsed profile" subtitle="Sections and signals extracted from the active resume.">
          <div className="space-y-4 text-sm">
            <p className="text-slate-600 dark:text-slate-300">{workspace.analysis.profile.summary}</p>
            <PillList items={workspace.analysis.profile.skills} />
            <div className="grid gap-3 md:grid-cols-2">
              {workspace.analysis.profile.sections.slice(0, 4).map((section) => (
                <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="font-medium text-slate-950 dark:text-white">{section.title}</p>
                  <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">{section.items.slice(0, 2).join(" | ")}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Keyword spotlight" subtitle="See which ATS keywords were detected in the current resume.">
          <PillList items={workspace.analysis.ats.detected_keywords.length > 0 ? workspace.analysis.ats.detected_keywords : ["No keywords detected yet"]} />
        </SectionCard>

        <SectionCard title="Strengths and weaknesses" subtitle="Clear action points for the resume owner.">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="mb-2 font-medium text-slate-950 dark:text-white">Strengths</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                {workspace.analysis.profile.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="mb-2 font-medium text-slate-950 dark:text-white">Weaknesses</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                {workspace.analysis.profile.weaknesses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
