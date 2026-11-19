# AI Agent Development Guidelines

## Project
AI Marketing Intelligence Assistant

## Objective
Develop and maintain a full-stack application that performs real website SEO audits and displays actionable results.

## Technology Stack
- React and TypeScript
- Vite
- Tailwind CSS
- Python and FastAPI
- SQLite
- REST APIs

## Development Guidelines
1. Maintain separation between frontend and backend.
2. Follow the existing project structure.
3. Use reusable React components.
4. Use TypeScript types for API responses.
5. Validate website URLs before processing.
6. Handle API errors properly.
7. Do not replace real SEO results with mock data.
8. Keep the audit workflow accessible without mandatory registration.
9. Avoid exposing private audit data.
10. Test functionality after making changes.

## Important API Endpoints
- POST `/api/v1/audits` — Create audit
- GET `/api/v1/audits/{id}` — Retrieve audit results

## Main Development Goal
Ensure the complete workflow operates correctly:

Website URL → SEO Analysis → Score Calculation → Recommendations → Results Dashboard

## Security
- Validate and restrict URLs to prevent SSRF.
- Apply rate limits to public audit requests.
- Avoid exposing API keys or credentials.
- Protect private user data.

## Testing
Verify frontend integration, backend API responses, audit persistence, and error handling before deployment.
