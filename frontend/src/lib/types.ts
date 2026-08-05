export type ThemeMode = "light" | "dark";

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: string[];
}

export interface ResumeSection {
  title: string;
  items: string[];
}

export interface ResumeProfile {
  source_filename: string;
  file_type: string;
  raw_text: string;
  contact: ContactInfo;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  sections: ResumeSection[];
  skills: string[];
  experience_highlights: string[];
  projects: string[];
  education: string[];
  certifications: string[];
  languages: string[];
}

export interface ATSBreakdown {
  overall_score: number;
  formatting: number;
  skills_match: number;
  keywords: number;
  projects: number;
  experience: number;
  education: number;
  grammar: number;
  detected_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
}

export interface SkillsGapResponse {
  detected_skills: string[];
  missing_skills: string[];
  recommended_skills: string[];
  priority_skills: string[];
  learning_resources: string[];
}

export interface InterviewResponse {
  technical: string[];
  behavioral: string[];
  hr: string[];
  project_based: string[];
  coding: string[];
  scenario_based: string[];
}

export interface CoverLetterResponse {
  company_name: string;
  role: string;
  cover_letter: string;
}

export interface LinkedInResponse {
  headline: string;
  about: string;
  skills: string[];
  keywords: string[];
  professional_summary: string;
  linkedin_id: string;
  profile_updates: string[];
}

export interface CareerOpportunity {
  title: string;
  reason: string;
  fit_score: number;
}

export interface RoadmapResponse {
  roadmap: string[];
  courses: string[];
  projects: string[];
  certifications: string[];
}

export interface JobMatchResponse {
  matching_score: number;
  matched_keywords: string[];
  missing_skills: string[];
  suggestions: string[];
  related_jobs: CareerOpportunity[];
}

export interface AnalysisResponse {
  profile: ResumeProfile;
  ats: ATSBreakdown;
  skills_gap: SkillsGapResponse;
  interview: InterviewResponse;
  linkedin: LinkedInResponse;
  cover_letter: CoverLetterResponse;
  job_match: JobMatchResponse;
  roadmap: RoadmapResponse;
  metadata: Record<string, unknown>;
}

export interface UploadResponse {
  filename: string;
  file_type: string;
  size_bytes: number;
  extracted_text_preview: string;
  extracted_text: string;
}

export interface AnalysisSnapshot {
  id: string;
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
}
