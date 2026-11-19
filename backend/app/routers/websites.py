from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Cookie, Depends, HTTPException, status

from app.schemas import AuditSummary, WebsiteCreate, WebsiteOut
from app.services.storage import get_store

router = APIRouter(prefix="/websites", tags=["Websites"])


async def get_current_user_id(access_token: str | None = Cookie(None)) -> str:
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    store = get_store()
    user = store.get_user_by_token(access_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    return user.id


@router.get("", response_model=List[WebsiteOut])
async def list_websites(user_id: str = Depends(get_current_user_id)):
    store = get_store()
    return store.get_websites(user_id)


@router.post("", response_model=WebsiteOut, status_code=status.HTTP_201_CREATED)
async def create_website(payload: WebsiteCreate, user_id: str = Depends(get_current_user_id)):
    if not payload.url or not payload.url.strip():
        raise HTTPException(status_code=400, detail="Website URL is required.")
    store = get_store()
    return store.add_website(user_id, payload.url.strip(), name=payload.name)


@router.get("/{website_id}", response_model=WebsiteOut)
async def get_website(website_id: str, user_id: str = Depends(get_current_user_id)):
    store = get_store()
    site = store.get_website(website_id, user_id)
    if not site:
        raise HTTPException(status_code=404, detail="Website not found.")
    return site


@router.delete("/{website_id}", status_code=status.HTTP_200_OK)
async def delete_website(website_id: str, user_id: str = Depends(get_current_user_id)):
    store = get_store()
    success = store.delete_website(website_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Website not found.")
    return {"status": "deleted", "id": website_id}


@router.get("/{website_id}/audits", response_model=List[AuditSummary])
async def get_website_audits(website_id: str, user_id: str = Depends(get_current_user_id)):
    store = get_store()
    site = store.get_website(website_id, user_id)
    if not site:
        raise HTTPException(status_code=404, detail="Website not found.")
    return store.get_audits(user_id, website_id=website_id)