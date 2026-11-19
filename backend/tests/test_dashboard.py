import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_auth_cookie():
    """Register and login a test user, return the session cookie."""
    email = f"test_dash_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Test User"},
    )
    cookie = reg_res.cookies.get("access_token")
    if not cookie:
        raise Exception("No cookie in registration response: " + str(reg_res.json()))
    return cookie, email


def test_dashboard_summary():
    cookie, _ = get_auth_cookie()
    res = client.get("/api/v1/dashboard/summary", cookies={"access_token": cookie})
    assert res.status_code == 200
    data = res.json()
    assert "total_websites" in data
    assert "total_audits" in data
    assert "average_score" in data
    assert "critical_issues" in data
    assert "score_trend" in data
    assert "recent_audits" in data
    assert "recommendations_preview" in data