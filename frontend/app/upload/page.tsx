"use client";

import { useState } from "react";

import { uploadResumeFile } from "@/src/lib/api";
import { ActionButton, Input, SectionCard, StatCard, TextArea } from "@/src/components/ui";
import { useResumeWorkspace } from "@/src/lib/workspace";

export default function UploadPage() {
  const workspace = useResumeWorkspace();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Waiting for upload");

  async function handleUpload() {
    if (!selectedFile) {
      setStatus("Choose a resume file first.");
      return;
    }

    setStatus("Uploading and analyzing...");
    try {
      const uploaded = await uploadResumeFile(selectedFile);
      await workspace.updateResumeFromUpload({
        fileName: uploaded.filename,
        fileType: uploaded.file_type,
        resumeText: uploaded.extracted_text,
        resumePreview: uploaded.extracted_text_preview,
      });
      setStatus(`Uploaded: ${uploaded.filename}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    }
  }

  const stats = [
    { label: "Current ATS Score", value: workspace.analysis.ats.overall_score, hint: "Updates from the active resume" },
    { label: "Detected Skills", value: workspace.analysis.profile.skills.length, hint: "Shared across every page" },
    { label: "Resume Versions", value: workspace.history.length, hint: "Click any previous run to restore it" },
    { label: "Target Domain", value: workspace.targetDomain || "Unset", hint: "Guides interview, LinkedIn, and job match output" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionCard title="Upload workspace" subtitle="Load one resume, set the target domain, and let every screen read the same live context.">
        <div className="space-y-4">
          <label className="block rounded-[1.5rem] border border-dashed border-slate-300 bg-white/85 p-6 text-center shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-950/75">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setSelectedFile(file);
                setStatus(file ? `Selected: ${file.name}` : "Waiting for upload");
              }}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">Drop a PDF, DOCX, TXT, or MD resume here or click to browse</p>
            <p className="mt-2 text-xs text-slate-400">The extracted text becomes the active resume for all pages.</p>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Target domain" value={workspace.targetDomain} onChange={workspace.setTargetDomain} placeholder="Full Stack Engineering" />
            <Input label="LinkedIn ID / URL" value={workspace.linkedinId} onChange={workspace.setLinkedinId} placeholder="linkedin.com/in/your-handle" />
            <Input label="Company name" value={workspace.companyName} onChange={workspace.setCompanyName} placeholder="Company or institution" />
            <Input label="Role" value={workspace.role} onChange={workspace.setRole} placeholder="Software Engineer" />
          </div>

          <TextArea label="Target job description" value={workspace.jobDescription} onChange={workspace.setJobDescription} rows={9} />

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950">
            {selectedFile?.name || "No file selected"}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ActionButton onClick={handleUpload}>{workspace.isAnalyzing ? "Analyzing..." : "Upload Resume"}</ActionButton>
            <ActionButton
              secondary
              onClick={() => {
                setSelectedFile(null);
                setStatus("Selection cleared.");
              }}
            >
              Clear
            </ActionButton>
            <span className="self-center text-sm text-slate-500 dark:text-slate-400">{status}</span>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
          ))}
        </div>

        <SectionCard title="Current resume preview" subtitle="The parsed text powering the entire workspace.">
          <pre className="max-h-[28rem] overflow-auto rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-3 text-sm text-slate-100 dark:border-slate-800">
            <code>{workspace.resumePreview || workspace.resumeText}</code>
          </pre>
        </SectionCard>

        <SectionCard title="Previous analyses" subtitle="Click any prior resume analysis to restore that exact workspace state.">
          <div className="grid gap-3">
            {workspace.history.length > 0 ? (
              workspace.history.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => workspace.selectHistoryAnalysis(entry.id)}
                  className={`rounded-2xl border p-4 text-left text-sm transition ${
                    workspace.activeHistoryId === entry.id
                      ? "border-sky-300 bg-sky-50 shadow-[0_12px_30px_-20px_rgba(14,165,233,0.5)] dark:border-sky-500/40 dark:bg-sky-500/10"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-slate-950 dark:text-white">{entry.fileName}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">ATS {entry.analysis.ats.overall_score}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {entry.targetDomain || "No domain"} | {entry.analysis.profile.summary}
                  </p>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                No previous resumes yet.
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
