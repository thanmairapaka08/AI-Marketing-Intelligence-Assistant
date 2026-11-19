import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_auth_cookie():
    """Register and login a test user, return the session cookie."""
    email = f"test_web_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Test User"},
    )
    cookie = reg_res.cookies.get("access_token")
    if not cookie:
        raise Exception("No cookie in registration response: " + str(reg_res.json()))
    return cookie, email


def test_list_and_create_website():
    cookie, _ = get_auth_cookie()
    list_res = client.get("/api/v1/websites", cookies={"access_token": cookie})
    assert list_res.status_code == 200
    initial_count = len(list_res.json())

    create_res = client.post(
        "/api/v1/websites",
        json={"url": "https://newwebsite.org", "name": "New Website"},
        cookies={"access_token": cookie},
    )
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["domain"] == "newwebsite.org"

    get_res = client.get(f"/api/v1/websites/{created['id']}", cookies={"access_token": cookie})
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "New Website"