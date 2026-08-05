from __future__ import annotations

from app.schemas import ATSBreakdown, ResumeProfile
from app.utils.heuristics import build_skills_gap, score_ats


def analyze_ats(profile: ResumeProfile, job_description: str = "") -> ATSBreakdown:
    return score_ats(profile, job_description)


def analyze_skills_gap(profile: ResumeProfile, job_description: str = ""):
    return build_skills_gap(profile, job_description)

