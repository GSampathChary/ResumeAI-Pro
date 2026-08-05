"use client";

import { ActionButton, Input, PillList, SectionCard, TextArea } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function SkillsPage() {
  const workspace = useResumeWorkspace();
  const analysis = workspace.analysis;

  async function runSkills() {
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
      <SectionCard title="Skills input" subtitle="See what the resume already covers and where the gaps are.">
        <div className="grid gap-4">
          <TextArea label="Job description" value={workspace.jobDescription} onChange={workspace.setJobDescription} rows={12} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Target domain" value={workspace.targetDomain} onChange={workspace.setTargetDomain} />
            <Input label="LinkedIn ID / URL" value={workspace.linkedinId} onChange={workspace.setLinkedinId} />
          </div>
          <ActionButton onClick={runSkills}>Analyze Skill Gap</ActionButton>
          <p className="text-sm text-slate-500 dark:text-slate-400">Current resume: {workspace.fileName}</p>
        </div>
      </SectionCard>

      <div className="grid gap-6">
        <SectionCard title="Detected skills" subtitle="Extracted from the active resume.">
          <PillList items={analysis.skills_gap.detected_skills} />
        </SectionCard>
        <SectionCard title="Priority gaps" subtitle="Focus on the highest-value missing items first.">
          <PillList items={analysis.skills_gap.priority_skills} />
          <div className="mt-4 grid gap-3">
            {analysis.skills_gap.learning_resources.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
