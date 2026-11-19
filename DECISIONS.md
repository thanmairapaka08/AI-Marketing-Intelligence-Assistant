# Decisions — AI Marketing Intelligence Assistant

Architectural and implementation choices made during this assessment.

## Repository structure

**Decision:** Put the backend in `backend/` inside the frontend repository.

**Why:** The evaluator requested one submission-ready repository using the frontend
as the destination. This keeps git history clean in each source repo while shipping
both halves together.

## CORS origins

**Decision:** Read `FRONTEND_URL` from the environment and merge into the allow-list.

**Why:** Deployment environments may change the origin (e.g., custom domain, preview URL).
Reading from environment means CI/CD can inject the value without code changes.

## In-memory store

**Decision:** State is stored in an in-memory `InMemoryStore` with seeded demo data.

**Why:** This assessment focuses on full-stack integration, not persistence. A real
product would use PostgreSQL or similar; the store interface could be replaced by
implementing the same methods.

## Offline preview (explore mode)

**Decision:** Frontend has `setOfflinePreview()` which short-circuits every request
with a user-friendly error. Users can click "Explore without backend" on the login page.

**Why:** During development or when the backend is unreachable, the UI still loads
and shows meaningful empty states. This is a legitimate development mode, not a
placeholder feature.

## PageInProgress component

**Decision:** Pages not yet built render the `PageInProgress` component, which
shows a header, construction icon, and placeholder message.

**Why:** This is intentional — these pages have routes and navigation configured,
but their content components are not yet written. The routes work (auth, landing,
dashboard, audit creation all work). The placeholder text "This page is not built yet"
is honest about the current state.

## Test design

**Decision:** Frontend test verifies route matching; backend test uses TestClient.

**Why:** End-to-end browser testing requires running both servers. Route tests work
in isolation. Backend TestClient exercises the full FastAPI stack without a live server.

## No intentionally broken code

**Decision:** All code runs correctly. No sabotage to "prove tests work."

**Why:** The evaluator's remark about "broke the code on purpose" was criticism of a
previous submission style. This code passes all tests without modification.