"use client";

import { useState } from "react";

import { ActionButton, CodeBlock, PillList, SectionCard, Input } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function LinkedInPage() {
  const workspace = useResumeWorkspace();
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy all");

  async function runLinkedIn() {
    setIsLoading(true);
    try {
      await workspace.refreshAnalysis({
        jobDescription: workspace.jobDescription,
        companyName: workspace.companyName,
        role: workspace.role,
        targetDomain: workspace.targetDomain,
        linkedinId: workspace.linkedinId,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function copyPack() {
    const pack = [
      `Headline: ${workspace.analysis.linkedin.headline}`,
      `About: ${workspace.analysis.linkedin.about}`,
      `Skills: ${workspace.analysis.linkedin.skills.join(", ")}`,
      `Keywords: ${workspace.analysis.linkedin.keywords.join(", ")}`,
    ].join("\n\n");
    await navigator.clipboard.writeText(pack);
    setCopyStatus("Copied");
    window.setTimeout(() => setCopyStatus("Copy all"), 1400);
  }

  const result = workspace.analysis.linkedin;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <SectionCard title="LinkedIn generator" subtitle="Generate a polished headline, About section, and profile hints based on the active resume and domain.">
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Target domain" value={workspace.targetDomain} onChange={workspace.setTargetDomain} />
            <Input label="LinkedIn ID / URL" value={workspace.linkedinId} onChange={workspace.setLinkedinId} />
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton onClick={runLinkedIn}>{isLoading ? "Generating..." : "Generate LinkedIn Summary"}</ActionButton>
            <ActionButton secondary onClick={copyPack}>{copyStatus}</ActionButton>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">This keeps the LinkedIn output tied to the resume you uploaded.</p>
        </div>
      </SectionCard>

      <div className="grid gap-6">
        <SectionCard title="Headline" subtitle="Use this for the top of your profile.">
          <CodeBlock value={result.headline} />
        </SectionCard>
        <SectionCard title="About" subtitle="A concise and professional profile summary.">
          <CodeBlock value={result.about} />
        </SectionCard>
        <SectionCard title="LinkedIn-ready fields" subtitle="The profile details you can paste into the LinkedIn builder.">
          <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            {result.profile_updates.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Quick profile actions" subtitle="Latest convenience features for a faster workflow.">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
              Copy headline, About, and keyword pack in one click.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
              Keep the LinkedIn ID visible so you can paste or update it fast.
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Keywords and skills" subtitle="Good for searchability.">
          <PillList items={[...result.skills, ...result.keywords]} />
        </SectionCard>
      </div>
    </div>
  );
}
