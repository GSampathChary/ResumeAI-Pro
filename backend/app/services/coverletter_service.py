from __future__ import annotations

from app.schemas import CoverLetterResponse, ResumeProfile
from app.services.gemini_service import generate_with_gemini
from app.utils.heuristics import collect_job_summary
from app.utils.heuristics import infer_domain_profile


def generate_cover_letter(
    profile: ResumeProfile,
    company_name: str = "",
    role: str = "",
    job_description: str = "",
    provider: str = "gemini",
    *,
    domain: str = "",
) -> CoverLetterResponse:
    inferred_domain = infer_domain_profile(domain, profile, job_description)
    context = {
        "summary": profile.summary,
        "company_name": company_name or "Hiring Team",
        "role": role or "Software Developer",
        "job_description": collect_job_summary(job_description),
        "skills": ", ".join(profile.skills),
        "domain": inferred_domain,
    }
    raw = generate_with_gemini("coverletter", context, "coverletter_prompt.txt") if provider == "gemini" else ""
    if raw and raw.strip():
        return CoverLetterResponse(company_name=context["company_name"], role=context["role"], cover_letter=raw.strip())
    body = (
        f"Dear {context['company_name']},\n\n"
        f"I am excited to apply for the {context['role']} role within the {inferred_domain.replace('_', ' ')} space. "
        f"My background spans {', '.join(profile.skills[:6]) if profile.skills else 'full-stack development and AI-powered product delivery'}, "
        f"and I have consistently owned projects end-to-end from design through deployment.\n\n"
        f"{profile.summary}\n\n"
        "I would welcome the opportunity to contribute practical engineering judgment, reliable delivery, and a product mindset to your team.\n\n"
        "Sincerely,\n"
        f"{profile.contact.name or 'Candidate'}"
    )
    return CoverLetterResponse(company_name=context["company_name"], role=context["role"], cover_letter=body)
