# Dabble 2.0 Phase Status

## Current branch

- Active integration: `cursor/dabble-2-trim-ui-home-docs` (SEO, perf, `/about` alignment with `MASTER_PLAN` §2–§3, auth polish)
- Earlier Phase 2 design landed via `cursor/phase2-design-overhaul-0551` and related merges

## Completed

- Agent operating model (`AGENTS.md`, runbook, prompt templates, queue)
- Design system baseline and preview page
- App shell routes (`/about`, `/explore`, `/profile*`, `/dabble/*`)
- Supabase auth + profile APIs + profile setup persistence
- **Password recovery:** `/dabble/forgot-password`, `/dabble/update-password`, sign-in link (email reset via Supabase)
- Explore API integration and map adapter shell
- Session-aware header nav with sign in/out behavior
- API response normalization helpers
- Phase 1 QA checklist
- Client reliability improvements (loading/error/retry on key screens)
- **Phase 2 — Design overhaul** (`docs/MASTER_PLAN.md` §2.1–§2.7): Lora typography, hero redesign, sticky nav + mobile menu + Join CTA, Explore card grid, profile setup steps + tag input, public profile layout, auth shells
- **Build prompts P1.4 / P1.6 / P1.7** (`docs/CURSOR_BUILD_PROMPTS.md`): Explore `FilterBar` + URL filters, `/safety` §12 copy, `/guidelines` §13 copy

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
