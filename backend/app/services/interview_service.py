from __future__ import annotations

from app.schemas import InterviewResponse, ResumeProfile
from app.services.gemini_service import generate_with_gemini
from app.utils.heuristics import extract_job_keywords, infer_domain_profile


def generate_interview_questions(
    profile: ResumeProfile,
    job_description: str = "",
    provider: str = "gemini",
    *,
    domain: str = "",
) -> InterviewResponse:
    inferred_domain = infer_domain_profile(domain, profile, job_description)
    context = {
        "summary": profile.summary,
        "skills": ", ".join(profile.skills),
        "job_description": job_description,
        "domain": inferred_domain,
    }
    raw = generate_with_gemini("interview", context, "interview_prompt.txt") if provider == "gemini" else ""
    if raw:
        import json

        try:
            payload = json.loads(raw)
            return InterviewResponse(**payload)
        except Exception:
            pass

    keywords = extract_job_keywords(job_description)
    focus = inferred_domain.replace("_", " ")
    tech = [
        f"How have you applied {keywords[0]} in a {focus} workflow?" if keywords else f"How do you design a production-grade {focus} solution?",
        f"How would you measure success for a {focus} project after launch?",
        "What trade-offs did you make when building your last project?",
        "How do you validate model, API, or product changes before release?",
    ]
    behavioral = [
        "Tell me about a time you took full ownership of a difficult delivery.",
        "Describe a situation where you improved a process or workflow.",
        "How do you collaborate with non-technical stakeholders?",
    ]
    hr = [
        "Why does this role fit your experience and long-term goals?",
        "What kind of team and environment helps you do your best work?",
    ]
    project_based = [
        f"Walk me through the architecture of your strongest {focus} project.",
        "How did you decide the data flow, storage, and deployment setup?",
    ]
    coding = [
        "Write a function that validates uploaded resume files and rejects unsafe formats.",
        "Implement a scoring function that ranks keyword matches against a job description.",
    ]
    scenario_based = [
        "A resume parser suddenly starts failing on PDF uploads. How would you troubleshoot it?",
        f"How would you add a new capability to a {focus} product without rewriting the application?",
    ]
    return InterviewResponse(
        technical=tech,
        behavioral=behavioral,
        hr=hr,
        project_based=project_based,
        coding=coding,
        scenario_based=scenario_based,
    )
