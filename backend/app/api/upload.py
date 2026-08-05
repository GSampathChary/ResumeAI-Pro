from __future__ import annotations

import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import get_settings
from app.schemas import UploadMetadata
from app.services.resume_service import extract_text_from_file

router = APIRouter(tags=["upload"])


@router.post("/upload", response_model=UploadMetadata)
async def upload_resume(file: UploadFile = File(...)) -> UploadMetadata:
    settings = get_settings()
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".pdf", ".docx", ".txt", ".md"}:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, TXT, or MD.")

    content = await file.read()
    if len(content) > settings.max_upload_size_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Maximum is {settings.max_upload_size_mb} MB.")

    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid4().hex}_{file.filename}"
    stored_path = settings.upload_dir / stored_name
    stored_path.write_bytes(content)

    try:
        text, _file_type = extract_text_from_file(stored_path, file.filename or stored_name)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    preview = text[:400].strip()
    return UploadMetadata(
        filename=file.filename or stored_name,
        file_type=suffix.lstrip("."),
        size_bytes=len(content),
        extracted_text_preview=preview,
        extracted_text=text,
    )
