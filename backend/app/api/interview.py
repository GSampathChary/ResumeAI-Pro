from __future__ import annotations

from fastapi import APIRouter

from app.schemas import InterviewResponse, AnalyzeRequest
from app.services.interview_service import generate_interview_questions
from app.services.resume_service import profile_from_text

router = APIRouter(tags=["interview"])


@router.post("/interview", response_model=InterviewResponse)
def interview(payload: AnalyzeRequest) -> InterviewResponse:
    profile = profile_from_text(payload.resume_text, filename="uploaded-resume", file_type="text")
    return generate_interview_questions(profile, payload.job_description, payload.provider, domain=payload.target_domain)
