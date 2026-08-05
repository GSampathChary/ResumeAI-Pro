"use client";

import { useState } from "react";

import { ActionButton, CodeBlock, Input, SectionCard, TextArea } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function CoverLetterPage() {
  const workspace = useResumeWorkspace();
  const [copyState, setCopyState] = useState("Copy");

  async function refreshLetter() {
    await workspace.refreshAnalysis({
      jobDescription: workspace.jobDescription,
      companyName: workspace.companyName,
      role: workspace.role,
      targetDomain: workspace.targetDomain,
      linkedinId: workspace.linkedinId,
    });
  }

  async function copyLetter() {
    await navigator.clipboard.writeText(workspace.analysis.cover_letter.cover_letter);
    setCopyState("Copied");
    window.setTimeout(() => setCopyState("Copy"), 1200);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <SectionCard title="Cover letter inputs" subtitle="Tailor the message to the company and role.">
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Company name" value={workspace.companyName} onChange={workspace.setCompanyName} />
            <Input label="Role" value={workspace.role} onChange={workspace.setRole} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Target domain" value={workspace.targetDomain} onChange={workspace.setTargetDomain} />
            <Input label="LinkedIn ID / URL" value={workspace.linkedinId} onChange={workspace.setLinkedinId} />
          </div>
          <TextArea label="Job description" value={workspace.jobDescription} onChange={workspace.setJobDescription} rows={10} />
          <div className="flex flex-wrap gap-3">
            <ActionButton onClick={refreshLetter}>Generate Cover Letter</ActionButton>
            <ActionButton secondary onClick={copyLetter}>
              {copyState}
            </ActionButton>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Current resume: {workspace.fileName}</p>
        </div>
      </SectionCard>

      <SectionCard title="Cover letter output" subtitle="Professional, concise, and ready to copy.">
        <CodeBlock value={workspace.analysis.cover_letter.cover_letter} />
      </SectionCard>
    </div>
  );
}
