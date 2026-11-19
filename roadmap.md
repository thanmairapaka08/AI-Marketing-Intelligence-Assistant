# Roadmap

Status as of 2026-11-19. Completed items are checked; remaining items are the
known gaps between this assessment build and a production product. Nothing on
this list is hidden or softened — they are the honest remaining scope.

## Completed

- [x] Design system, env config, .gitignore
- [x] API client (axios, refresh, error normalisation) + endpoint services
- [x] Auth (login, register, session restore, protected routes, logout, explore mode)
- [x] App shell (sidebar, mobile drawer, top bar, theme toggle)
- [x] Landing page
- [x] Dashboard
- [x] New audit + audit results (polling, five metrics, tables, exports)
- [x] Websites, History, Competitors, Recommendations, Reports, Settings
- [x] Tests, README, AGENTS.md
- [x] Backend integrated into one repository (`backend/`)

## Remaining (known, not hidden)

- [ ] Real database — state is in-memory and resets when the server restarts
- [ ] Gemini integration — `GEMINI_API_KEY` is reserved; recommendations are rule-based
- [ ] Multi-page crawl — the crawler currently evaluates the single requested URL
- [ ] Audit detail report page (`/audits/$id`) is a placeholder while the report
      component is built
- [ ] Broken-link verification — links are counted but not individually fetched