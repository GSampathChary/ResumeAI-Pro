from __future__ import annotations

from fastapi import APIRouter

from app.schemas import AnalyzeRequest, JobMatchResponse
from app.services.resume_service import profile_from_text
from app.utils.heuristics import build_job_match, suggest_related_jobs

router = APIRouter(tags=["jobmatch"])


@router.post("/jobmatch", response_model=JobMatchResponse)
def job_match(payload: AnalyzeRequest) -> JobMatchResponse:
    profile = profile_from_text(payload.resume_text, filename="uploaded-resume", file_type="text")
    score, matched, missing, suggestions = build_job_match(profile, payload.job_description)
    return JobMatchResponse(
        matching_score=score,
        matched_keywords=matched,
        missing_skills=missing,
        suggestions=suggestions,
        related_jobs=suggest_related_jobs(profile, payload.job_description, payload.target_domain),
    )
