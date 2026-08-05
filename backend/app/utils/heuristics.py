from __future__ import annotations

import re
from collections import Counter
from pathlib import Path
from typing import Iterable

from app.schemas import ATSBreakdown, CareerOpportunity, ExtractedContact, ResumeProfile, ResumeSection, SkillsGapResponse


SECTION_HEADERS = {
    "summary": ["summary", "professional summary", "profile"],
    "experience": ["experience", "work experience", "employment", "professional experience"],
    "projects": ["projects", "key projects", "project experience", "portfolio"],
    "education": ["education", "academic background", "academics"],
    "skills": ["skills", "technical skills", "core competencies", "competencies"],
    "certifications": ["certifications", "certificates", "licenses"],
    "languages": ["languages"],
    "achievements": ["achievements", "awards"],
}

ROLE_KEYWORDS = [
    "fastapi",
    "python",
    "flask",
    "django",
    "postgresql",
    "sqlite",
    "mysql",
    "rest api",
    "api",
    "git",
    "docker",
    "aws",
    "azure",
    "gcp",
    "llm",
    "gemini",
    "openai",
    "claude",
    "react",
    "next.js",
    "typescript",
    "javascript",
    "flutter",
    "spring boot",
    "tensorflow",
    "pytorch",
    "kubernetes",
    "ci/cd",
    "testing",
    "deployment",
    "authentication",
    "rbac",
    "computer vision",
    "machine learning",
    "deep learning",
    "data science",
]

DOMAIN_JOB_MAP = {
    "data": [
        "Data Analyst",
        "Data Scientist",
        "Analytics Engineer",
        "Business Intelligence Analyst",
    ],
    "data science": [
        "Data Scientist",
        "Machine Learning Engineer",
        "Applied Scientist",
        "MLOps Engineer",
    ],
    "ml": [
        "Machine Learning Engineer",
        "Applied Scientist",
        "AI Engineer",
    ],
    "ai": [
        "AI Engineer",
        "LLM Engineer",
        "Applied AI Developer",
    ],
    "backend": [
        "Backend Engineer",
        "Platform Engineer",
        "API Developer",
    ],
    "frontend": [
        "Frontend Engineer",
        "React Developer",
        "UI Engineer",
    ],
    "full stack": [
        "Full Stack Engineer",
        "Product Engineer",
        "Software Engineer",
    ],
    "mobile": [
        "Mobile Application Developer",
        "Flutter Developer",
        "Android Engineer",
    ],
    "devops": [
        "DevOps Engineer",
        "Cloud Engineer",
        "Platform Engineer",
    ],
    "product": [
        "Product Engineer",
        "Technical Product Specialist",
        "Solutions Engineer",
    ],
}

JOB_STOPWORDS = {
    "and",
    "the",
    "for",
    "with",
    "using",
    "from",
    "into",
    "across",
    "responsible",
    "work",
    "worked",
    "developed",
    "built",
    "design",
    "designed",
    "to",
    "of",
    "in",
    "on",
    "a",
    "an",
    "as",
    "by",
    "or",
    "is",
    "are",
    "be",
    "was",
    "were",
    "this",
    "that",
}


def normalize_whitespace(text: str) -> str:
    cleaned = text.replace("\x00", " ")
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def split_lines(text: str) -> list[str]:
    return [line.strip(" -*\t") for line in text.splitlines() if line.strip()]


def detect_contact(text: str) -> ExtractedContact:
    lines = split_lines(text)
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    phone_match = re.search(r"(\+?\d[\d\s().-]{8,}\d)", text)
    link_matches = re.findall(r"(https?://\S+|www\.\S+|linkedin\.com/\S+|github\.com/\S+)", text, flags=re.I)
    location = ""
    for line in lines[:5]:
        if any(token in line.lower() for token in ("india", "hyderabad", "bangalore", "bengaluru", "delhi", "mumbai")):
            location = line
            break
    name = lines[0] if lines else ""
    if email_match and name.lower() in email_match.group(0).lower():
        name = lines[0] if lines else ""
    return ExtractedContact(
        name=name,
        email=email_match.group(0) if email_match else "",
        phone=phone_match.group(0) if phone_match else "",
        location=location,
        links=sorted(set(link_matches)),
    )


def extract_sections(text: str) -> list[ResumeSection]:
    lines = split_lines(text)
    sections: list[ResumeSection] = []
    current_title = "Overview"
    current_items: list[str] = []

    def flush() -> None:
        nonlocal current_items, current_title
        if current_items:
            sections.append(ResumeSection(title=current_title, items=current_items))
            current_items = []

    for line in lines:
        lowered = line.lower().rstrip(":")
        matched = None
        for title, aliases in SECTION_HEADERS.items():
            if lowered == title or lowered in aliases:
                matched = title.title()
                break
        if matched:
            flush()
            current_title = matched
            continue
        if len(line) <= 80 and line.endswith(":"):
            flush()
            current_title = line.rstrip(":")
            continue
        current_items.append(line)
    flush()
    return sections


def extract_skill_candidates(text: str) -> list[str]:
    lowered = text.lower()
    skills: list[str] = []
    for keyword in ROLE_KEYWORDS:
        if keyword in lowered:
            skills.append(keyword.title() if keyword.islower() else keyword)
    extra_patterns = [
        r"\b(?:python|java|dart|react\.?js|next\.?js|flutter|fastapi|spring boot|pytorch|tensorflow|keras|postgresql|mysql|sqlite|docker|git|github|postman|firebase|opencv|tflite|onxx runtime|onnx runtime)\b",
    ]
    for pattern in extra_patterns:
        for match in re.findall(pattern, lowered, flags=re.I):
            normalized = match.replace("React.js", "React.js").replace("Next.js", "Next.js")
            if normalized not in skills:
                skills.append(normalized)
    return dedupe_preserve_order(skills)


def dedupe_preserve_order(items: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        key = item.strip().lower()
        if key and key not in seen:
            seen.add(key)
            result.append(item.strip())
    return result


def infer_strengths(text: str, skills: list[str]) -> list[str]:
    lowered = text.lower()
    strengths = []
    if "single-handedly" in lowered or "independently" in lowered:
        strengths.append("Strong ownership and end-to-end delivery")
    if any(token in lowered for token in ("deployment", "production", "released", "published")):
        strengths.append("Production deployment experience")
    if any(token in lowered for token in ("collaborat", "scientist", "stakeholder")):
        strengths.append("Cross-functional collaboration")
    if any(token in lowered for token in ("ai", "ml", "deep learning", "computer vision")):
        strengths.append("Applied AI and ML capability")
    if len(skills) >= 8:
        strengths.append("Broad technical stack coverage")
    return dedupe_preserve_order(strengths)


def infer_weaknesses(text: str, skills: list[str]) -> list[str]:
    lowered = text.lower()
    weaknesses = []
    if "testing" not in lowered and "unit test" not in lowered:
        weaknesses.append("Testing evidence is light or absent")
    if "metrics" not in lowered and "kpi" not in lowered:
        weaknesses.append("Impact metrics could be quantified more clearly")
    if len(skills) < 6:
        weaknesses.append("Skill section could be expanded")
    return dedupe_preserve_order(weaknesses)


def build_profile(source_text: str, *, filename: str = "", file_type: str = "") -> ResumeProfile:
    text = normalize_whitespace(source_text)
    sections = extract_sections(text)
    skills = extract_skill_candidates(text)
    contact = detect_contact(text)
    if contact.name and len(contact.name.split()) <= 2 and sections:
        first_section_lines = sections[0].items[:2]
        if first_section_lines:
            contact.name = first_section_lines[0]
    summary = ""
    for section in sections:
        if section.title.lower() == "summary":
            summary = " ".join(section.items[:4])
            break
    if not summary:
        summary = " ".join(split_lines(text)[:3])
    experience = next((section.items for section in sections if section.title.lower() == "experience"), [])
    projects = next((section.items for section in sections if section.title.lower() == "projects"), [])
    education = next((section.items for section in sections if section.title.lower() == "education"), [])
    certifications = next((section.items for section in sections if section.title.lower() == "certifications"), [])
    languages = next((section.items for section in sections if section.title.lower() == "languages"), [])
    return ResumeProfile(
        source_filename=filename,
        file_type=file_type,
        raw_text=text,
        contact=contact,
        summary=summary[:900],
        strengths=infer_strengths(text, skills),
        weaknesses=infer_weaknesses(text, skills),
        sections=sections,
        skills=skills,
        experience_highlights=experience[:8],
        projects=projects[:8],
        education=education[:5],
        certifications=certifications[:5],
        languages=languages[:5],
    )


def keyword_counter(text: str) -> Counter[str]:
    lowered = text.lower()
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9+.#/-]{1,}", lowered)
    filtered = [word for word in words if word not in JOB_STOPWORDS]
    return Counter(filtered)


def extract_job_keywords(job_description: str, limit: int = 24) -> list[str]:
    raw = normalize_whitespace(job_description)
    if not raw:
        return []
    found = []
    lowered = raw.lower()
    for keyword in ROLE_KEYWORDS:
        if keyword in lowered:
            found.append(keyword)
    counts = keyword_counter(lowered)
    for word, _count in counts.most_common():
        if len(word) < 4:
            continue
        if word not in found and not word.isdigit():
            found.append(word)
        if len(found) >= limit:
            break
    return dedupe_preserve_order(found[:limit])


def infer_domain_profile(domain: str, profile: ResumeProfile | None = None, job_description: str = "") -> str:
    candidates = [domain.strip().lower(), job_description.lower()]
    if profile:
        candidates.append(" ".join(profile.skills).lower())
        candidates.append(profile.summary.lower())
    haystack = " ".join(candidates)
    for key in DOMAIN_JOB_MAP:
        if key in haystack:
            return key
    if any(token in haystack for token in ("flutter", "android", "ios", "mobile")):
        return "mobile"
    if any(token in haystack for token in ("react", "next", "frontend", "ui")):
        return "frontend"
    if any(token in haystack for token in ("fastapi", "django", "backend", "api")):
        return "backend"
    if any(token in haystack for token in ("ai", "llm", "ml", "machine learning")):
        return "ai"
    return "full stack"


def score_ats(profile: ResumeProfile, job_description: str = "") -> ATSBreakdown:
    text = profile.raw_text.lower()
    job_keywords = extract_job_keywords(job_description)
    detected = [keyword for keyword in job_keywords if keyword.lower() in text]
    missing = [keyword for keyword in job_keywords if keyword.lower() not in text]
    keyword_ratio = 100 if not job_keywords else round((len(detected) / len(job_keywords)) * 100)
    has_projects = 100 if profile.projects else 45
    has_experience = 100 if profile.experience_highlights else 55
    has_education = 100 if profile.education else 60
    formatting = 90 if profile.sections else 60
    skills_match = min(100, 30 + len(profile.skills) * 6)
    grammar = 92 if len(re.findall(r"\b\w+\b", profile.raw_text)) > 120 else 80
    overall = round(
        (formatting * 0.15)
        + (skills_match * 0.2)
        + (keyword_ratio * 0.2)
        + (has_projects * 0.15)
        + (has_experience * 0.15)
        + (has_education * 0.1)
        + (grammar * 0.05)
    )
    suggestions = []
    if keyword_ratio < 60:
        suggestions.append("Mirror more job description keywords in the summary and experience bullets.")
    if not profile.projects:
        suggestions.append("Add a projects section with outcome-focused bullet points.")
    if len(profile.skills) < 8:
        suggestions.append("Expand the skills section with relevant tools, frameworks, and deployment stack.")
    if len(profile.experience_highlights) < 3:
        suggestions.append("Strengthen experience bullets with measurable outcomes and scope.")
    if profile.contact.email == "":
        suggestions.append("Place contact information more visibly at the top of the resume.")
    if not suggestions:
        suggestions.append("The resume reads well. Tailor the top summary to the target role for an even stronger match.")
    return ATSBreakdown(
        overall_score=max(1, min(100, overall)),
        formatting=formatting,
        skills_match=min(100, skills_match),
        keywords=keyword_ratio,
        projects=has_projects,
        experience=has_experience,
        education=has_education,
        grammar=grammar,
        detected_keywords=detected,
        missing_keywords=missing,
        suggestions=suggestions,
    )


def build_skills_gap(profile: ResumeProfile, job_description: str = "") -> SkillsGapResponse:
    job_keywords = extract_job_keywords(job_description)
    detected = dedupe_preserve_order(profile.skills)
    detected_lower = {skill.lower() for skill in detected}
    missing = [keyword for keyword in job_keywords if keyword.lower() not in detected_lower]
    recommended = dedupe_preserve_order(missing + ["Testing", "System Design", "Cloud Deployment", "CI/CD"])
    priority = recommended[:5]
    learning_resources = [
        "Official documentation for the missing stack item",
        "A hands-on project that uses the missing skill in a real workflow",
        "A short YouTube or course playlist focused on deployment and implementation",
    ]
    return SkillsGapResponse(
        detected_skills=detected,
        missing_skills=missing,
        recommended_skills=recommended[:10],
        priority_skills=priority,
        learning_resources=learning_resources,
    )


def summarize_text(text: str, max_sentences: int = 3) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", normalize_whitespace(text))
    selected = [sentence.strip() for sentence in sentences if sentence.strip()][:max_sentences]
    return " ".join(selected)


def sentence_bullets(text: str, max_items: int = 5) -> list[str]:
    sentences = re.split(r"(?<=[.!?])\s+", normalize_whitespace(text))
    bullets = [sentence.strip(" -*\n") for sentence in sentences if len(sentence.strip()) > 20]
    return dedupe_preserve_order(bullets)[:max_items]


def collect_job_summary(job_description: str) -> str:
    lines = split_lines(job_description)
    return " ".join(lines[:8])


def estimate_match_score(profile: ResumeProfile, job_description: str) -> int:
    keywords = extract_job_keywords(job_description)
    if not keywords:
        return 70
    profile_text = profile.raw_text.lower()
    overlap = sum(1 for keyword in keywords if keyword.lower() in profile_text)
    base = (overlap / len(keywords)) * 100
    return max(1, min(100, round(base + min(15, len(profile.skills) * 1.25))))


def build_job_match(profile: ResumeProfile, job_description: str) -> tuple[int, list[str], list[str], list[str]]:
    keywords = extract_job_keywords(job_description)
    profile_lower = profile.raw_text.lower()
    matched = [keyword for keyword in keywords if keyword.lower() in profile_lower]
    missing = [keyword for keyword in keywords if keyword.lower() not in profile_lower]
    suggestions = []
    if missing:
        suggestions.append(f"Add evidence of {missing[0]} if you have hands-on exposure.")
    suggestions.append("Reframe the summary and project bullets to mirror the target role language.")
    return estimate_match_score(profile, job_description), matched, missing, suggestions


def suggest_related_jobs(profile: ResumeProfile, job_description: str, domain: str = "") -> list[CareerOpportunity]:
    inferred_domain = infer_domain_profile(domain, profile, job_description)
    job_titles = DOMAIN_JOB_MAP.get(inferred_domain, DOMAIN_JOB_MAP["full stack"])
    keywords = extract_job_keywords(job_description)
    related: list[CareerOpportunity] = []
    skill_set = {skill.lower() for skill in profile.skills}
    for title in job_titles:
        title_tokens = {token.lower() for token in re.split(r"[^a-zA-Z0-9+.#/]+", title) if token}
        overlap = len(skill_set.intersection(title_tokens))
        keyword_bonus = sum(1 for keyword in keywords if keyword.lower() in " ".join(title_tokens))
        fit_score = max(45, min(98, 58 + overlap * 8 + keyword_bonus * 4))
        reason_parts = []
        if inferred_domain:
            reason_parts.append(f"Aligned with the inferred {inferred_domain} track")
        if profile.skills:
            reason_parts.append(f"Builds on skills like {', '.join(profile.skills[:3])}")
        if keywords:
            reason_parts.append(f"Matches target keywords such as {', '.join(keywords[:3])}")
        related.append(
            CareerOpportunity(
                title=title,
                reason=". ".join(reason_parts) or "A good next-step role for this resume profile.",
                fit_score=fit_score,
            )
        )
    return related


def extract_roles_from_text(text: str) -> list[str]:
    role_candidates = []
    lowered = text.lower()
    for role in ("developer", "engineer", "analyst", "specialist", "manager", "consultant", "architect", "scientist"):
        if role in lowered:
            role_candidates.append(role.title())
    return dedupe_preserve_order(role_candidates)
