"use client";

import { ActionButton, Input, ProgressRing, SectionCard, TextArea, VerticalBars } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function ATSPage() {
  const workspace = useResumeWorkspace();
  const analysis = workspace.analysis;

  async function runATS() {
    await workspace.refreshAnalysis({
      jobDescription: workspace.jobDescription,
      companyName: workspace.companyName,
      role: workspace.role,
      targetDomain: workspace.targetDomain,
      linkedinId: workspace.linkedinId,
    });
  }

  const bars = [
    { label: "Formatting", value: analysis.ats.formatting },
    { label: "Skills Match", value: analysis.ats.skills_match },
    { label: "Keywords", value: analysis.ats.keywords },
    { label: "Experience", value: analysis.ats.experience },
    { label: "Education", value: analysis.ats.education },
    { label: "Grammar", value: analysis.ats.grammar },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <SectionCard title="ATS input" subtitle="Adjust the target job details to see how the score changes.">
        <div className="grid gap-4">
          <TextArea label="Job description" value={workspace.jobDescription} onChange={workspace.setJobDescription} rows={12} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Target domain" value={workspace.targetDomain} onChange={workspace.setTargetDomain} />
            <Input label="LinkedIn ID / URL" value={workspace.linkedinId} onChange={workspace.setLinkedinId} />
          </div>
          <ActionButton onClick={runATS}>{workspace.isAnalyzing ? "Scoring..." : "Generate ATS Score"}</ActionButton>
          <p className="text-sm text-slate-500 dark:text-slate-400">Current resume: {workspace.fileName}</p>
        </div>
      </SectionCard>

      <SectionCard title="ATS breakdown" subtitle="Heuristic score with transparent component scores.">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <ProgressRing value={analysis.ats.overall_score} label="overall score" />
          <VerticalBars items={bars} />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[`Detected: ${analysis.ats.detected_keywords.join(", ") || "None yet"}`, `Missing: ${analysis.ats.missing_keywords.join(", ") || "None"}`, ...analysis.ats.suggestions].map(
            (item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
                {item}
              </div>
            ),
          )}
        </div>
      </SectionCard>
    </div>
  );
}
