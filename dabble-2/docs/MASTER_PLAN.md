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

## §13 Community guidelines (`/guidelines`)

Canonical copy for the guidelines page. Tone: warm **trail-guide** voice (plain language, calm pacing, no hustle). Do not expand promises beyond this section without product/legal review.

### §13.0 Opening

The trail is better when we walk it together—calmly, honestly, and with room for beginners.

### §13.1 Respect

**Who we welcome.** Neighbors and curious visitors who treat others with patience and dignity—across backgrounds, ages, and skill levels. We like the trail when everyone can breathe.

**Zero tolerance.** Harassment, hate, slurs, threats, intimidation, stalking, unwanted sexual attention, or coordinated pile-ons. We remove people who break the trail rules.

### §13.2 Honest skill claims

Dabble is built around **skilled amateurs** sharing what they have actually practiced—not around pretending to be something you are not.

- Say what you have done, how often, and in what setting.
- If you are **not** a certified instructor, do not imply licenses, insurance, union cards, or endorsements you do not have.
- If someone needs regulated work (electrical behind walls, medical decisions, legal advice), **kindly point them** toward a licensed professional.

### §13.3 Safe meetups

First meets stay **public**, **short**, and **easy to leave**. The checklist below matches §12.6 so we do not fork two versions:

- Meet in a **public** place the first time.
- Tell someone you trust **where** you are going and **how long** you expect to be.
- Keep the session **short** so expectations stay small; align with seed-phase credit norms when published.
- Stay in **skilled-amateur** territory; defer to licensed professionals for regulated work.
- Prefer **in-app messaging** until you are comfortable; avoid posting phone numbers, email, or home address on profiles.
- **Leave** if anything feels unsafe; **report** concerns to safety@dabble.it.com.

For the broader safety model—including tiers and out-of-scope lists—visit `/safety` (Master Plan §12).

### §13.4 Credits integrity

- **No** selling credits for cash or trading credits off-platform in ways that recreate a gig economy.
- **No** ghost sessions or collusion to farm credits—if a meetup did not happen, it did not happen.
- Keep exchanges **small**, **honest**, and aligned with the seed-phase credit story when published.

### §13.5 Reporting

**How.** Email **safety@dabble.it.com** with who was involved, when it happened, and what occurred—stick to facts you are comfortable sharing. In-product reporting will arrive later; email is the path for now.

**What happens next.** We triage, may pause or mute accounts while we review, and follow up with the parties involved when appropriate.

**72-hour response promise.** During the seed phase, we **acknowledge substantive reports within 72 hours** on business days. Some matters need more time to untangle; if so, we still send a first note inside that window so you are not left guessing.

## §10 Credits economy (`/how-it-works`)

Canonical copy for the credits explainer. Tune numbers in product only when this section is updated in the same commit.

### §10.0 Opening

A quick trail map for first-time visitors—what a credit is, how it moves, and why we keep money off the path.

### §10.1 What a credit is

One credit is a small unit of neighbor time—roughly **twenty minutes** of focused, in-person help. It is **not** a dollar and **not** a contract. Sessions are priced in whole credits so expectations stay legible.

### §10.2 How to earn

- **Teach a session** that both parties mark complete; learner confirmation and (when shipped) simple ratings help the ledger stay honest.
- **Get rated** after sessions (when ratings ship); good-faith feedback keeps the loop trustworthy.
- **Time-banked loop:** the skills you teach become credits someone else spends, so curiosity circulates instead of cash.
- **Free-seed allocation:** during the seed phase, eligible accounts receive starter credits so newcomers can try Dabble before their first teach (see §10.5).

### §10.3 How to spend

| Shape | Credits |
|-------|---------|
| Tip (small favor, a few minutes) | 1 |
| Short session (hands-on demo length) | 3 |
| Walk-with (longer neighborhood session) | 6 |

### §10.4 Why credits instead of money

- **Legal simplicity:** fewer gray zones than charging strangers for ad-hoc services through profiles.
- **Community culture:** swaps curiosity for transaction optics.
- **Access:** people who could not hire a private tutor for an hour can still join a neighborly exchange.

### §10.5 Free seed phase

While we are **under 10,000 members**, every **new member** receives **three starter credits** so you can book a short session before you teach your first skill. The cap keeps the loop generous during early growth.

### §10.6 Example math (inline explainer)

Teach a 1-hour fly-casting lesson → earn 3 credits → spend them on a drywall-patching lesson or a sourdough class.
