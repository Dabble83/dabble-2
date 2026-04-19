# Cursor Kick-Off Prompt — Dabble 2.0

Copy and paste this into Cursor to start the next build session.

---

## Paste this into Cursor:

```
We're building Dabble 2.0 — a calm, anti-hustle platform for local skill exchange.
The app is live at dabble.it.com (deployed from Dabble83/dabble-2 on Vercel).
You're working in the Dabble-2/ subfolder of this monorepo.

Read these files before doing anything:
- Dabble-2/docs/MASTER_PLAN.md        ← the full implementation roadmap
- Dabble-2/spec/DABBLE_PRODUCT.md     ← product vision and principles
- Dabble-2/spec/DABBLE_DESIGN.md      ← complete design system and tokens
- Dabble-2/spec/DABBLE_COPY.md        ← canonical copy for all UI text
- Dabble-2/spec/DABBLE_ARCHITECTURE.md ← route map and file structure

We are starting on PHASE 1 of the master plan. Work through the tasks in order:

1. Fix the Supabase database schema (run the ALTER TABLE SQL in MASTER_PLAN.md §1.1)
2. Fix the explore API fallback logic (MASTER_PLAN.md §1.2)
3. Verify the by-username API works after schema fix (§1.3)
4. Complete and verify the profile setup flow end-to-end (§1.4)
5. Replace the dev placeholder landing page with the real product page (§1.5)
6. Build the explore page with profile cards (§1.6)
7. Build the public profile page (§1.7)

For each task:
- Read the relevant spec sections before writing code
- Follow the design tokens in globals.css (var(--token-name)) — never hardcode colors
- Use the exact copy from DABBLE_COPY.md for all user-facing text
- After completing a task, tell me what you did and what to verify

Security rules that must never be broken:
- All /api/profile/* routes must keep requireRouteUser() auth checks
- Never expose SUPABASE_SERVICE_ROLE_KEY via NEXT_PUBLIC_* variables
- Supabase RLS stays enabled on all tables

Product rules that must never be broken:
- No payment, marketplace, gamification, or urgency features
- Users are called "dabblers" — not users, members, or customers

Start with Task 1: read MASTER_PLAN.md §1.1 and tell me the SQL you'll run before
running it.
```

---

## After Phase 1 is complete, use this prompt for Phase 2:

```
Phase 1 is complete. Now start Phase 2: Design Overhaul from MASTER_PLAN.md.

Read MASTER_PLAN.md §2.1 through §2.7 carefully before writing any code.

Work through the design tasks in order:
1. Typography upgrade — add Lora from Google Fonts (§2.1)
2. Landing page hero redesign — two-column layout with SVG illustration (§2.2)
3. Header and navigation polish — sticky, CTA button, mobile menu (§2.3)
4. Explore page card upgrade — pill tags, richer grid layout (§2.4)
5. Profile setup form redesign — step indicator, tag input component (§2.5)
6. Public profile page design — header band, two-column content (§2.6)
7. Auth pages design — centered card layout (§2.7)

The design should feel like a warm, editorial community platform — similar in
feel to homeexchange.com and connect.hv. Clean layouts, generous whitespace,
strong serif typography, muted sage green accents. Not a startup product.

After each component, share a screenshot or describe exactly what changed.
```
