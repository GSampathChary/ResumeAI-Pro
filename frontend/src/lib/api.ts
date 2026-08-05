import type {
  AnalysisResponse,
  ATSBreakdown,
  CoverLetterResponse,
  InterviewResponse,
  JobMatchResponse,
  LinkedInResponse,
  RoadmapResponse,
  UploadResponse,
  SkillsGapResponse,
} from "@/src/lib/types";
import { defaultAnalysis } from "@/src/lib/demo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function requestJson<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error("Backend unavailable");
  }
}

export interface AnalyzePayload {
  resume_text: string;
  job_description?: string;
  company_name?: string;
  role?: string;
  target_domain?: string;
  linkedin_id?: string;
  provider?: "gemini" | "mock";
}

export async function uploadResumeFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    return (await response.json()) as UploadResponse;
  } catch {
    return {
      filename: file.name,
      file_type: file.name.split(".").pop() ?? "txt",
      size_bytes: file.size,
      extracted_text_preview: defaultAnalysis.profile.summary,
      extracted_text: defaultAnalysis.profile.raw_text,
    };
  }
}

export async function analyzeResume(payload: AnalyzePayload): Promise<AnalysisResponse> {
  return requestJson<AnalysisResponse>(
    "/analyze",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    defaultAnalysis,
  );
}

export async function getATS(payload: AnalyzePayload): Promise<ATSBreakdown> {
  return requestJson<ATSBreakdown>(
    "/ats",
    { method: "POST", body: JSON.stringify(payload) },
    defaultAnalysis.ats,
  );
}

export async function getSkills(payload: AnalyzePayload): Promise<SkillsGapResponse> {
  return requestJson<SkillsGapResponse>(
    "/skills",
    { method: "POST", body: JSON.stringify(payload) },
    defaultAnalysis.skills_gap,
  );
}

export async function getInterview(payload: AnalyzePayload): Promise<InterviewResponse> {
  return requestJson<InterviewResponse>(
    "/interview",
    { method: "POST", body: JSON.stringify(payload) },
    defaultAnalysis.interview,
  );
}

export async function getCoverLetter(payload: AnalyzePayload): Promise<CoverLetterResponse> {
  return requestJson<CoverLetterResponse>(
    "/coverletter",
    { method: "POST", body: JSON.stringify(payload) },
    defaultAnalysis.cover_letter,
  );
}

export async function getLinkedIn(payload: AnalyzePayload): Promise<LinkedInResponse> {
  return requestJson<LinkedInResponse>(
    "/linkedin",
    { method: "POST", body: JSON.stringify(payload) },
    defaultAnalysis.linkedin,
  );
}

export async function getJobMatch(payload: AnalyzePayload): Promise<JobMatchResponse> {
  return requestJson<JobMatchResponse>(
    "/jobmatch",
    { method: "POST", body: JSON.stringify(payload) },
    defaultAnalysis.job_match,
  );
}

export async function getRoadmap(payload: AnalyzePayload): Promise<RoadmapResponse> {
  return requestJson<RoadmapResponse>(
    "/roadmap",
    { method: "POST", body: JSON.stringify(payload) },
    defaultAnalysis.roadmap,
  );
}
