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

## §5 Marketing copy & home

### §5.1 Tagline system (canonical)

Use this stack on the marketing home (`/`) and in meta descriptions unless a route-specific line is approved.

| Slot | Copy |
|------|------|
| Eyebrow | Trade skills with people nearby |
| Primary H1 | Try something new, wherever you are. |
| Subhead | Dabble connects you with skilled neighbors and traveling locals who can teach you a real skill in an hour — fly casting, sourdough, drywall, first kayak strokes. No cash, no pressure, just curiosity in action. |
| Primary CTA | Find a skill → `/explore` |
| Secondary CTA | Offer a skill → `/profile/setup` |

**Retired (do not ship):** “Skills travel best when they walk next door” and other pre–§5.1 hero lines.

### §5.6 Testimonials (home)

- Short neighbor quotes with first name + neighborhood (or “Dabbler in …”) — no stock-photo voice.
- Rotate 2–3 quotes; link to `/safety` or guidelines if a quote mentions trust.
- **Placeholder:** `TestimonialRow` on the home page until quotes and attributions are sourced.

### §5.7 Credits explainer (home seed phase)

- One line each: starting balance during seed phase, earning by teaching, time approximation (`1 credit ≈ 20 minutes`).
- Link **How it works** → `/how-it-works` for the full credits/session story (RFC + product).
