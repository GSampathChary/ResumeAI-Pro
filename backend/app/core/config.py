from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path


class Settings:
    project_name: str = "ResumeAI Pro"
    version: str = "1.0.0"
    api_prefix: str = ""
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    cors_origins: tuple[str, ...] = (
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    )
    gemini_api_key: str = os.environ.get("GEMINI_API_KEY", "")
    gemini_model: str = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    upload_dir: Path = Path(__file__).resolve().parents[2] / "uploads"
    database_path: Path = Path(__file__).resolve().parents[2] / "resumeai.sqlite3"
    max_upload_size_mb: int = 10


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
