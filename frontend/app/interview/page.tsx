"use client";

import { ActionButton, Input, SectionCard } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function InterviewPage() {
  const workspace = useResumeWorkspace();

  async function runInterview() {
    await workspace.refreshAnalysis({
      jobDescription: workspace.jobDescription,
      companyName: workspace.companyName,
      role: workspace.role,
      targetDomain: workspace.targetDomain,
      linkedinId: workspace.linkedinId,
    });
  }

  const groups = [
    ["Technical", workspace.analysis.interview.technical],
    ["Behavioral", workspace.analysis.interview.behavioral],
    ["HR", workspace.analysis.interview.hr],
    ["Project Based", workspace.analysis.interview.project_based],
    ["Coding", workspace.analysis.interview.coding],
    ["Scenario Based", workspace.analysis.interview.scenario_based],
  ] as const;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <SectionCard title="Interview input" subtitle="Generate tailored interview prep from the active resume and target domain.">
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Target domain" value={workspace.targetDomain} onChange={workspace.setTargetDomain} />
            <Input label="LinkedIn ID / URL" value={workspace.linkedinId} onChange={workspace.setLinkedinId} />
          </div>
          <ActionButton onClick={runInterview}>{workspace.isAnalyzing ? "Generating..." : "Generate Questions"}</ActionButton>
          <p className="text-sm text-slate-500 dark:text-slate-400">Current resume: {workspace.fileName}</p>
        </div>
      </SectionCard>

      <SectionCard title="Generated questions" subtitle="Organized by category for focused practice.">
        <div className="grid gap-4">
          {groups.map(([label, items]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="font-medium text-slate-950 dark:text-white">{label}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {items.map((item) => (
                  <li key={item} className="leading-6">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
