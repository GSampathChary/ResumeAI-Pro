from __future__ import annotations

from fastapi import APIRouter

from app.core.database import save_analysis
from app.schemas import AnalysisResponse, AnalyzeRequest, JobMatchResponse, RoadmapResponse
from app.services.ats_service import analyze_ats, analyze_skills_gap
from app.services.coverletter_service import generate_cover_letter
from app.services.interview_service import generate_interview_questions
from app.services.linkedin_service import generate_linkedin_summary
from app.services.resume_service import profile_from_text
from app.utils.heuristics import build_job_match, extract_roles_from_text, suggest_related_jobs

router = APIRouter(tags=["analysis"])


def build_roadmap(profile, job_description: str = "") -> RoadmapResponse:
    missing_focus = analyze_skills_gap(profile, job_description).priority_skills
    roadmap = [
        "1. Tighten the resume summary to mirror the target role.",
        "2. Add measurable outcomes to each experience bullet.",
        "3. Build one portfolio project that demonstrates the missing skills.",
        "4. Publish a concise case study or README for the project.",
    ]
    if missing_focus:
        roadmap.append(f"5. Prioritize: {', '.join(missing_focus[:3])}.")
    return RoadmapResponse(
        roadmap=roadmap,
        courses=[
            "Official documentation for the target stack",
            "A project-based tutorial that ends with deployment",
            "A short ATS/resume writing workshop",
        ],
        projects=[
            "Resume parser and ATS dashboard",
            "Interview question generator for target jobs",
            "Job description keyword matcher",
        ],
        certifications=["Optional cloud or AI certification aligned to the target role"],
    )


@router.post("/analyze", response_model=AnalysisResponse)
def analyze(payload: AnalyzeRequest) -> AnalysisResponse:
    profile = profile_from_text(payload.resume_text, filename="uploaded-resume", file_type="text")
    ats = analyze_ats(profile, payload.job_description)
    skills_gap = analyze_skills_gap(profile, payload.job_description)
    interview = generate_interview_questions(profile, payload.job_description, payload.provider, domain=payload.target_domain)
    linkedin = generate_linkedin_summary(
        profile,
        payload.provider,
        domain=payload.target_domain,
        linkedin_id=payload.linkedin_id,
    )
    cover_letter = generate_cover_letter(
        profile,
        payload.company_name,
        payload.role,
        payload.job_description,
        payload.provider,
        domain=payload.target_domain,
    )
    score, matched, missing, suggestions = build_job_match(profile, payload.job_description)
    job_match = JobMatchResponse(
        matching_score=score,
        matched_keywords=matched,
        missing_skills=missing,
        suggestions=suggestions,
        related_jobs=suggest_related_jobs(profile, payload.job_description, payload.target_domain),
    )
    roadmap = build_roadmap(profile, payload.job_description)
    result = AnalysisResponse(
        profile=profile,
        ats=ats,
        skills_gap=skills_gap,
        interview=interview,
        linkedin=linkedin,
        cover_letter=cover_letter,
        job_match=job_match,
        roadmap=roadmap,
        metadata={
            "roles_detected": extract_roles_from_text(payload.resume_text),
            "target_domain": payload.target_domain,
            "linkedin_id": payload.linkedin_id,
        },
    )
    save_analysis(profile.source_filename or "analysis", profile.file_type or "text", ats.overall_score, result.model_dump())
    return result
