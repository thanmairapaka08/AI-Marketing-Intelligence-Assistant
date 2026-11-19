import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_auth_cookie():
    """Register and login a test user, return the session cookie."""
    email = f"test_audit_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Test User"},
    )
    cookie = reg_res.cookies.get("access_token")
    if not cookie:
        raise Exception("No cookie in registration response: " + str(reg_res.json()))
    return cookie, email


def test_ssrf_rejection():
    cookie, _ = get_auth_cookie()
    # Localhost and loopback must be rejected
    res = client.post("/api/v1/audits", json={"url": "http://127.0.0.1/admin"}, cookies={"access_token": cookie})
    assert res.status_code == 400
    assert "private" in res.json()["detail"].lower() or "prohibited" in res.json()["detail"].lower()


def test_create_and_inspect_audit():
    cookie, _ = get_auth_cookie()
    res = client.post("/api/v1/audits", json={"url": "https://example.com"}, cookies={"access_token": cookie})
    assert res.status_code == 201
    audit_id = res.json()["audit_id"]

    # 1. Audit detail
    detail_res = client.get(f"/api/v1/audits/{audit_id}", cookies={"access_token": cookie})
    assert detail_res.status_code == 200
    data = detail_res.json()
    assert data["overall_score"] is not None
    assert 0 <= data["overall_score"] <= 100

    # 2. Status
    status_res = client.get(f"/api/v1/audits/{audit_id}/status", cookies={"access_token": cookie})
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "completed"

    # 3. 5-Weighted Metrics Verification
    metrics_res = client.get(f"/api/v1/audits/{audit_id}/metrics", cookies={"access_token": cookie})
    assert metrics_res.status_code == 200
    m = metrics_res.json()
    assert "title_meta" in m
    assert "broken_links" in m
    assert "image_alt" in m
    assert "headings" in m
    assert "canonical" in m

    # Verify mathematical weighted sum
    w_calc = round(
        m["title_meta"]["score"] * 0.25
        + m["broken_links"]["score"] * 0.25
        + m["image_alt"]["score"] * 0.15
        + m["headings"]["score"] * 0.20
        + m["canonical"]["score"] * 0.15
    )
    assert m["overall_score"] == w_calc

    # 4. Pages
    pages_res = client.get(f"/api/v1/audits/{audit_id}/pages", cookies={"access_token": cookie})
    assert pages_res.status_code == 200
    assert len(pages_res.json()) >= 1

    # 5. Recommendations
    rec_res = client.get(f"/api/v1/audits/{audit_id}/recommendations", cookies={"access_token": cookie})
    assert rec_res.status_code == 200

    # 6. Report exports
    pdf_res = client.get(f"/api/v1/audits/{audit_id}/export/pdf", cookies={"access_token": cookie})
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert pdf_res.content.startswith(b"%PDF")

    csv_res = client.get(f"/api/v1/audits/{audit_id}/export/csv", cookies={"access_token": cookie})
    assert csv_res.status_code == 200
    assert "text/csv" in csv_res.headers["content-type"]

    json_res = client.get(f"/api/v1/audits/{audit_id}/export/json", cookies={"access_token": cookie})
    assert json_res.status_code == 200
    assert "application/json" in json_res.headers["content-type"]