# Dabble 2.0 Phase 1 Scope Contract

This document is the implementation contract for the first build phase after
agent-system setup.

## Goal

Ship a stable MVP shell that works without maps or AI and requires minimal
owner intervention.

## In Scope (Must Build)

- Public routes
  - `/` (landing)
  - `/about`
  - `/explore` (list-first; no hard dependency on Google Maps)
- Auth routes
  - `/dabble/signup`
  - `/dabble/signin`
- Profile routes
  - `/profile` (auth-aware redirect)
  - `/profile/setup`
  - `/profile/[username]`
- Baseline APIs
  - `/api/health`
  - `/api/profile/me` (minimal, safe response)

## Deferred (Explicitly Out of Scope)

- Mandatory maps rendering in core flow
- AI profile generation/image generation
- Credits/payment/marketplace behavior
- Messaging/chat system
- Growth mechanics and gamification

## Product Principles (Non-Negotiable)

- Calm and anti-hustle tone.
- Users are peers (learners + sharers), not buyers/sellers.
- Real-life local connection emphasis.
- Privacy-first location model.

## Technical Constraints

- Supabase is the single data/auth path in v2.
- All optional integrations are feature-flagged.
- Server-only keys never use `NEXT_PUBLIC_*`.
- Build must pass with optional keys missing.

## Acceptance Criteria

1. `npm run ready` passes.
2. Anonymous user can navigate `/`, `/about`, `/explore`.
3. Auth flows render and handle expected error states.
4. Profile setup route renders without maps/AI dependencies.
5. No imports of map SDK in global layout.

## Phase 1 Risks and Mitigations

- **Scope creep** -> enforce this contract before each implementation batch.
- **Design drift** -> use token-backed primitives only.
- **Auth coupling** -> keep profile reads/writes behind thin service layer.
- **Env confusion** -> run `npm run check-env` on every handoff.
