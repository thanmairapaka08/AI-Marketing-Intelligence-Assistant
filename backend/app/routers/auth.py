from __future__ import annotations

import datetime
import uuid
from typing import Optional
from fastapi import APIRouter, Cookie, HTTPException, Response, status

from app.schemas import LoginResponse, UserLogin, UserOut, UserRegister
from app.services.storage import get_store, User

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_current_user_from_cookie(access_token: Optional[str] = Cookie(None)) -> Optional[dict]:
    if not access_token:
        return None
    store = get_store()
    user = store.get_user_by_token(access_token)
    if user:
        return {
            "id": user.id,
            "email": user.email,
            "password_hash": user.password_hash,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
    return None


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, response: Response):
    email = payload.email.lower().strip()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address.")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    store = get_store()
    existing_user = store.get_user_by_email(email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    user_record = store.create_user(email, payload.password, payload.full_name or email.split("@")[0].capitalize())

    # Create session cookie
    token = store.create_session(user_record["id"])
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 7,
    )

    return {
        "user": {
            "id": user_record["id"],
            "email": user_record["email"],
            "full_name": user_record["full_name"],
            "name": user_record["full_name"],
            "created_at": user_record["created_at"],
        },
        "message": "User registered successfully",
    }


@router.post("/login", response_model=LoginResponse)
async def login(payload: UserLogin, response: Response):
    email = payload.email.lower().strip()
    store = get_store()
    db_user = store.db.query(User).filter(User.email == email).first()

    if not db_user or not store.verify_password(db_user, payload.password):
        # Allow demo login if using demo credentials
        if email == "demo@example.com" and payload.password in ("demo123", "password", "demo"):
            db_user = store.db.query(User).filter(User.email == "demo@example.com").first()
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = store.create_session(db_user.id)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 7,
    )

    return LoginResponse(
        user=UserOut(
            id=db_user.id,
            email=db_user.email,
            full_name=db_user.full_name,
            name=db_user.full_name,
            created_at=db_user.created_at.isoformat() if db_user.created_at else None,
            session_expires_at=(
                datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
            ).isoformat(),
        ),
        message="Logged in successfully",
    )


@router.post("/refresh")
async def refresh_session(
    response: Response,
    access_token: Optional[str] = Cookie(None),
):
    if not access_token:
        raise HTTPException(status_code=401, detail="Session expired or invalid.")

    store = get_store()
    new_token = store.refresh_session(access_token)
    if not new_token:
        raise HTTPException(status_code=401, detail="Session expired or invalid.")

    response.set_cookie(
        key="access_token",
        value=new_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 7,
    )

    return {"status": "refreshed", "message": "Session renewed."}


@router.post("/logout")
async def logout(
    response: Response,
    access_token: Optional[str] = Cookie(None),
):
    if access_token:
        store = get_store()
        store.delete_session(access_token)

    response.delete_cookie(key="access_token")
    return {"status": "logged_out", "message": "Logged out successfully."}


@router.get("/me")
async def get_me(access_token: Optional[str] = Cookie(None)):
    user = get_current_user_from_cookie(access_token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    return {
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user.get("full_name"),
            "name": user.get("full_name"),
            "created_at": user.get("created_at"),
            "session_expires_at": (
                datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
            ).isoformat(),
        }
    }