from __future__ import annotations

from pathlib import Path

from app.parsers.docx_parser import extract_docx_text
from app.parsers.pdf_parser import extract_pdf_text
from app.parsers.text_cleaner import clean_text
from app.schemas import ResumeProfile
from app.utils.heuristics import build_profile


def extract_text_from_file(path: str | Path, filename: str = "") -> tuple[str, str]:
    file_path = Path(path)
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        return extract_pdf_text(file_path), "pdf"
    if suffix == ".docx":
        return extract_docx_text(file_path), "docx"
    if suffix in {".txt", ".md"}:
        return clean_text(file_path.read_text(encoding="utf-8", errors="ignore")), "text"
    raise ValueError(f"Unsupported file type: {suffix}")


def profile_from_text(text: str, *, filename: str = "", file_type: str = "") -> ResumeProfile:
    return build_profile(text, filename=filename, file_type=file_type)


def profile_from_file(path: str | Path, filename: str = "") -> ResumeProfile:
    text, file_type = extract_text_from_file(path, filename)
    return profile_from_text(text, filename=filename or Path(path).name, file_type=file_type)


def save_uploaded_file(source_path: str | Path, destination_name: str) -> Path:
    settings = get_settings()
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    destination = settings.upload_dir / destination_name
    destination.write_bytes(Path(source_path).read_bytes())
    return destination
