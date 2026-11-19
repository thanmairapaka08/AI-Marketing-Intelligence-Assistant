# AI Marketing Intelligence Assistant

**A Full-Stack SEO Auditing and Marketing Intelligence Platform**

AI Marketing Intelligence Assistant is a full-stack web application designed to help marketers, businesses, and website owners analyze technical SEO performance, identify optimization opportunities, monitor website health, and compare competitors.

The application combines a modern React dashboard with a Python FastAPI backend to deliver website audits, weighted SEO scores, actionable recommendations, historical insights, and downloadable reports.

## Key Features

- **Secure Authentication:** User registration, login, logout, and session management using HttpOnly cookies.
- **Interactive Dashboard:** SEO statistics, audit trends, recent activity, and website performance.
- **Website Management:** Add and manage monitored websites.
- **SEO Auditing:** Analyze publicly accessible websites using five weighted SEO metrics.
- **Audit History:** View previous audits and their results.
- **Competitor Analysis:** Compare SEO performance across websites.
- **SEO Recommendations:** Receive prioritized, rule-based improvement suggestions.
- **Report Generation:** Download audit results in PDF, CSV, and JSON formats.
- **User Settings:** Manage profile information and interface preferences.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4, shadcn/ui |
| Routing | TanStack Router |
| State Management | TanStack Query |
| Backend | Python, FastAPI, Uvicorn |
| Database | SQLite, SQLAlchemy 2.0 |
| Authentication | HttpOnly session cookies |
| SEO Analysis | Python HTMLParser, custom crawler |
| Testing | Pytest, Vitest |
| Version Control | Git, GitHub |

## System Architecture

```text
                     USER
                      |
                      v
              React Frontend
           (TypeScript + Vite)
                      |
                      v
              REST API Requests
                      |
                      v
               FastAPI Backend
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
     Authentication  SEO Audit   Reports
          |           |           |
          +-----------+-----------+
                      |
                      v
                SQLite Database
```

The React frontend communicates with FastAPI through REST endpoints. The backend manages authentication, website analysis, SEO scoring, recommendations, and report generation. SQLite provides persistent storage for application records.

## SEO Audit Methodology

The application evaluates five technical SEO metrics using a weighted scoring system.

| SEO Metric | Weight | Analysis |
|---|---:|---|
| Title and Meta Description | 25% | Presence and recommended length |
| Broken Internal Links | 25% | HTTP errors and inaccessible internal links |
| Image Alt Text | 15% | Alternative text coverage |
| Heading Structure | 20% | H1 presence and heading hierarchy |
| Canonical Tags | 15% | Canonical URL presence and consistency |
| **Total** | **100%** | **Weighted SEO Score** |

The audit engine evaluates accessible HTML content and produces a score based on the configured metric rules.

Broken-link findings should include the affected URL, source page, and HTTP status where available. Network failures and timeouts are tracked separately from confirmed HTTP errors.

## Project Structure

```text
AI-Marketing-Intelligence-Assistant-Frontend/
|
|-- backend/
|   |-- app/
|   |   |-- main.py
|   |   |-- routers/
|   |   |-- services/
|   |   |-- schemas.py
|   |-- tests/
|   |-- requirements.txt
|   |-- .env.example
|
|-- src/
|   |-- routes/
|   |-- features/
|   |-- services/
|   |-- components/
|   |-- hooks/
|   |-- test/
|
|-- public/
|-- package.json
|-- vite.config.ts
|-- README.md
|-- RESULTS.md
|-- DECISIONS.md
|-- AI_USAGE.md
```

## Installation and Setup

### Prerequisites

- Node.js 20+
- Python 3.11+ (Python 3.13 used during local development)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/thanmairapaka08/AI-Marketing-Intelligence-Assistant-Frontend.git
cd AI-Marketing-Intelligence-Assistant-Frontend
```

### 2. Start the Backend

Open Terminal 1 in the project directory.

```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Backend URL: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

Health Endpoint: http://127.0.0.1:8000/health

### 3. Start the Frontend

Open Terminal 2 in the project root directory.

```bash
npm install
npm run dev
```

Frontend URL: http://localhost:8080

Use the actual URL displayed by Vite if a different port is assigned.

### 4. Environment Configuration

Create `backend/.env` using `backend/.env.example` as the reference.

Example frontend environment configuration:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

The backend must allow the frontend origin through its CORS configuration.

Never commit actual credentials or API keys.

## Running Automated Tests

### Backend Tests

From the `backend/` directory:

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

### Frontend Tests

From the project root:

```bash
npm run test
```

### Production Build

```bash
npm run build
```

## Verification Results

The following results were reported during development:

| Verification | Result |
|---|---|
| Backend automated tests | 9 passed |
| Frontend automated tests | 1 passed |
| Frontend production build | Successful |
| GitHub push | Reported successful |

These results represent the recorded development verification. See `RESULTS.md` for website-specific SEO findings.

## Application Workflow

1. Register a new account or log in.
2. Open the dashboard.
3. Enter a publicly accessible website URL.
4. Start a new SEO audit.
5. Review the overall SEO score and metric-level findings.
6. Examine recommendations and identified issues.
7. Access previous audits through Audit History.
8. Compare website performance with competitors.
9. Download available reports.

## Design Decisions

The application uses a single-repository architecture for simplified development and evaluation.

The initial development process prioritized functional frontend-backend integration, measurable SEO analysis, and automated testing.

For architectural assumptions, implementation tradeoffs, and future improvements, see `DECISIONS.md`.

## Limitations and Future Improvements

- Extend the crawler to support configurable multi-page website analysis.
- Improve broken-link detection across larger websites.
- Integrate an external LLM for contextual recommendations.
- Expand automated browser-based end-to-end testing.
- Add scheduled audits, alerts, and advanced performance analytics.
- Strengthen production authentication and deployment security.

## Assessment Deliverables

This repository contains the required submission materials:

| File | Purpose |
|---|---|
| `README.md` | Project overview, architecture, setup, and testing |
| `RESULTS.md` | Selected website and actual SEO analysis results |
| `DECISIONS.md` | Assumptions, ambiguities, and architectural decisions |
| `AI_USAGE.md` | AI assistance disclosure, mistakes, verification, and improvements |

## AI Assistance

Development was assisted by Lovable, Google Antigravity, Claude Code, and ChatGPT.

AI-generated code and suggestions were reviewed through manual inspection, debugging, and automated testing. Specific examples are documented in `AI_USAGE.md`.

## Repository

**GitHub:** https://github.com/thanmairapaka08/AI-Marketing-Intelligence-Assistant-Frontend

## Conclusion

AI Marketing Intelligence Assistant demonstrates full-stack application development, REST API integration, technical SEO analysis, user authentication, database management, automated testing, and AI-assisted engineering.

The project provides a foundation for a more comprehensive marketing intelligence platform with advanced crawling, intelligent recommendations, and continuous SEO monitoring.
