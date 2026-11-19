from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import ai, audits, auth, competitors, dashboard, websites

app = FastAPI(
    title="AI Marketing Intelligence Assistant API",
    description="Backend API for website SEO audits and AI recommendations.",
    version="0.1.0",
)

# Development origins the frontend may be served from. FRONTEND_URL from the
# environment (see backend/.env.example) can add extra origins at deploy time.
_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

_extra_origin = os.environ.get("FRONTEND_URL", "").strip()
if _extra_origin:
    for _origin in [o.strip() for o in _extra_origin.split(",") if o.strip()]:
        if _origin not in _ALLOWED_ORIGINS:
            _ALLOWED_ORIGINS.append(_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
)

# Root System Health Endpoints
@app.get("/health", tags=["System"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "AI Marketing Intelligence Assistant"}


@app.get("/ready", tags=["System"])
def readiness_check() -> dict[str, str]:
    return {"status": "ok"}


# API v1 Endpoints
app.include_router(auth.router, prefix="/api/v1")
app.include_router(websites.router, prefix="/api/v1")
app.include_router(audits.router, prefix="/api/v1")
app.include_router(competitors.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")
