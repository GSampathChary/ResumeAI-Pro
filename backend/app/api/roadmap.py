from __future__ import annotations

from fastapi import APIRouter

from app.api.analyze import build_roadmap
from app.schemas import AnalyzeRequest, RoadmapResponse
from app.services.resume_service import profile_from_text

router = APIRouter(tags=["roadmap"])


@router.post("/roadmap", response_model=RoadmapResponse)
def roadmap(payload: AnalyzeRequest) -> RoadmapResponse:
    profile = profile_from_text(payload.resume_text, filename="uploaded-resume", file_type="text")
    return build_roadmap(profile, payload.job_description)

