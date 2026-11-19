import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_auth_cookie(email: str = None):
    """Register and login a test user, return the session cookie."""
    if email is None:
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Test User"},
    )
    cookie = reg_res.cookies.get("access_token")
    if not cookie:
        raise Exception("No cookie in registration response: " + str(reg_res.json()))
    return cookie, email


def test_auth_me_unauthenticated_or_demo():
    # Without cookie, should get 401
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_auth_register_and_login():
    cookie, email = get_auth_cookie()

    # Test /me with cookie
    me_res = client.get("/api/v1/auth/me", cookies={"access_token": cookie})
    assert me_res.status_code == 200
    assert "user" in me_res.json()

    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "password123"},
    )
    assert login_res.status_code == 200
    assert "access_token" in login_res.cookies or login_res.json()["token_type"] == "bearer"