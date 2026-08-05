from __future__ import annotations

import re


def clean_text(text: str) -> str:
    cleaned = text.replace("\x0c", "\n")
    cleaned = cleaned.replace("\u00ad", "")
    cleaned = re.sub(r"(?<=\w)-\n(?=\w)", "", cleaned)
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()

