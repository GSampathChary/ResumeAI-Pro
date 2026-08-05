# Architecture

ResumeAI Pro uses a two-tier architecture:

- Next.js frontend for navigation, dashboard views, and career generation workflows
- FastAPI backend for parsing, deterministic scoring, persistence, and AI-assisted content generation

The backend stores analysis runs in SQLite and uses modular services so new AI providers can be added later without changing the page layer.

