from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analyze import router as analyze_router
from app.api.ats import router as ats_router
from app.api.coverletter import router as coverletter_router
from app.api.health import router as health_router
from app.api.interview import router as interview_router
from app.api.linkedin import router as linkedin_router
from app.api.jobmatch import router as jobmatch_router
from app.api.roadmap import router as roadmap_router
from app.api.report import router as report_router
from app.api.upload import router as upload_router
from app.core.config import get_settings
from app.core.database import initialize_database

settings = get_settings()

app = FastAPI(
    title="ResumeAI Pro API",
    description="AI-powered resume analysis, ATS scoring, interview prep, and career tools.",
    version=settings.version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(upload_router)
app.include_router(analyze_router)
app.include_router(ats_router)
app.include_router(interview_router)
app.include_router(coverletter_router)
app.include_router(linkedin_router)
app.include_router(jobmatch_router)
app.include_router(roadmap_router)
app.include_router(report_router)


@app.on_event("startup")
def startup() -> None:
    initialize_database()
