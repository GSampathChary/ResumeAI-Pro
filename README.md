# ResumeAI Pro

AI-powered resume analysis, ATS optimization, interview preparation, and career document generation.

## Stack

- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: FastAPI, Pydantic, SQLite
- AI: Gemini-ready service layer with mock fallback
- Parsers: PDF, DOCX, TXT

## Quick Start

### 1) Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Configuration

Create `backend/.env` from `backend/.env.example` and set `GEMINI_API_KEY` if you want live AI-generated outputs.

Create `frontend/.env.local` from `frontend/.env.example` and set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`.

If you want to run the backend on another machine or container, change that value to the reachable IP or hostname, for example `http://192.168.1.20:8000`.

## Do You Need a Local IP?

- No, if both services run on the same computer.
- Yes, only if the frontend browser cannot reach the backend through `localhost`.
- The backend can bind to `0.0.0.0`, but the browser still needs a real URL such as `http://localhost:8000` or `http://192.168.1.20:8000`.
- For normal local development, keep backend on `0.0.0.0:8000` and use `http://localhost:8000` in the frontend.

## Typical Setup

1. Start the backend first.
2. Start the frontend second.
3. Open `http://localhost:3000`.
4. Use the dashboard, upload, analysis, ATS, interview, cover letter, LinkedIn, job match, and report pages.

## Features

- Resume upload and parsing
- ATS score dashboard
- Skill gap analysis
- Interview question generator
- Cover letter builder
- LinkedIn summary generator
- Job match comparison
- PDF report download

## Notes

- If Gemini is not configured, the app uses deterministic fallback responses so the UI still works.
- The sample resume and job description are already wired into the demo pages.
- You can replace the sample text with your own resume or wire file upload to the analysis pages later.
