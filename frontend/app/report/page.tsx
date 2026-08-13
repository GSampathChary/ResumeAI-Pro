"use client";

import { useState } from "react";

import { ActionButton, SectionCard } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function ReportPage() {
  const workspace = useResumeWorkspace();
  const [status, setStatus] = useState("Ready to generate a PDF report.");

  async function downloadReport() {
    setStatus("Generating report...");
    try {
      const response = await fetch(`${API_BASE_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: workspace.resumeText,
          job_description: workspace.jobDescription,
          company_name: workspace.companyName,
          role: workspace.role,
          target_domain: workspace.targetDomain,
          linkedin_id: workspace.linkedinId,
          provider: "mock",
        }),
      });
      if (!response.ok) {
        throw new Error("Report generation failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "resumeai-pro-report.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus("Report downloaded.");
    } catch {
      setStatus("Backend unavailable. Enable FastAPI to download the PDF report.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <SectionCard title="Downloadable report" subtitle="Generates a polished PDF with ATS score, suggestions, and interview prompts.">
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>Overall ATS score: {workspace.analysis.ats.overall_score}</p>
          <p>Questions included: {workspace.analysis.interview.technical.length + workspace.analysis.interview.behavioral.length + workspace.analysis.interview.hr.length}</p>
          <p>Target domain: {workspace.targetDomain || "Not set"}</p>
          <div className="flex flex-wrap gap-3">
            <ActionButton onClick={downloadReport}>Download PDF Report</ActionButton>
            <ActionButton secondary onClick={workspace.exportWorkspaceSnapshot}>Export Workspace Snapshot</ActionButton>
          </div>
          <p>{status}</p>
        </div>
      </SectionCard>

      <SectionCard title="Report contents" subtitle="What the PDF includes.">
        <div className="grid gap-3 text-sm">
          {[
            "ATS score and component breakdown",
            "Detected and missing skills",
            "Targeted improvement suggestions",
            "Interview questions and preparation ideas",
            "Learning roadmap and next-step guidance",
            "LinkedIn-ready profile details and domain focus",
            "Portable workspace snapshot for sharing or backup",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
