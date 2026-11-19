import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_auth_cookie():
    """Register and login a test user, return the session cookie."""
    email = f"test_comp_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Test User"},
    )
    cookie = reg_res.cookies.get("access_token")
    if not cookie:
        raise Exception("No cookie in registration response: " + str(reg_res.json()))
    return cookie, email


def test_compare_competitors():
    cookie, _ = get_auth_cookie()

    # Create a website first
    website_res = client.post(
        "/api/v1/websites",
        json={"url": "https://example.com", "name": "Example"},
        cookies={"access_token": cookie},
    )
    assert website_res.status_code == 201
    website_id = website_res.json()["id"]

    res = client.post(
        "/api/v1/competitors/compare",
        json={
            "website_id": website_id,
            "competitor_urls": ["https://competitor-alpha.com"],
        },
        cookies={"access_token": cookie},
    )
    assert res.status_code == 200
    data = res.json()
    assert "sites" in data
    assert len(data["sites"]) >= 2
    comp_id = data["comparison_id"]

    get_res = client.get(f"/api/v1/competitors/comparisons/{comp_id}", cookies={"access_token": cookie})
    assert get_res.status_code == 200