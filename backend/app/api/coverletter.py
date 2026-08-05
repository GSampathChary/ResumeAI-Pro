from __future__ import annotations

from fastapi import APIRouter

from app.schemas import AnalyzeRequest, CoverLetterResponse
from app.services.coverletter_service import generate_cover_letter
from app.services.resume_service import profile_from_text

router = APIRouter(tags=["coverletter"])


@router.post("/coverletter", response_model=CoverLetterResponse)
def coverletter(payload: AnalyzeRequest) -> CoverLetterResponse:
    profile = profile_from_text(payload.resume_text, filename="uploaded-resume", file_type="text")
    return generate_cover_letter(
        profile,
        payload.company_name,
        payload.role,
        payload.job_description,
        payload.provider,
        domain=payload.target_domain,
    )
