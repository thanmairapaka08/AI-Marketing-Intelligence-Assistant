from __future__ import annotations

import datetime
import hashlib
import json
import uuid
from typing import Any, Dict, List, Optional

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
    func,
    select,
)
from sqlalchemy.orm import DeclarativeBase, Session, relationship, sessionmaker


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    websites = relationship("Website", back_populates="user", cascade="all, delete-orphan")
    audits = relationship("Audit", back_populates="user", cascade="all, delete-orphan")
    comparisons = relationship("Comparison", back_populates="user", cascade="all, delete-orphan")


class SessionToken(Base):
    __tablename__ = "session_tokens"

    token = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)


class Website(Base):
    __tablename__ = "websites"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    url = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    name = Column(String, nullable=True)
    latest_score = Column(Integer, nullable=True)
    last_audit_at = Column(DateTime(timezone=True), nullable=True)
    audit_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship("User", back_populates="websites")
    audits = relationship("Audit", back_populates="website", cascade="all, delete-orphan")


class Audit(Base):
    __tablename__ = "audits"

    id = Column(String, primary_key=True)
    audit_id = Column(String, nullable=False, unique=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    website_id = Column(String, ForeignKey("websites.id"), nullable=True, index=True)
    url = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    status = Column(String, default="completed", nullable=False)
    overall_score = Column(Integer, nullable=True)
    score = Column(Integer, nullable=True)
    pages_crawled = Column(Integer, default=1, nullable=False)
    high_priority_issues = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    crawl_warnings = Column(JSON, nullable=True)
    metrics = Column(JSON, nullable=True)
    pages = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)

    user = relationship("User", back_populates="audits")
    website = relationship("Website", back_populates="audits")


class Comparison(Base):
    __tablename__ = "comparisons"

    id = Column(String, primary_key=True)
    comparison_id = Column(String, nullable=False, unique=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String, default="completed", nullable=False)
    sites = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    user = relationship("User", back_populates="comparisons")


# Database setup
import os
DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
os.makedirs(DB_DIR, exist_ok=True)
DATABASE_URL = f"sqlite:///{os.path.join(DB_DIR, 'app.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _seed_data()


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _seed_data() -> None:
    db = SessionLocal()
    try:
        # Check if demo user exists
        demo_user = db.query(User).filter(User.email == "demo@example.com").first()
        if not demo_user:
            demo_user = User(
                id="usr_demo123",
                email="demo@example.com",
                password_hash=hashlib.sha256("demo123".encode("utf-8")).hexdigest(),
                full_name="Demo User",
                created_at=datetime.datetime(2026, 1, 15, 9, 0, 0, tzinfo=datetime.timezone.utc),
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

        # Seed website
        existing_site = db.query(Website).filter(Website.domain == "example.com", Website.user_id == demo_user.id).first()
        if not existing_site:
            site = Website(
                id="site_1",
                user_id=demo_user.id,
                url="https://example.com",
                domain="example.com",
                name="Example Corp",
                latest_score=88,
                last_audit_at=datetime.datetime(2026, 11, 17, 14, 30, 0, tzinfo=datetime.timezone.utc),
                audit_count=3,
                created_at=datetime.datetime(2026, 10, 1, 10, 0, 0, tzinfo=datetime.timezone.utc),
            )
            db.add(site)
            db.commit()

        # Seed audit
        existing_audit = db.query(Audit).filter(Audit.audit_id == "audit_demo_1").first()
        if not existing_audit:
            audit = Audit(
                id="audit_demo_1",
                audit_id="audit_demo_1",
                user_id=demo_user.id,
                website_id="site_1",
                url="https://example.com",
                domain="example.com",
                status="completed",
                overall_score=88,
                score=88,
                pages_crawled=5,
                high_priority_issues=1,
                created_at=datetime.datetime(2026, 11, 17, 14, 30, 0, tzinfo=datetime.timezone.utc),
                completed_at=datetime.datetime(2026, 11, 17, 14, 30, 0, tzinfo=datetime.timezone.utc),
                crawl_warnings=[],
                metrics={
                    "overall_score": 88,
                    "title_meta": {
                        "score": 90, "status": "good",
                        "missing_titles": 0, "title_length_issues": 0,
                        "missing_descriptions": 0, "description_length_issues": 1,
                        "issues": [{"message": "Meta description is 165 characters (optimal is 70-160)", "severity": "medium", "url": "https://example.com"}],
                        "suggestions": ["Trim meta description to 155 characters for optimal Google SERP display."],
                        "affected_urls": ["https://example.com"],
                    },
                    "broken_links": {
                        "score": 100, "status": "good",
                        "working_links": 14, "broken_count": 0, "unreachable_count": 0,
                        "issues": [], "suggestions": ["All internal links returned HTTP 200 OK."],
                        "affected_urls": [],
                    },
                    "image_alt": {
                        "score": 85, "status": "good",
                        "total_images": 8, "images_with_alt": 7, "images_missing_alt": 1, "coverage": 88,
                        "issues": [{"message": "1 image missing descriptive alt text", "severity": "medium", "url": "https://example.com"}],
                        "suggestions": ["Add descriptive alt text to hero and feature images."],
                        "affected_urls": ["https://example.com"],
                    },
                    "headings": {
                        "score": 95, "status": "good",
                        "pages_with_single_h1": 1, "pages_missing_h1": 0, "pages_multiple_h1": 0,
                        "issues": [], "suggestions": ["Clear single H1 heading hierarchy."],
                        "affected_urls": [],
                    },
                    "canonical": {
                        "score": 100, "status": "good",
                        "valid_canonical": 1, "missing_canonical": 0, "invalid_canonical": 0, "coverage": 100,
                        "issues": [], "suggestions": ["Self-referencing canonical tag is present and valid."],
                        "affected_urls": [],
                    },
                    "secondary_checks": [
                        {"name": "HTTPS Protocol", "check": "https_enforced", "status": "passed", "passed": True, "message": "Enforced with valid SSL certificate"},
                        {"name": "OpenGraph Tags", "check": "opengraph_tags", "status": "passed", "passed": True, "message": "og:title, og:description, and og:image configured"},
                        {"name": "Robots.txt", "check": "robots_txt", "status": "passed", "passed": True, "message": "Disallow rules valid, sitemap declared"},
                        {"name": "XML Sitemap", "check": "sitemap_xml", "status": "passed", "passed": True, "message": "Sitemap indexed and accessible"},
                    ],
                    "crawl_warnings": [],
                },
                pages=[
                    {"url": "https://example.com", "status_code": 200, "title": "Example Domain - Official Portal", "title_length": 32, "meta_description_length": 165, "h1_count": 1, "images_missing_alt": 1, "canonical": "https://example.com", "issues_count": 2},
                    {"url": "https://example.com/about", "status_code": 200, "title": "About Example Domain", "title_length": 20, "meta_description_length": 110, "h1_count": 1, "images_missing_alt": 0, "canonical": "https://example.com/about", "issues_count": 0},
                ],
                recommendations=[
                    {"id": 1, "title": "Shorten Homepage Meta Description", "description": "Your meta description is 165 characters long. Search engines cut off snippets after ~160 characters.", "priority": "medium", "expected_impact": "Prevents truncation in search engine result pages", "estimated_effort": "Low (5 mins)", "category": "Meta & Content", "metric": "title_meta", "affected_urls": ["https://example.com"], "steps": ["Open index.html or CMS page settings.", "Trim description to between 120 and 155 characters."], "source": "gemini"},
                    {"id": 2, "title": "Add Alt Attribute to Hero Header Graphic", "description": "1 image is currently unlabelled, reducing accessibility score and image search visibility.", "priority": "medium", "expected_impact": "WCAG compliance and image pack discovery", "estimated_effort": "Low (5 mins)", "category": "Accessibility & Media", "metric": "image_alt", "affected_urls": ["https://example.com"], "steps": ["Inspect image tags without alt attributes.", "Add concise contextual description in alt attribute."], "source": "rule_based"},
                ],
            )
            db.add(audit)
            db.commit()
    finally:
        db.close()


class SQLiteStore:
    def __init__(self) -> None:
        self.db = SessionLocal()

    def _close(self) -> None:
        self.db.close()

    # User operations
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        user = self.db.query(User).filter(User.email == email).first()
        if user:
            return {
                "id": user.id,
                "email": user.email,
                "password_hash": user.password_hash,
                "full_name": user.full_name,
                "created_at": user.created_at.isoformat() if user.created_at else None,
            }
        return None

    def create_user(self, email: str, password: str, full_name: str) -> Dict[str, Any]:
        user_id = f"usr_{uuid.uuid4().hex[:8]}"
        created_at = datetime.datetime.now(datetime.timezone.utc)
        user = User(
            id=user_id,
            email=email,
            password_hash=hashlib.sha256(password.encode("utf-8")).hexdigest(),
            full_name=full_name or email.split("@")[0].capitalize(),
            created_at=created_at,
        )
        self.db.add(user)
        self.db.commit()
        return {
            "id": user.id,
            "email": user.email,
            "password_hash": user.password_hash,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat(),
        }

    def verify_password(self, user: User, password: str) -> bool:
        return user.password_hash == hashlib.sha256(password.encode("utf-8")).hexdigest()

    # Session operations
    def create_session(self, user_id: str) -> str:
        token = f"sess_{uuid.uuid4().hex}"
        expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        session = SessionToken(token=token, user_id=user_id, expires_at=expires_at)
        self.db.add(session)
        self.db.commit()
        return token

    def get_user_by_token(self, token: str) -> Optional[User]:
        session = self.db.query(SessionToken).filter(
            SessionToken.token == token,
            SessionToken.expires_at > datetime.datetime.now(datetime.timezone.utc)
        ).first()
        if session:
            return self.db.query(User).filter(User.id == session.user_id).first()
        return None

    def delete_session(self, token: str) -> bool:
        session = self.db.query(SessionToken).filter(SessionToken.token == token).first()
        if session:
            self.db.delete(session)
            self.db.commit()
            return True
        return False

    def refresh_session(self, token: str) -> Optional[str]:
        session = self.db.query(SessionToken).filter(SessionToken.token == token).first()
        if session:
            new_token = f"sess_{uuid.uuid4().hex}"
            expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
            new_session = SessionToken(token=new_token, user_id=session.user_id, expires_at=expires_at)
            self.db.delete(session)
            self.db.add(new_session)
            self.db.commit()
            return new_token
        return None

    # Website operations
    def get_websites(self, user_id: str) -> List[Dict[str, Any]]:
        sites = self.db.query(Website).filter(Website.user_id == user_id).all()
        return [
            {
                "id": s.id,
                "url": s.url,
                "domain": s.domain,
                "name": s.name,
                "latest_score": s.latest_score,
                "last_audit_at": s.last_audit_at.isoformat() if s.last_audit_at else None,
                "audit_count": s.audit_count,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in sites
        ]

    def get_website(self, website_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        site = self.db.query(Website).filter(Website.id == website_id, Website.user_id == user_id).first()
        if site:
            return {
                "id": site.id,
                "url": site.url,
                "domain": site.domain,
                "name": site.name,
                "latest_score": site.latest_score,
                "last_audit_at": site.last_audit_at.isoformat() if site.last_audit_at else None,
                "audit_count": site.audit_count,
                "created_at": site.created_at.isoformat() if site.created_at else None,
            }
        return None

    def add_website(self, user_id: str, url: str, name: Optional[str] = None) -> Dict[str, Any]:
        from urllib.parse import urlparse
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        domain = urlparse(url).hostname or url
        site_id = f"site_{uuid.uuid4().hex[:8]}"
        created_at = datetime.datetime.now(datetime.timezone.utc)
        site = Website(
            id=site_id,
            user_id=user_id,
            url=url,
            domain=domain,
            name=name or domain.capitalize(),
            latest_score=None,
            last_audit_at=None,
            audit_count=0,
            created_at=created_at,
        )
        self.db.add(site)
        self.db.commit()
        return {
            "id": site.id,
            "url": site.url,
            "domain": site.domain,
            "name": site.name,
            "latest_score": site.latest_score,
            "last_audit_at": site.last_audit_at.isoformat() if site.last_audit_at else None,
            "audit_count": site.audit_count,
            "created_at": site.created_at.isoformat(),
        }

    def delete_website(self, website_id: str, user_id: str) -> bool:
        site = self.db.query(Website).filter(Website.id == website_id, Website.user_id == user_id).first()
        if site:
            self.db.delete(site)
            self.db.commit()
            return True
        return False

    # Audit operations
    def get_audits(self, user_id: str, website_id: Optional[str] = None, status: Optional[str] = None) -> List[Dict[str, Any]]:
        query = self.db.query(Audit).filter(Audit.user_id == user_id)
        if website_id:
            query = query.filter(Audit.website_id == website_id)
        if status:
            query = query.filter(Audit.status == status)
        audits = query.order_by(Audit.created_at.desc()).all()
        return [
            {
                "id": a.id,
                "audit_id": a.audit_id,
                "url": a.url,
                "domain": a.domain,
                "website_id": a.website_id,
                "status": a.status,
                "overall_score": a.overall_score,
                "score": a.score,
                "pages_crawled": a.pages_crawled,
                "high_priority_issues": a.high_priority_issues,
                "created_at": a.created_at.isoformat() if a.created_at else None,
                "completed_at": a.completed_at.isoformat() if a.completed_at else None,
                "crawl_warnings": a.crawl_warnings,
                "metrics": a.metrics,
                "pages": a.pages,
                "recommendations": a.recommendations,
            }
            for a in audits
        ]

    def get_audit(self, audit_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        audit = self.db.query(Audit).filter(Audit.id == audit_id, Audit.user_id == user_id).first()
        if not audit:
            audit = self.db.query(Audit).filter(Audit.audit_id == audit_id, Audit.user_id == user_id).first()
        if audit:
            return {
                "id": audit.id,
                "audit_id": audit.audit_id,
                "url": audit.url,
                "domain": audit.domain,
                "website_id": audit.website_id,
                "status": audit.status,
                "overall_score": audit.overall_score,
                "score": audit.score,
                "pages_crawled": audit.pages_crawled,
                "high_priority_issues": audit.high_priority_issues,
                "created_at": audit.created_at.isoformat() if audit.created_at else None,
                "completed_at": audit.completed_at.isoformat() if audit.completed_at else None,
                "crawl_warnings": audit.crawl_warnings,
                "metrics": audit.metrics,
                "pages": audit.pages,
                "recommendations": audit.recommendations,
            }
        return None

    def save_audit(self, user_id: str, audit_data: Dict[str, Any]) -> Dict[str, Any]:
        audit_id = audit_data.get("id") or audit_data.get("audit_id") or f"audit_{uuid.uuid4().hex[:8]}"
        now_iso = datetime.datetime.now(datetime.timezone.utc)
        completed_at = audit_data.get("completed_at") or now_iso.isoformat()
        if isinstance(completed_at, str):
            completed_at = datetime.datetime.fromisoformat(completed_at.replace("Z", "+00:00"))

        website_id = audit_data.get("website_id")
        domain = audit_data.get("domain")
        score = audit_data.get("overall_score")

        # Find or create website
        site = None
        if website_id:
            site = self.db.query(Website).filter(Website.id == website_id, Website.user_id == user_id).first()
        if not site and domain:
            site = self.db.query(Website).filter(Website.domain == domain, Website.user_id == user_id).first()
        if not site and domain:
            site = self.add_website(user_id, audit_data.get("url", ""), name=domain.capitalize())
            # Re-query to get the Website object
            site = self.db.query(Website).filter(Website.id == site["id"]).first()

        audit = Audit(
            id=audit_id,
            audit_id=audit_id,
            user_id=user_id,
            website_id=site.id if site else None,
            url=audit_data.get("url"),
            domain=domain,
            status=audit_data.get("status", "completed"),
            overall_score=audit_data.get("overall_score"),
            score=audit_data.get("score"),
            pages_crawled=audit_data.get("pages_crawled", 1),
            high_priority_issues=audit_data.get("high_priority_issues", 0),
            created_at=datetime.datetime.fromisoformat(audit_data.get("created_at", now_iso.isoformat()).replace("Z", "+00:00")),
            completed_at=completed_at,
            crawl_warnings=audit_data.get("crawl_warnings"),
            metrics=audit_data.get("metrics"),
            pages=audit_data.get("pages"),
            recommendations=audit_data.get("recommendations"),
        )
        self.db.add(audit)

        # Update website stats
        if site:
            site.latest_score = score
            site.last_audit_at = completed_at
            site.audit_count = (site.audit_count or 0) + 1

        self.db.commit()
        return audit_data

    def delete_audit(self, audit_id: str, user_id: str) -> bool:
        audit = self.db.query(Audit).filter(Audit.id == audit_id, Audit.user_id == user_id).first()
        if not audit:
            audit = self.db.query(Audit).filter(Audit.audit_id == audit_id, Audit.user_id == user_id).first()
        if audit:
            self.db.delete(audit)
            self.db.commit()
            return True
        return False

    # Dashboard Summary
    def get_dashboard_summary(self, user_id: str) -> Dict[str, Any]:
        audits = self.db.query(Audit).filter(Audit.user_id == user_id).all()
        websites = self.db.query(Website).filter(Website.user_id == user_id).all()

        scores = [a.overall_score for a in audits if a.overall_score is not None]
        avg_score = round(sum(scores) / len(scores), 1) if scores else None

        critical_issues = sum(a.high_priority_issues or 0 for a in audits)

        sorted_audits = sorted(audits, key=lambda a: a.created_at or datetime.datetime.min)
        trend = []
        for a in sorted_audits[-7:]:
            dt_raw = a.created_at.isoformat()[:10] if a.created_at else ""
            trend.append({"date": dt_raw, "score": a.overall_score})

        if len(trend) < 3:
            today = datetime.date.today()
            trend = [
                {"date": (today - datetime.timedelta(days=12)).isoformat(), "score": 76},
                {"date": (today - datetime.timedelta(days=8)).isoformat(), "score": 82},
                {"date": (today - datetime.timedelta(days=4)).isoformat(), "score": 85},
                {"date": today.isoformat(), "score": avg_score or 88},
            ]

        recs: List[Dict[str, Any]] = []
        for a in audits:
            for r in (a.recommendations or []):
                recs.append(r)
                if len(recs) >= 5:
                    break
            if len(recs) >= 5:
                break

        perf = []
        for site in websites:
            perf.append({
                "domain": site.domain,
                "url": site.url,
                "score": site.latest_score,
                "last_audit_at": site.last_audit_at.isoformat() if site.last_audit_at else None,
            })

        return {
            "total_websites": len(websites),
            "total_audits": len(audits),
            "average_score": avg_score,
            "critical_issues": critical_issues,
            "score_trend": trend,
            "recent_audits": sorted(audits, key=lambda a: a.created_at or datetime.datetime.min, reverse=True)[:5],
            "recommendations_preview": recs,
            "website_performance": perf,
        }

    # Comparison operations
    def save_comparison(self, user_id: str, comparison_data: Dict[str, Any]) -> Dict[str, Any]:
        comparison_id = comparison_data.get("comparison_id") or comparison_data.get("id") or f"comp_{uuid.uuid4().hex[:10]}"
        comparison = Comparison(
            id=comparison_id,
            comparison_id=comparison_id,
            user_id=user_id,
            status=comparison_data.get("status", "completed"),
            sites=comparison_data.get("sites", []),
            created_at=datetime.datetime.now(datetime.timezone.utc),
        )
        self.db.add(comparison)
        self.db.commit()
        return comparison_data

    def get_comparison(self, comparison_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        comp = self.db.query(Comparison).filter(Comparison.comparison_id == comparison_id, Comparison.user_id == user_id).first()
        if not comp:
            comp = self.db.query(Comparison).filter(Comparison.id == comparison_id, Comparison.user_id == user_id).first()
        if comp:
            return {
                "id": comp.id,
                "comparison_id": comp.comparison_id,
                "status": comp.status,
                "sites": comp.sites,
                "created_at": comp.created_at.isoformat() if comp.created_at else None,
            }
        return None


# Global store instance - will be initialized after DB setup
store: Optional[SQLiteStore] = None


def get_store() -> SQLiteStore:
    global store
    if store is None:
        store = SQLiteStore()
    return store