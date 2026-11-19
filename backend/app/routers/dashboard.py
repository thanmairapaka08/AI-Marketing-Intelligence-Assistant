from __future__ import annotations

from fastapi import APIRouter, Cookie, Depends, HTTPException
from app.schemas import DashboardSummary
from app.services.storage import get_store

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


async def get_current_user_id(access_token: str | None = Cookie(None)) -> str:
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    store = get_store()
    user = store.get_user_by_token(access_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    return user.id


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(user_id: str = Depends(get_current_user_id)):
    store = get_store()
    return store.get_dashboard_summary(user_id)