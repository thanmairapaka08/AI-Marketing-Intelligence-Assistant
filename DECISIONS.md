# Technical Decisions

## 1. Frontend Framework
**Decision:** React with TypeScript and Vite.

**Reason:** Supports reusable UI components, type safety, and fast development.

## 2. Backend Framework
**Decision:** FastAPI with Python.

**Reason:** Provides REST API development, request validation, and integration with website analysis logic.

## 3. Database
**Decision:** SQLite.

**Reason:** Lightweight database suitable for local development and assessment demonstrations.

## 4. SEO Analysis
**Decision:** Evaluate five SEO categories.

**Categories:**
- Title and Meta — 25%
- Broken Links — 25%
- Image Alt Text — 15%
- Headings — 20%
- Canonical Tags — 15%

**Reason:** These checks provide a measurable overview of common on-page SEO issues.

## 5. Frontend and Backend Integration
**Decision:** Use REST API communication.

**Reason:** Allows independent frontend and backend development.

## 6. Guest Audit Access
**Decision:** Allow users to create and view public audits without registration.

**Reason:** Simplifies the demonstration and makes website analysis immediately accessible.

**Consideration:** Public endpoints require access controls, rate limiting, and SSRF protection before production deployment.

## 7. Results Dashboard
**Decision:** Display scores using visual indicators and metric cards.

**Reason:** Makes SEO performance easy to understand.

## 8. Development Environment
**Decision:** Use local development servers.

- Frontend: Port 5173
- Backend: Port 8000

**Reason:** Supports rapid development, testing, and debugging.
