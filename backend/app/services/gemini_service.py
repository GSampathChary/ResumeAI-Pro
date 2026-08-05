from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from app.core.config import get_settings


PROMPTS_DIR = Path(__file__).resolve().parents[1] / "prompts"


def load_prompt(name: str) -> str:
    path = PROMPTS_DIR / name
    if path.exists():
        return path.read_text(encoding="utf-8")
    return ""


def build_prompt(template_name: str, context: dict[str, str]) -> str:
    template = load_prompt(template_name)
    if not template:
        template = "\n".join(f"{key}: {{{key}}}" for key in context)
    return template.format(**context)


def _fallback_response(kind: str, context: dict[str, str]) -> str:
    if kind == "ats":
        return json.dumps(
            {
                "suggestions": [
                    "Tailor the summary to the target role.",
                    "Add more quantified impact statements.",
                    "Mirror keywords from the job description in project bullets.",
                ]
            }
        )
    if kind == "interview":
        return json.dumps(
            {
                "technical": ["How would you structure this API?"],
                "behavioral": ["Tell me about a time you solved a difficult bug."],
                "hr": ["Why do you want this role?"],
                "project_based": ["Walk me through one project end-to-end."],
                "coding": ["Write an API contract for a file upload endpoint."],
                "scenario_based": ["How would you prioritize a production incident?"],
            }
        )
    if kind == "coverletter":
        return f"Dear {context.get('company_name', 'Hiring Manager')},\n\n{context.get('summary', '')}\n\nSincerely,\nResumeAI Pro"
    if kind == "linkedin":
        return json.dumps(
            {
                "headline": f"{context.get('name', 'Professional')} | {context.get('domain', 'Software Engineering').replace('_', ' ').title()}",
                "about": context.get("summary", ""),
                "skills": ["Python", "FastAPI", "React", "Flutter"],
                "keywords": ["AI", "Full Stack", "Production Deployment"],
                "linkedin_id": context.get("linkedin_id", ""),
                "profile_updates": [
                    "Headline should mirror the target role.",
                    "About section should emphasize measurable outcomes.",
                    "Featured projects should be aligned to the selected domain.",
                ],
            }
        )
    if kind == "roadmap":
        return json.dumps(
            {
                "roadmap": ["Study the target stack", "Build a project", "Ship a portfolio demo"],
                "courses": ["Official docs", "Hands-on tutorial"],
                "projects": ["Resume parser", "ATS analyzer", "Interview generator"],
                "certifications": ["Optional cloud or AI certification"],
            }
        )
    if kind == "jobmatch":
        return json.dumps({"matching_score": 70, "matched_keywords": [], "missing_skills": [], "suggestions": [], "related_jobs": []})
    return context.get("summary", "")


def generate_with_gemini(kind: str, context: dict[str, str], prompt_name: str) -> str:
    settings = get_settings()
    api_key = settings.gemini_api_key or os.environ.get("GEMINI_API_KEY", "")
    prompt = build_prompt(prompt_name, context)
    if not api_key:
        return _fallback_response(kind, context)

    model = urllib.parse.quote(settings.gemini_model, safe="")
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        f"?key={urllib.parse.quote(api_key)}"
    )
    body = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt,
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "topP": 0.9,
            "maxOutputTokens": 2048,
        },
    }
    request = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError:
        return _fallback_response(kind, context)

    candidates = payload.get("candidates", [])
    if not candidates:
        return _fallback_response(kind, context)
    parts = candidates[0].get("content", {}).get("parts", [])
    text = "".join(part.get("text", "") for part in parts)
    return text.strip() or _fallback_response(kind, context)
