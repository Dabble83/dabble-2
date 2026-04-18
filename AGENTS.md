# Dabble 2.0 Agent Operating Guide

<!-- BEGIN:nextjs-agent-rules -->
## Next.js Version Safety

This project uses modern Next.js (App Router). Agents must check current docs in
`node_modules/next/dist/docs/` before changing framework-specific behavior.
Heed deprecation notices and avoid outdated patterns.
<!-- END:nextjs-agent-rules -->

## Objectives

- Keep Dabble 2.0 merge-ready with minimal owner intervention.
- Isolate optional integrations (Maps, AI) so core flows always work.
- Maintain design consistency through a single token/component system.

## Non-Negotiable Guardrails

- Never block the app on optional keys.
- Never place secrets in `NEXT_PUBLIC_*`.
- Never commit `.env.local`.
- Keep integrations behind feature flags and graceful fallbacks.
- Prefer small PRs with explicit acceptance checks.

## Agent Roles

1. Product-Spec Agent
   - Defines route scope and non-goals for each phase.
2. Design-System Agent
   - Owns tokens, type scale, spacing, and UI primitives.
3. App-Shell Agent
   - Implements navigation, page shell, static routes.
4. Data/Auth Agent
   - Owns Supabase auth/session/profile flows.
5. Maps Agent
   - Adds map/geocode adapters behind flags; never in global layout.
6. AI Agent (optional)
   - Adds optional AI endpoints behind flags and timeouts.
7. Stability Agent
   - Enforces env checks, lint/build, and regression gates.

## Phase Workflow (Sequential Gates)

### Gate A - Bootstrap
- `npm run build` passes with no optional env keys.
- `/api/health` returns 200 JSON.

### Gate B - Product Scope Approval (owner input)
- Confirm route list and deferred features.

### Gate C - Design Approval (owner input)
- Approve `/design/preview` for brand consistency.

### Gate D - Integration Approval (owner input)
- Confirm maps and optional AI degrade safely when disabled/misconfigured.

## Standard Agent Handoff Contract

Each agent update must include:

- What changed (`files touched`)
- Why (`user value / risk`)
- Verification (`commands run`)
- Open risks (`known gaps`)
- Next agent (`owner` and entry criteria)

## Required Verification Commands

Run before handoff:

- `npm run check-env`
- `npm run lint`
- `npm run build`

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and similar keys are server-only.
- Do not keep unrelated secrets (for example `GITHUB_TOKEN`) in app env files.
- If any credential is pasted into chat/logs, rotate it.