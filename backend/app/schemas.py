from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class ExtractedContact(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    links: list[str] = Field(default_factory=list)


class ResumeSection(BaseModel):
    title: str
    items: list[str] = Field(default_factory=list)


class ResumeProfile(BaseModel):
    source_filename: str = ""
    file_type: str = ""
    raw_text: str = ""
    contact: ExtractedContact = Field(default_factory=ExtractedContact)
    summary: str = ""
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    sections: list[ResumeSection] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    experience_highlights: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    education: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)


class ATSBreakdown(BaseModel):
    overall_score: int
    formatting: int
    skills_match: int
    keywords: int
    projects: int
    experience: int
    education: int
    grammar: int
    detected_keywords: list[str] = Field(default_factory=list)
    missing_keywords: list[str] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)


class SkillsGapResponse(BaseModel):
    detected_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    recommended_skills: list[str] = Field(default_factory=list)
    priority_skills: list[str] = Field(default_factory=list)
    learning_resources: list[str] = Field(default_factory=list)


class InterviewResponse(BaseModel):
    technical: list[str] = Field(default_factory=list)
    behavioral: list[str] = Field(default_factory=list)
    hr: list[str] = Field(default_factory=list)
    project_based: list[str] = Field(default_factory=list)
    coding: list[str] = Field(default_factory=list)
    scenario_based: list[str] = Field(default_factory=list)


class CoverLetterResponse(BaseModel):
    company_name: str = ""
    role: str = ""
    cover_letter: str = ""


class LinkedInResponse(BaseModel):
    headline: str = ""
    about: str = ""
    skills: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)
    professional_summary: str = ""
    linkedin_id: str = ""
    profile_updates: list[str] = Field(default_factory=list)


class CareerOpportunity(BaseModel):
    title: str = ""
    reason: str = ""
    fit_score: int = 0


class RoadmapResponse(BaseModel):
    roadmap: list[str] = Field(default_factory=list)
    courses: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)


class JobMatchResponse(BaseModel):
    matching_score: int = 0
    matched_keywords: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
    related_jobs: list[CareerOpportunity] = Field(default_factory=list)


class AnalysisResponse(BaseModel):
    profile: ResumeProfile
    ats: ATSBreakdown
    skills_gap: SkillsGapResponse
    interview: InterviewResponse
    linkedin: LinkedInResponse
    cover_letter: CoverLetterResponse
    job_match: JobMatchResponse
    roadmap: RoadmapResponse
    metadata: dict[str, Any] = Field(default_factory=dict)


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str = ""
    company_name: str = ""
    role: str = ""
    target_domain: str = ""
    linkedin_id: str = ""
    provider: Literal["gemini", "mock"] = "gemini"


class TextInputRequest(BaseModel):
    text: str
    job_description: str = ""
    company_name: str = ""
    role: str = ""
    target_domain: str = ""
    linkedin_id: str = ""
    provider: Literal["gemini", "mock"] = "gemini"


class UploadMetadata(BaseModel):
    filename: str
    file_type: str
    size_bytes: int
    extracted_text_preview: str
    extracted_text: str = ""


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    message: str = "ResumeAI Pro API is healthy"
