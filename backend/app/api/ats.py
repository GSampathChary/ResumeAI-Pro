from __future__ import annotations

from fastapi import APIRouter

from app.schemas import AnalyzeRequest, ATSBreakdown, SkillsGapResponse
from app.services.ats_service import analyze_ats, analyze_skills_gap
from app.services.resume_service import profile_from_text

router = APIRouter(tags=["ats"])


@router.post("/ats", response_model=ATSBreakdown)
def ats(payload: AnalyzeRequest) -> ATSBreakdown:
    profile = profile_from_text(payload.resume_text, filename="uploaded-resume", file_type="text")
    return analyze_ats(profile, payload.job_description)


@router.post("/skills", response_model=SkillsGapResponse)
def skills(payload: AnalyzeRequest) -> SkillsGapResponse:
    profile = profile_from_text(payload.resume_text, filename="uploaded-resume", file_type="text")
    return analyze_skills_gap(profile, payload.job_description)

