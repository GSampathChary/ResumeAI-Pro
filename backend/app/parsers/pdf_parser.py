from __future__ import annotations

from pathlib import Path

from app.parsers.text_cleaner import clean_text


def extract_pdf_text(path: str | Path) -> str:
    try:
        from pypdf import PdfReader
    except Exception as exc:  # pragma: no cover - fallback for missing dependency
        raise RuntimeError("PDF parsing requires pypdf to be installed") from exc

    reader = PdfReader(str(path))
    chunks: list[str] = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text:
            chunks.append(page_text)
    return clean_text("\n".join(chunks))

