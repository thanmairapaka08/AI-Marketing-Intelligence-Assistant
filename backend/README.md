# Backend — AI Marketing Intelligence Assistant

FastAPI backend for the AI Marketing Intelligence Assistant. Lives under
`backend/` in this repository so the frontend and backend ship in one commit.

## Layout

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, health endpoints, router wiring
│   ├── schemas.py           # Pydantic request/response models
│   ├── routers/             # auth, audits, websites, dashboard, competitors, ai
│   └── services/            # SEO crawler, report generators, in-memory store
├── tests/                   # pytest suite (9 tests, all passing)
├── requirements.txt
└── .env.example
```

## Running

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

- API docs: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health
- Readiness: http://127.0.0.1:8000/ready

## Tests

```bash
cd backend
python -m pytest -q
```

Observed result on 2026-11-19: **9 passed, 0 failed** in ~1.3s.

## Environment

Copy `backend/.env.example` to `backend/.env` and fill in values:

```env
FRONTEND_URL=http://localhost:5173
DATABASE_URL=
GEMINI_API_KEY=
```

`FRONTEND_URL` is read at startup and merged into the CORS allow-list, so the
frontend origin can be changed without editing source.

## What is implemented

- Session-based auth (HttpOnly cookies, SHA-256 password hashing, refresh/logout)
- Website CRUD with a seeded demo site
- Synchronous SEO audits: real crawler with SSRF protection and an offline
  fallback DOM for sandboxed evaluation
- Five weighted metrics (title/meta, broken links, alt text, headings, canonical)
- Rule-based recommendations and a deterministic meta-suggestion endpoint
- Competitor comparison, dashboard summary, and PDF/CSV/JSON report exports

## What is intentionally not implemented

- A production database — state is held in an in-memory store that resets on restart
- Real Gemini calls — the `GEMINI_API_KEY` slot exists for future use; the
  recommendation engine is rule-based today