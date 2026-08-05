# ResumeAI Pro Backend

FastAPI backend for resume parsing, ATS scoring, interview generation, cover letters, LinkedIn summaries, job matching, roadmap generation, and PDF report export.

## Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `GET /health`
- `POST /upload`
- `POST /analyze`
- `POST /ats`
- `POST /skills`
- `POST /interview`
- `POST /coverletter`
- `POST /linkedin`
- `POST /jobmatch`
- `POST /roadmap`
- `POST /report`

## Notes

- PDF and DOCX parsing is supported.
- SQLite is initialized automatically at `backend/resumeai.sqlite3`.
- Gemini is optional. If `GEMINI_API_KEY` is not set, the app uses deterministic fallback outputs.

