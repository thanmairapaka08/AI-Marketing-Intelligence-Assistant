# AI Marketing Intelligence Assistant

One repository for the full product: a React + TypeScript + Vite frontend and a
FastAPI backend. The backend lives in `backend/` so the frontend and backend
ship together from a single clone.

The app helps marketers audit a website's technical SEO, track scores over time,
benchmark against competitors, and act on prioritised AI recommendations.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4, TanStack Router, TanStack Query
- FastAPI + Uvicorn backend (Python 3.11+)
- Vitest for frontend tests, pytest for backend tests

## Repository layout

```
.
├── backend/                 # FastAPI app (see backend/README.md)
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── src/                     # Frontend source
│   ├── routes/              # TanStack file-based routes
│   ├── services/            # Axios client + per-domain service modules
│   ├── features/            # auth, dashboard, audits, recommendations, landing
│   ├── components/          # layout, common, charts, shadcn ui
│   └── test/                # vitest setup + routing test
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

## Project Setup

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+ (backend)

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd backend
python -m pip install -r requirements.txt
```

### 3. Configure environment

Create `backend/.env` from `backend/.env.example` and, if you deviate from the
defaults, set the frontend env in the repository root:

```env
# root .env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

`VITE_API_BASE_URL` points the frontend at the backend. The frontend also reads
`VITE_API_ROOT_URL` for `/health`, `/ready` and `/openapi.json`; it defaults to
the API base URL with the `/api/v1` suffix stripped.

### 4. Start the backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

- API docs: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

### 5. Start the frontend

```bash
npm run dev
```

The dev server prints its own URL (default `http://localhost:5173`). The backend
CORS allow-list covers the common localhost ports; add your own via
`FRONTEND_URL` in `backend/.env`.

## Testing

Frontend tests:

```bash
npm run test
```

Backend tests:

```bash
cd backend
python -m pytest -q
```

Production build:

```bash
npm run build
```

## Backend Integration

The frontend talks to the FastAPI API over `/api/v1` with HttpOnly session
cookies (`withCredentials`). On a 401 it attempts one refresh then retries the
original request once. Every error is normalised to an `ApiError` with a `kind`
(`network`, `timeout`, `unauthorized`, `forbidden`, `not_found`, `unavailable`,
`validation`, `server`, `unknown`) so the UI can explain what happened instead
of showing zeros.

## Project Status

Frontend pages and automated tests are implemented. The backend audit, auth,
dashboard, competitor and recommendation endpoints are implemented and covered
by a 9-test pytest suite. End-to-end integration was verified against a running
backend on 2026-11-19 — see RESULTS.md.

## Purpose

Developed as part of a technical assessment to demonstrate full-stack product
development: modern frontend architecture, REST API integration, SEO analytics
visualisation, and AI-assisted website optimisation.