# AGENTS.md — AI Marketing Intelligence Assistant

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting published Git history. Do not force-push, rebase, amend, or squash commits that have already been pushed.
>
> Commits pushed to the connected branch sync back to Lovable. Keep the branch in a working state.

## What Lovable Manages

- **Database:** Do not manually modify `supabase/migrations/` or `drizzle/`. Make schema changes through Lovable.
- **Generated files:** Do not edit automatically generated files.
- **AI gateway:** Use Lovable's gateway for Lovable-managed model calls. Never expose `LOVABLE_API_KEY` in frontend code.
- **Connectors:** Use Lovable's native connectors when available. Manage connector credentials securely.
- **Secrets:** Never commit API keys, passwords, or secret values.
<!-- LOVABLE:END -->

## Project Overview

AI Marketing Intelligence Assistant is a full-stack application for analyzing website SEO performance, identifying issues, calculating scores, and generating recommendations.

## Technology Stack

- Frontend: React, TypeScript, Vite
- Backend: Python, FastAPI
- Database: SQLite for the standalone FastAPI backend
- Testing: Pytest and frontend tests

## Development Guidelines

1. Preserve the existing UI design and working functionality.
2. Use real backend data instead of hardcoded demo values.
3. Display the authenticated user's actual name.
4. Implement functional SEO audits using real website data.
5. Evaluate titles, meta descriptions, headings, image alt text, and internal links.
6. Report broken internal links with their source pages and HTTP status codes.
7. Generate actionable recommendations from actual audit findings.
8. Handle errors, loading states, and unavailable services correctly.
9. Never fabricate audit results, test outcomes, or AI responses.
10. Prioritize correctness, security, and maintainable code.

## Required Deliverables

Maintain the following files:

- `README.md` — Setup, execution, testing, and architecture.
- `RESULTS.md` — Selected website, reason for selection, and actual SEO findings.
- `DECISIONS.md` — Assumptions, ambiguities, resolutions, and three decisions to revisit. Maximum one page.
- `AI_USAGE.md` — AI tools used, two genuine AI mistakes, independent verification, and future improvements. Maximum one page.

## Testing and Verification

Before submitting:

1. Run backend automated tests.
2. Run frontend tests and production build.
3. Verify registration and login.
4. Verify website auditing and report generation.
5. Confirm that audit results come from actual analysis.
6. Verify broken-link detection where supported.
7. Check that documentation matches the implemented functionality.

## GitHub Rules

- Preserve published commit history.
- Use normal commits and pushes.
- Never commit `.env`, `.venv`, database credentials, or API keys.
- Keep the repository functional after each push.
- Do not claim completion when critical functionality remains unfinished.

## Priority

Complete the assignment's required functionality first. Avoid unnecessary features, excessive refactoring, and unverified changes.
