# Dabble 2.0 Phase Status

## Current branch

- `cursor/dabble2-agent-workflow`

## Completed

- Agent operating model (`AGENTS.md`, runbook, prompt templates, queue)
- Design system baseline and preview page
- App shell routes (`/about`, `/explore`, `/profile*`, `/dabble/*`)
- Supabase auth + profile APIs + profile setup persistence
- Explore API integration and map adapter shell
- Session-aware header nav with sign in/out behavior
- API response normalization helpers
- Phase 1 QA checklist
- Client reliability improvements (loading/error/retry on key screens)

## Remaining before merge

- Run full manual QA in `docs/QA_CHECKLIST.md`
- Confirm Supabase table schema alignment in production project
- Validate signup behavior in both email-confirmation and auto-session modes
- Optional: enable real map renderer behind `NEXT_PUBLIC_ENABLE_MAPS`

## Next phase candidates

- Replace map adapter shell with real map renderer
- Add profile photo upload flow
- Add richer profile editing for offers/wants
- Add lightweight tests for critical API routes
