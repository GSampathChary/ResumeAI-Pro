from __future__ import annotations

from app.schemas import LinkedInResponse, ResumeProfile
from app.services.gemini_service import generate_with_gemini
from app.utils.heuristics import infer_domain_profile


def generate_linkedin_summary(
    profile: ResumeProfile,
    provider: str = "gemini",
    *,
    domain: str = "",
    linkedin_id: str = "",
) -> LinkedInResponse:
    inferred_domain = infer_domain_profile(domain, profile)
    context = {
        "summary": profile.summary,
        "skills": ", ".join(profile.skills),
        "name": profile.contact.name,
        "domain": inferred_domain,
        "linkedin_id": linkedin_id,
    }
    raw = generate_with_gemini("linkedin", context, "linkedin_prompt.txt") if provider == "gemini" else ""
    if raw:
        import json

        try:
            payload = json.loads(raw)
            if "profile_updates" not in payload:
                payload["profile_updates"] = [
                    "Refresh the headline with your target domain and strongest stack.",
                    "Rewrite the About section so it mirrors the resume summary and role focus.",
                    "Pin the most relevant skills and add a featured project aligned to the domain.",
                ]
            payload["linkedin_id"] = linkedin_id
            return LinkedInResponse(**payload)
        except Exception:
            pass

    title_map = {
        "data science": "Data Scientist",
        "ai": "AI Engineer",
        "backend": "Backend Engineer",
        "frontend": "Frontend Engineer",
        "mobile": "Mobile Developer",
        "devops": "DevOps Engineer",
        "full stack": "Full Stack Engineer",
    }
    role_label = title_map.get(inferred_domain, "Software Engineer")
    headline = f"{profile.contact.name or 'Professional'} | {role_label} | {', '.join(profile.skills[:3]) or 'Product Delivery'}"
    about = (
        f"{profile.contact.name or 'Professional'} builds {inferred_domain}-aligned products end-to-end, combining product thinking, architecture, "
        f"delivery discipline, and measurable outcomes. {profile.summary}"
    )
    keywords = profile.skills[:10]
    return LinkedInResponse(
        headline=headline,
        about=about,
        skills=keywords,
        keywords=keywords,
        professional_summary=profile.summary,
        linkedin_id=linkedin_id,
        profile_updates=[
            f"LinkedIn ID: {linkedin_id or 'not provided'}",
            f"Domain focus: {inferred_domain.replace('_', ' ').title()}",
            "Headline should lead with the target role and strongest stack.",
            "About section should spotlight measurable impact and the domain-specific story.",
            "Use the skills section to mirror the resume keyword set.",
        ],
    )
