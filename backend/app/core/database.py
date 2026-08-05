from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Iterator

from app.core.config import get_settings


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    settings = get_settings()
    settings.database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(settings.database_path)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
    finally:
        connection.close()


def initialize_database() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS analysis_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                filename TEXT NOT NULL,
                file_type TEXT NOT NULL,
                ats_score INTEGER NOT NULL,
                data_json TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS app_settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
            """
        )
        connection.commit()


def save_analysis(filename: str, file_type: str, ats_score: int, data: dict) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO analysis_runs (created_at, filename, file_type, ats_score, data_json)
            VALUES (?, ?, ?, ?, ?)
            """,
            (_utc_now(), filename, file_type, ats_score, json.dumps(data, ensure_ascii=False)),
        )
        connection.commit()


def list_recent_analyses(limit: int = 5) -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, created_at, filename, file_type, ats_score, data_json
            FROM analysis_runs
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    items = []
    for row in rows:
        payload = json.loads(row["data_json"])
        payload.update(
            {
                "id": row["id"],
                "created_at": row["created_at"],
                "filename": row["filename"],
                "file_type": row["file_type"],
                "ats_score": row["ats_score"],
            }
        )
        items.append(payload)
    return items
