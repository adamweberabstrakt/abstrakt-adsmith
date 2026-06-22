# Fix: Audit failing with 404 model error

## Problem
Production logs show `/api/analyze` returning 500s. Underlying cause:

```
404 not_found_error: "model: claude-sonnet-4-20250514"
```

The app calls a **retired** Anthropic model string. The API key authenticates
fine (the 404 is a model-lookup failure, not auth), so the only issue is the
outdated model name.

## Affected files
- [ ] `src/app/api/analyze/route.ts` (line 18) — the route in the error logs
- [ ] `src/app/api/regenerate-messaging/route.ts` (line 21) — same bug, not yet hit

## Fix (minimal)
Replace the retired model string with the current Sonnet model in both files:

`claude-sonnet-4-20250514`  →  `claude-sonnet-4-6`

This is a drop-in family upgrade (Sonnet 4 → Sonnet 4.6). No other code changes,
no signature changes, no dependency changes. The installed SDK (`^0.24.0`) passes
the model string straight through to the API, so the newer name works as-is.

## Verify
- [ ] `npm run build` passes
- [ ] Commit + push to `main` for Vercel auto-deploy
- [ ] Run a live audit on the deployed URL to confirm a completed report

## Notes / open question
- Push auth: the clone worked (public repo), but pushing needs write access. The
  active PAT is scoped to `amg-ai-audit` — pushing to `abstrakt-adsmith` may
  require re-scoping the token or a manual push by you. Will confirm at push time.

## Review
(to be filled in after execution)
