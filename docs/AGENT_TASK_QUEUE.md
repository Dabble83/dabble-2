# Dabble 2.0 Agent Task Queue

Use this as the execution order. One implementation owner at a time.

## Current Stage

- Stage: Phase 1 build start
- Branch: `cursor/dabble2-agent-workflow`
- Status: Ready for implementation

## Queue

1) Product-Spec Agent (quick pass)
- Confirm `docs/PHASE_1_SCOPE.md` against latest goals.
- Output: approved scope + any deltas.

2) Design-System Agent
- Create initial token map and component primitives.
- Add `/design/preview`.
- Gate: Owner aesthetic sign-off (Gate C).

3) App-Shell Agent
- Implement route skeletons for `/about`, `/explore`, `/profile*`.
- Keep list-first explore and neutral fallbacks.

4) Data/Auth Agent
- Wire Supabase auth/session baseline.
- Implement minimal `/api/profile/me` and profile setup wiring.

5) Stability Agent
- Run `npm run ready`.
- Document failures and targeted fixes.

## Definition of Done (Phase 1)

- Scope items in `docs/PHASE_1_SCOPE.md` implemented.
- `npm run ready` green.
- No optional integration required for core route success.

## Handoff Format (Required)

- Files changed
- Why it matters
- Verification run
- Risks/open questions
- Next queue item