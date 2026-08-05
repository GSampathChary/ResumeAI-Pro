from __future__ import annotations

from fastapi import APIRouter

from app.schemas import AnalyzeRequest, LinkedInResponse
from app.services.linkedin_service import generate_linkedin_summary
from app.services.resume_service import profile_from_text

router = APIRouter(tags=["linkedin"])


@router.post("/linkedin", response_model=LinkedInResponse)
def linkedin(payload: AnalyzeRequest) -> LinkedInResponse:
    profile = profile_from_text(payload.resume_text, filename="uploaded-resume", file_type="text")
    return generate_linkedin_summary(profile, payload.provider, domain=payload.target_domain, linkedin_id=payload.linkedin_id)
