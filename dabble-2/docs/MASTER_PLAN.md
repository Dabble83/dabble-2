# Dabble 2.0 — Master plan

## Phase 2 — Design overhaul (editorial community)

Aesthetic direction: warm, editorial, generous whitespace; strong serif headlines; muted sage accents; not a “startup SaaS” look. Reference feel: community home-exchange style sites.

### §2.1 Typography upgrade

- Load **Lora** from Google Fonts (Next.js `next/font/google`) for headings and editorial body where appropriate.
- Keep a humanist sans (existing Geist) for UI chrome, labels, and dense UI.

### §2.2 Landing page hero redesign

- **Two-column** layout on large screens: copy left, **SVG illustration** right (abstract neighborhood / exchange motif, inline SVG).
- Hero emphasizes community and calm discovery, not feature bullets.

### §2.3 Header and navigation polish

- **Sticky** header with subtle blur / translucent surface.
- Primary **CTA** (“Join” or “Get started”) to sign-up.
- **Mobile menu** (hamburger) with full-width panel; desktop inline links.

### §2.4 Explore page card upgrade

- Profile cards with **pill tags** for offers/wants (sage-tinted pills).
- **Richer grid**: asymmetric feel optional via span or varied card padding; clear hierarchy (name, @handle, neighborhood).

### §2.5 Profile setup form redesign

- **Step indicator** (e.g. 1 Basics → 2 Interests & skills → 3 Discoverability).
- **Tag input** component for comma-free tag entry (add on Enter/comma, remove chip).

### §2.6 Public profile page design

- **Header band** (full width) with name, @username, neighborhood.
- **Two-column** content below: intros / story left; tags and secondary info right.

### §2.7 Auth pages design

- **Centered** layout with editorial framing; single **card** for the form (sign-in / sign-up) on a soft background.

## §12 Safety & trust (four-tier framework)

Canonical copy for `/safety`. Do not expand safety promises beyond this section without product/legal review.

### §12.0 Introduction

Dabble routes exchange through **credits and time-boxed curiosity**, not cash for services. That reduces transactional liability and keeps meetups in a **skilled-amateur** frame: neighbors sharing know-how, not hired professionals or gig marketplaces.

### §12.1 Tier 1 — Curiosity in passing

Short, informal moments without scheduling pressure.

- Showing how to tie a bowline once while rigging a line at a public dock.
- Pointing out three edible mushrooms on an organized woods walk where the host group sets safety rules.
- Explaining one breaker reset step while a neighbor watches their own panel.

### §12.2 Tier 2 — Deliberate public session

A planned exchange in a **public** or **community** setting, kept short.

- Forty minutes at a library table folding sourdough basics side by side.
- Helping someone swap brake pads at a farmers-market bike booth hosted by a local collective.
- Paddle-float practice at a staffed public beach where venue rules govern life jackets.

### §12.3 Tier 3 — Continued practice with the same neighbor

Follow-ups after a Tier 2 session, still bounded and still aligned with Dabble’s no-cash / no-gigs posture.

- A second public session on the same topic because the first met both people’s boundaries.
- A small neighborhood circle (few people) hosted in a rented room or yard where everyone opts in.

### §12.4 Tier 4 — Outside what Dabble coordinates

These are **not** coordinated through Dabble’s product surface; people may choose them privately, but the platform does not schedule or supervise them.

- Solo work inside strangers’ private homes as a first meeting.
- Recurring dependent care, childcare without guardians present, or medical services.
- Anything that implies professional licensing, insurance, or background checks Dabble does not verify.

### §12.5 What we never host (out of scope)

- Marketplace listings, cash tips solicited through profiles, urgency mechanics, leaderboards, or other product non-goals (payments, hustles, churn prompts).
- Sexual solicitation, dating, or escorting framed as “sessions.”
- Medical diagnosis, prescription advice, supervised withdrawal, or crisis mental-health treatment carried through Dabble chat.
- Weapons training aimed at harm, evasion of law, or instructions for illegal conduct wherever the participants are.

### §12.6 Meeting for the first time (safe-meetup checklist)

- Meet in a **public** place the first time.
- Tell someone you trust **where** you are going and **how long** you expect to be.
- Keep the session **short** so expectations stay small; align with seed-phase credit norms when published.
- Stay in **skilled-amateur** territory; defer to licensed professionals for regulated work.
- Prefer **in-app messaging** until you are comfortable; avoid posting phone numbers, email, or home address on profiles.
- **Leave** if anything feels unsafe; **report** concerns to safety@dabble.it.com.
