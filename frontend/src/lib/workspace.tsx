"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { analyzeResume } from "@/src/lib/api";
import { defaultAnalysis, sampleJobDescription, sampleResumeText } from "@/src/lib/demo";
import type { AnalysisResponse, AnalysisSnapshot } from "@/src/lib/types";

const STORAGE_KEY = "resumeai-workspace-v3";

export interface ResumeWorkspaceState {
  fileName: string;
  fileType: string;
  uploadedAt: string;
  resumeText: string;
  resumePreview: string;
  jobDescription: string;
  companyName: string;
  role: string;
  targetDomain: string;
  linkedinId: string;
  analysis: AnalysisResponse;
  history: AnalysisSnapshot[];
  activeHistoryId: string | null;
  isHydrated: boolean;
  isAnalyzing: boolean;
}

export interface ResumeWorkspaceActions {
  setResumeText: (value: string) => void;
  setResumePreview: (value: string) => void;
  setJobDescription: (value: string) => void;
  setCompanyName: (value: string) => void;
  setRole: (value: string) => void;
  setTargetDomain: (value: string) => void;
  setLinkedinId: (value: string) => void;
  updateResumeFromUpload: (input: {
    fileName: string;
    fileType: string;
    resumeText: string;
    resumePreview: string;
  }) => Promise<void>;
  refreshAnalysis: (overrides?: { jobDescription?: string; companyName?: string; role?: string; targetDomain?: string; linkedinId?: string }) => Promise<void>;
  selectHistoryAnalysis: (id: string) => void;
  resetWorkspace: () => void;
}

type ResumeWorkspaceContextValue = ResumeWorkspaceState & ResumeWorkspaceActions;

const ResumeWorkspaceContext = createContext<ResumeWorkspaceContextValue | null>(null);

function buildInitialState(): ResumeWorkspaceState {
  return {
    fileName: defaultAnalysis.profile.source_filename || "sample-resume.pdf",
    fileType: defaultAnalysis.profile.file_type || "pdf",
    uploadedAt: new Date().toISOString(),
    resumeText: sampleResumeText,
    resumePreview: sampleResumeText.slice(0, 400),
    jobDescription: sampleJobDescription,
    companyName: "ICAR - Indian Institute of Rice Research",
    role: "Software Developer",
    targetDomain: "Full Stack Engineering",
    linkedinId: "",
    analysis: defaultAnalysis,
    history: [],
    activeHistoryId: null,
    isHydrated: false,
    isAnalyzing: false,
  };
}

function safeParse(value: string | null): Partial<ResumeWorkspaceState> | null {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as Partial<ResumeWorkspaceState>;
  } catch {
    return null;
  }
}

function normalizeAnalysis(analysis?: Partial<AnalysisResponse>): AnalysisResponse {
  return {
    ...defaultAnalysis,
    ...(analysis ?? {}),
    profile: { ...defaultAnalysis.profile, ...(analysis?.profile ?? {}) },
    ats: { ...defaultAnalysis.ats, ...(analysis?.ats ?? {}) },
    skills_gap: { ...defaultAnalysis.skills_gap, ...(analysis?.skills_gap ?? {}) },
    interview: { ...defaultAnalysis.interview, ...(analysis?.interview ?? {}) },
    linkedin: {
      ...defaultAnalysis.linkedin,
      ...(analysis?.linkedin ?? {}),
      profile_updates: analysis?.linkedin?.profile_updates ?? defaultAnalysis.linkedin.profile_updates,
      linkedin_id: analysis?.linkedin?.linkedin_id ?? defaultAnalysis.linkedin.linkedin_id,
    },
    cover_letter: { ...defaultAnalysis.cover_letter, ...(analysis?.cover_letter ?? {}) },
    job_match: {
      ...defaultAnalysis.job_match,
      ...(analysis?.job_match ?? {}),
      related_jobs: analysis?.job_match?.related_jobs ?? defaultAnalysis.job_match.related_jobs,
    },
    roadmap: { ...defaultAnalysis.roadmap, ...(analysis?.roadmap ?? {}) },
    metadata: { ...defaultAnalysis.metadata, ...(analysis?.metadata ?? {}) },
  };
}

function normalizeHistory(history: unknown): AnalysisSnapshot[] {
  if (!Array.isArray(history)) {
    return [];
  }
  return history
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const candidate = entry as Partial<AnalysisSnapshot>;
      if (!candidate.analysis || !candidate.id) {
        return null;
      }
      return {
        id: candidate.id,
        fileName: candidate.fileName ?? defaultAnalysis.profile.source_filename,
        fileType: candidate.fileType ?? defaultAnalysis.profile.file_type,
        uploadedAt: candidate.uploadedAt ?? new Date().toISOString(),
        resumeText: candidate.resumeText ?? defaultAnalysis.profile.raw_text,
        resumePreview: candidate.resumePreview ?? defaultAnalysis.profile.raw_text.slice(0, 400),
        jobDescription: candidate.jobDescription ?? sampleJobDescription,
        companyName: candidate.companyName ?? "ICAR - Indian Institute of Rice Research",
        role: candidate.role ?? "Software Developer",
        targetDomain: candidate.targetDomain ?? "Full Stack Engineering",
        linkedinId: candidate.linkedinId ?? "",
        analysis: normalizeAnalysis(candidate.analysis),
      };
    })
    .filter((entry): entry is AnalysisSnapshot => Boolean(entry));
}

function createSnapshot(state: ResumeWorkspaceState, analysis: AnalysisResponse): AnalysisSnapshot {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    fileName: state.fileName,
    fileType: state.fileType,
    uploadedAt: state.uploadedAt,
    resumeText: state.resumeText,
    resumePreview: state.resumePreview,
    jobDescription: state.jobDescription,
    companyName: state.companyName,
    role: state.role,
    targetDomain: state.targetDomain,
    linkedinId: state.linkedinId,
    analysis,
  };
}

export function ResumeWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ResumeWorkspaceState>(buildInitialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
    if (parsed) {
      setState((current) => ({
        ...current,
        ...parsed,
        analysis: normalizeAnalysis(parsed.analysis as Partial<AnalysisResponse> | undefined),
        history: normalizeHistory(parsed.history),
        activeHistoryId: (parsed.activeHistoryId as string | null | undefined) ?? current.activeHistoryId,
        isHydrated: true,
      }));
      return;
    }
    setState((current) => ({ ...current, isHydrated: true }));
  }, []);

  useEffect(() => {
    if (!state.isHydrated) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const actions = useMemo<ResumeWorkspaceActions>(() => {
    const runAnalysis = async (analysisInput: {
      resumeText: string;
      jobDescription: string;
      companyName: string;
      role: string;
      targetDomain: string;
      linkedinId: string;
    }) => {
      const analysis = await analyzeResume({
        resume_text: analysisInput.resumeText,
        job_description: analysisInput.jobDescription,
        company_name: analysisInput.companyName,
        role: analysisInput.role,
        target_domain: analysisInput.targetDomain,
        linkedin_id: analysisInput.linkedinId,
        provider: "mock",
      }).catch(() => defaultAnalysis);
      return analysis;
    };

    return {
      setResumeText: (value) => setState((current) => ({ ...current, resumeText: value })),
      setResumePreview: (value) => setState((current) => ({ ...current, resumePreview: value })),
      setJobDescription: (value) => setState((current) => ({ ...current, jobDescription: value })),
      setCompanyName: (value) => setState((current) => ({ ...current, companyName: value })),
      setRole: (value) => setState((current) => ({ ...current, role: value })),
      setTargetDomain: (value) => setState((current) => ({ ...current, targetDomain: value })),
      setLinkedinId: (value) => setState((current) => ({ ...current, linkedinId: value })),
      updateResumeFromUpload: async ({ fileName, fileType, resumeText, resumePreview }) => {
        const current = stateRef.current;
        const nextState: ResumeWorkspaceState = {
          ...current,
          fileName,
          fileType,
          resumeText,
          resumePreview,
          uploadedAt: new Date().toISOString(),
          isAnalyzing: true,
        };
        setState(nextState);

        const analysis = await runAnalysis({
          resumeText,
          jobDescription: nextState.jobDescription,
          companyName: nextState.companyName,
          role: nextState.role,
          targetDomain: nextState.targetDomain,
          linkedinId: nextState.linkedinId,
        });

        setState((currentState) => {
          const completed: ResumeWorkspaceState = {
            ...currentState,
            analysis,
            history: [createSnapshot({ ...currentState, isAnalyzing: false }, analysis), ...currentState.history]
              .slice(0, 8),
            activeHistoryId: null,
            isAnalyzing: false,
          };
          return completed;
        });
      },
      refreshAnalysis: async (overrides) => {
        const current = stateRef.current;
        const merged = {
          resumeText: current.resumeText,
          jobDescription: overrides?.jobDescription ?? current.jobDescription,
          companyName: overrides?.companyName ?? current.companyName,
          role: overrides?.role ?? current.role,
          targetDomain: overrides?.targetDomain ?? current.targetDomain,
          linkedinId: overrides?.linkedinId ?? current.linkedinId,
        };
        setState((currentState) => ({ ...currentState, ...merged, isAnalyzing: true }));
        const analysis = await runAnalysis(merged);
        setState((currentState) => ({
          ...currentState,
          ...merged,
          analysis,
          history: [createSnapshot({ ...currentState, ...merged, isAnalyzing: false }, analysis), ...currentState.history].slice(0, 8),
          activeHistoryId: null,
          isAnalyzing: false,
        }));
      },
      selectHistoryAnalysis: (id) => {
        const selected = stateRef.current.history.find((entry) => entry.id === id);
        if (!selected) {
          return;
        }
        setState((current) => ({
          ...current,
          fileName: selected.fileName,
          fileType: selected.fileType,
          uploadedAt: selected.uploadedAt,
          resumeText: selected.resumeText,
          resumePreview: selected.resumePreview,
          jobDescription: selected.jobDescription,
          companyName: selected.companyName,
          role: selected.role,
          targetDomain: selected.targetDomain,
          linkedinId: selected.linkedinId,
          analysis: selected.analysis,
          activeHistoryId: selected.id,
        }));
      },
      resetWorkspace: () => setState(buildInitialState()),
    };
  }, []);

  return <ResumeWorkspaceContext.Provider value={{ ...state, ...actions }}>{children}</ResumeWorkspaceContext.Provider>;
}

export function useResumeWorkspace() {
  const context = useContext(ResumeWorkspaceContext);
  if (!context) {
    throw new Error("useResumeWorkspace must be used within ResumeWorkspaceProvider");
  }
  return context;
}
