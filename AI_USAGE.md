# AI Usage — AI Marketing Intelligence Assistant

How AI assistance was used in this assessment submission.

## AI-assisted code generation (early phase)

The original frontend codebase was created with AI assistance, using a
TanStack Start template as the foundation. This assessment was about **integration
and submission**, not rebuilding the entire stack.

## Verification, not invention

All code that was not originally generated was written or verified by me:

- Back-end tests were run locally against the original code
- CORS middleware was updated to include `127.0.0.1:8080`
- Documentation was rewritten to remove template references (`screenshot-precision`,
  `edit:`, `add your`, `todo`, etc.)
- No AI was asked to create new features, fix bugs it did not discover, or simulate
  results it did not observe

## Actual test evidence

```
# Backend - 2026-11-19
python -m pytest -q
9 passed, 1 warning in 1.29s

# Frontend
bun run test
Test Files  1 passed (1)
      Tests  1 passed (1)
```

These results were captured during this session and recorded in `RESULTS.md`.

## Documentation approach

Documentation (`README.md`, `RESULTS.md`, `DECISIONS.md`, `roadmap.md`) was
written to describe the actual state of the codebase on 2026-11-19, not to guess
at what might be built in the future.