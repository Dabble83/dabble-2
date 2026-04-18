# Cursor Build Prompts — Dabble 2.0

A sequenced, ready-to-paste set of prompts for Cursor agents (and humans) to
build Dabble 2.0 against the Master Plan in
`docs/Dabble-Master-Plan.docx`.

Every prompt here is self-contained. Paste the heading + body of a single
prompt into your Cursor composer and execute. Do not skip ahead — the
dependency chain matters.

---

## 0. How to use this playbook

**Order of operations.** P0 prompts unlock the design system and canonical
home. P1 unlocks profile, explore, and safety pages. P2 adds the credits and
session domains. P3 polishes onboarding and messaging. Cross-cutting prompts
(X.\*) run in parallel and may be picked up whenever capacity allows.

**Always include in every Cursor composer session:**

- Repo: `Dabble83/dabble-2` (not the monorepo).
- Stack: Next.js App Router, Tailwind CSS v4, Supabase, Vercel.
- Guardrails in `AGENTS.md` always apply: isolate optional integrations
  (Maps, AI) behind feature flags, never put secrets in `NEXT_PUBLIC_*`,
  never commit `.env.local`, keep PRs small with explicit acceptance checks.
- After every PR, run `npm run check-env && npm run lint && npm run build`
  and attach the output.
- Every PR must use the handoff template in `docs/AGENT_HANDOFF_TEMPLATE.md`.
- Every PR must cite the Master Plan section(s) it implements.

**Tone rule for any copy changes.** Dabble is a skill-sharing community that
works wherever you are — your block, a trail town, a new city. Never say
"neighbor-to-neighbor." Use "nearby," "people," "locals and travelers,"
"wherever you are." The legacy line _"Skills travel best when they walk
next door"_ is retired and must not appear in new copy.

---

## 1. Brand reference sheet

Include this block verbatim in any Cursor composer that touches styling.

### 1.1 Palette

| Role             | Token name        | Hex       |
|------------------|-------------------|-----------|
| Background       | `cream`           | `#F6F1E8` |
| Surface          | `paper`           | `#FFFFFF` |
| Primary brand    | `sage`            | `#7A8F6A` |
| Brand hover      | `moss`            | `#6B7A5A` |
| Brand border     | `brand-border`    | `#5F6B55` |
| Brand text       | `forest`          | `#2D5016` |
| Secondary accent | `clay`            | `#C46A3E` |
| Warm accent      | `ember`           | `#E5B784` |
| Primary text     | `ink`             | `#1F2A37` |
| Secondary text   | `pebble`          | `#4B5563` |
| Tertiary text    | `stone`           | `#6B7280` |
| Hairline         | `lichen`          | `#C9CFC2` |
| Table shade      | `fog`             | `#E8E2D3` |
| Success          | `trail`           | `#4F7A52` |
| Warning          | `amber`           | `#C08A1E` |
| Danger           | `rust`            | `#9B3B2E` |

### 1.2 Type

- **Display:** Fraunces (Google Fonts), weight 500 for headlines. Loaded via
  `next/font/google` in `app/layout.tsx`, exposed as `--font-display`.
- **UI/body:** Geist (already loaded), exposed as `--font-sans`.
- **Long-form body (optional):** Source Serif 4, exposed as `--font-serif`.
  Only used on `/about` and `/philosophy`.
- Display is display-only. Never Fraunces on paragraph body.
- Sizes:
  - H1 display: 48–64px, weight 500, letter-spacing -0.02em.
  - H2: 32–40px, weight 500.
  - H3: 24px, weight 500.
  - Body: 16–18px, weight 400, line-height 1.6.
  - UI label: 14px, weight 500.
  - Micro/eyebrow: 12px, weight 500, uppercase, letter-spacing 0.08em.
- Button labels are sentence case.
- Max body measure: 68–72 characters.

### 1.3 Spacing, radius, shadow

- Spacing scale (px): 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- Radius: 8 (tight), 12 (default), 20 (large/cards), 999 (pill).
- Shadow: `0 1px 2px rgba(31,42,55,.06), 0 4px 12px rgba(31,42,55,.06)` for
  elevated cards; no heavier shadows.

### 1.4 Voice

Do say: nearby, wherever you are, try, share, together, tip, short, gentle,
thank you, a real person, a local who loves it, a friendly stranger.

Never say: instructor, teacher, lesson, booking, gig, hustle, expert
(unless the user has opted into elevated coach status), neighbor-to-neighbor.

---

## 2. Imagery direction sheet

**This section is the authoritative reference for every visual asset Cursor
commissions, generates, or inserts.** It is deliberately over-specified so
that an illustrator, a photo sourcer, or an AI image model produces output
that looks like Dabble on the first try.

### 2.1 Photography system

#### 2.1.1 Universal treatment

All Dabble photography shares the same grade so it reads as one world.

- **Light:** natural only. Golden hour or overcast midday. Never fluorescent
  interiors. Never hard flash. No HDR. Light should feel like it landed
  without us asking.
- **Color grade:** warm, slightly desaturated. Push shadows toward
  brown-green (not blue). Whites are creamy, not paper-white. Saturation
  around 85% of default; never pumped.
- **Lens feel:** 35mm–50mm equivalent, f/2.8–f/4. Shallow depth of field on
  the primary subject, but the environment stays legible. No fisheye, no
  heavy bokeh, no tilt-shift.
- **Grain:** a very subtle film grain is acceptable. No Instagram filters.
- **Aspect ratios to produce for each shoot:** 16:9 (hero), 4:5 (card), 1:1
  (avatar fallback), 3:2 (blog/editorial).
- **Moment to capture:** always mid-action, never posed. A hand on the
  dough. A knee bent on a parallel turn. Two people looking at the same
  thing, not at the camera.
- **People:** two people in frame whenever possible, different ages,
  different bodies, different ethnicities across the gallery. Never token
  inclusion, never a staged group. At least one pair in every category
  should have one person visibly over 50 and one person visibly under 30.

#### 2.1.2 What we never photograph

- Laptops, desks, office interiors, headsets, whiteboards.
- Gym interiors with treadmills or mirrors.
- Classroom rows with a presenter.
- Over-styled kitchens that look like staging for real-estate listings.
- Stock “handshake” images.
- Anything with a visible corporate logo.
- Anyone smiling at the camera as the primary action. Smiles are fine; they
  just should not be aimed at the viewer.

#### 2.1.3 Hero photograph (home page)

The hero needs to visually say “your block and a trail town, at the same
time.” It is the single most important image in the product.

- **Subject:** two people mid-session, in a place that reads both local and
  adventurous. Examples that all qualify:
  - A lift line on a blue-run chair with two people chatting, one
    adjusting the other’s snowboard binding with a gloved hand.
  - A shallow eddy on a mellow river with two people holding kayak
    paddles, mid-explanation, mountains behind.
  - A sunny community garden with two people over a raised bed, one
    showing the other how to transplant a seedling.
- **Composition:** subjects slightly left of center, occupying the bottom
  third to middle. Horizon line in the upper third. The right third is
  quieter so headline type can breathe over it without a scrim.
- **Light:** late afternoon, raking from camera left. Long, soft shadows.
- **Color grade:** sage greens, warm clays, cream sky. Should feel at home
  on a `#F6F1E8` background.
- **Mood:** curious, easy, unhurried.
- **What must be visible:** hands doing something. The fact of instruction
  should be implicit — one person a half-step further along than the other.
- **What must not be visible:** branded gear logos, cameras, phones, the
  word “lesson” on any sign.

**AI generation prompt (Midjourney / Firefly / Imagen):**

```
A candid, documentary-style photograph, late afternoon golden-hour light
raking from the left, two people mid-action on a quiet river eddy in the
Rocky Mountains — one person in their thirties holding a kayak paddle mid-
demonstration, the other in their fifties watching closely with a relaxed
posture, both in worn, non-branded outdoor layers. Water glints warmly,
mountains soft in the background, slight haze, film grain, shot on a 35mm
lens at f/2.8. Warm but slightly desaturated palette of sage greens
(#7A8F6A), warm clays (#C46A3E), and cream sky (#F6F1E8). Subjects in the
bottom-left two thirds, quiet negative space on the upper right. No logos,
no branded gear, nobody looking at camera, nobody smiling broadly. Feels
like a still from a patient nature documentary, not a stock photo.
--ar 16:9 --style raw
```

**Stock-photo fallback search keywords (Unsplash/Pexels):**
`kayak shallow river lesson two people`, `chairlift conversation
candid`, `community garden raised bed tutorial`, `river eddy instruction
golden hour`.

#### 2.1.4 Skills strip (horizontally-scrolling row on home)

One photo per launch skill. Each image is 4:5, people-first, showing the
moment of learning or practicing. Briefs:

- **Parallel skiing**: two skiers side-by-side on a blue groomer, one
  watching the other’s hip rotation, mid-turn, snow spray. Shot from the
  side. Flat light of an overcast morning.
- **Drywall patching**: close, 35mm frame of two hands on a sanding block,
  a second person’s forearm in soft focus holding a work-light. Dust
  visible in the raking light. A historic doorway visible at the edge.
- **Fly casting**: mid-loop of a cast, backlit by a low afternoon sun on a
  trout stream. Waders knee-deep. The beginner’s rod tip is in frame; the
  coach is just behind them, hand hovering near the elbow to correct form.
- **Sourdough starter**: two people at a kitchen counter, one pouring warm
  water into a glass jar while the other watches with a flour-dusted hand
  resting on the counter. Morning light through a window with a plant.
- **Fingerstyle guitar**: two people on a stoop or porch, one finger-
  picking, the other watching the picking hand. Neither is the instructor-
  as-hero — framing stays peer-to-peer.
- **First kayak strokes**: flatwater lake, the beginner in the boat at the
  dock, the coach kneeling on the dock beside them, pointing at the blade
  angle of the paddle.
- **Mountain biking**: two riders pulled over at a trail junction, one
  pointing at a rock feature on the trail ahead, the other holding the
  handlebar and listening.
- **Bird watching**: two people sharing a single pair of binoculars on a
  wooded path, early light. Field guide open on a bench between them.

For each, generate the AI prompt by wrapping the brief in the universal
treatment language from §2.1.1 and appending `--ar 4:5 --style raw`.

#### 2.1.5 Testimonial portraits

- Tight 1:1 crops, eye-level, relaxed.
- Subject is looking just past the camera, not at it.
- Backgrounds are location-specific — a garage workbench, a kitchen, a
  river bank — shallow-focus so the environment reads as color and shape.
- No studio backdrops. No beige conference-room walls.

### 2.2 Illustration system

Commission one illustrator for the full set. Mixed styles is the fastest
way a community brand starts to look corporate.

#### 2.2.1 Style

- Hand-drawn, slightly loose, visible pencil or pen weight, with an
  unfinished corner or two.
- Primary linework weight: 1.5pt at display size. Corners can soften.
- Line color: `#2D5016` (forest) at 90% opacity over cream.
- Fills: flat blocks of `#7A8F6A` sage, `#C46A3E` clay, `#E5B784` ember,
  with occasional cream paper showing through on purpose.
- Reference points: 1970s national park brochures, REI co-op editorial
  illustration, Nigel Peake’s small-town line drawings, older Sierra Club
  publications.
- **Not** cartoon, **not** isometric, **not** Corporate Memphis, **not**
  sticker-pack vectors. No gradients. No drop shadows.

#### 2.2.2 Spot illustrations (where they appear)

Produce these specific spots first:

1. **Home "How it works" trio.** Three square illustrations, each roughly
   480×480px at display.
   - **Meet.** Two simplified figures approach each other along a path,
     topo contours behind them. One carries a paddle, one carries a bread
     loaf — Dabble covers both worlds.
   - **Share.** A closer frame: two hands, one passing something small
     (a bread tool, a ski wax rub, a fishing fly) to another.
   - **Grow.** A single figure from behind, walking up a gentle slope
     with a renewed posture. A trail marker dot in the distance. The dot
     is sage `#7A8F6A`.
2. **Empty state — Explore map.** A flat topo ridge with a single sage pin
   dot and a faint dashed line suggesting a walk. Caption room below.
3. **Empty state — Sessions.** A calendar page with a single gentle wavy
   line across the week, sage, and a small illustrated thermos on the
   corner. No numbers. Felt like a friendly "nothing scheduled."
4. **Empty state — Messages.** A hand-drawn envelope with a leaf tucked
   into the flap.
5. **Empty state — Ledger.** A thin ledger book open to a blank page, a
   clay-colored pencil across the top.
6. **About-page portrait of the origin.** A chairlift seen from below,
   two dangling skis (one parallel-leg, one with a snowboard), and a line
   of hand-drawn topo contours behind. Renders as a 3:2 header image.
7. **404 page.** A trail sign pointing at three trails; all three signs
   are blank.
8. **Safety hub header.** A topo map fragment with a small compass rose
   in the corner.

For each spot, provide the illustrator with: the brief above, the palette
chips, two example reference images (REI co-op editorial + an NPS
brochure), and a "do not" list (no cartoons, no gradients, no Memphis
shapes).

#### 2.2.3 Category illustrated icons

Dabble has five launch categories. Each gets one illustrated icon at
128×128px (SVG) and a matching 48×48 simplified variant for the filter
chip. All icons in a single stroke weight (1.5pt), sage forest line on
cream, no fill except a single accent color as noted.

- **Outdoor.** A single hand-drawn mountain ridge with a bird rising in
  front. Accent: sage fill on the bird's wing.
- **Home & DIY.** A hammer crossed with a paintbrush, a nail sketched
  beside. Accent: clay on the brush bristles.
- **Craft & Making.** A needle and thread looping into an abstract shape.
  Accent: ember fill inside the loop.
- **Food & Drink.** A loaf of bread with a single leaf of basil. Accent:
  sage leaf.
- **Music & Performance.** A guitar headstock with three strings. Accent:
  clay tuning peg.

Pair icons with the category's pin color (see §2.3.1) so the map and the
icon legend agree visually.

#### 2.2.4 Profile avatar fallback

When a user has no photo, generate an avatar from their initials over a
hand-drawn topo contour circle. Six color variants (one per category plus
a neutral cream). Cycle deterministically by user ID so users stay the
same color forever.

### 2.3 Map motifs

#### 2.3.1 Pins by category

SVG pins, 32×40px drop-shape. Single color fill, 1.5px `#2D5016` stroke.

- Outdoor: sage `#7A8F6A`.
- Home & DIY: clay `#C46A3E`.
- Craft & Making: ember `#E5B784`.
- Food & Drink: forest `#2D5016`.
- Music & Performance: ink `#1F2A37`.

Selected state: pin scales up 15% with a soft sage halo (`#7A8F6A` at
25% opacity, 12px blur).

Cluster state: a circle in the category's color with a cream-filled center
and the count in forest, Geist 500 at 13px.

#### 2.3.2 Map styling

Use the warm Google Maps style already in `ExploreMap.tsx`. Further
tuning:

- Land: cream (`#F6F1E8`).
- Water: a soft muted teal (`#B7C9C3`), never saturated blue.
- Roads: warm grey (`#E8E2D3`) with darker highways (`#C9CFC2`).
- Parks: pale sage (`#DBE3D2`).
- Points of interest: hidden. Dabble pins are the only pins.
- Labels: ink `#1F2A37`, muted at low zoom.

### 2.4 Logo and mark

- Wordmark: `dabble` in lowercase Fraunces 500, forest `#2D5016`.
- Optional mark: a small hand-drawn topo ripple / sound wave glyph,
  usable as favicon, avatar placeholder, and stamp. Provided as SVG with
  forest as `currentColor`.
- Never box the logo. Never drop-shadow the logo. Never place it on a
  photograph without a cream plate behind it if the photo is busy.
- Minimum wordmark size: 80px wide on screen, 24mm wide in print.

### 2.5 What we never use (visual forbiddens)

- Gradient backgrounds.
- Glassmorphism / blur-behind panels.
- 3D blob shapes.
- Emoji in headlines or body copy.
- Purple-blue gradients associated with AI-startup aesthetics.
- Gyms, laptops, classrooms, conference rooms, suburban office parks.
- Anyone in a headset, on a treadmill, or at a whiteboard.
- Leaderboards, star ratings, streak flames, or progress bars that imply
  performance.
- Stock "diverse group high-fiving" photography.

---

## 3. P0 prompts — Foundation

### P0.1 Extend design tokens to full palette

**Owner:** Design-System Agent
**Depends on:** none
**References:** Master Plan §5.4 (Color palette), §5.5 (Typography)

**Goal.** Extend `app/globals.css` and Tailwind config to include the full
palette from §1.1. Keep existing token values; add missing ones.

**Files to create/modify.**

- `app/globals.css` — add all missing CSS custom properties under `:root`
  and map them in `@theme inline`.
- `postcss.config.mjs` — no changes expected.
- Create `src/lib/design/tokens.ts` — a typed export of every token (hex,
  font family, spacing step, radius, shadow) so TS components can import.
- Create `src/lib/design/tokens.css` — optional, if cleaner than keeping
  all tokens in `globals.css`.

**Implementation notes.**

- Preserve existing `--background`, `--surface`, `--brand`, `--brand-hover`,
  `--brand-border`, `--brand-text`.
- Add every token from §1.1 that is not already present.
- Add semantic aliases: `--color-success`, `--color-warning`,
  `--color-danger` that point at trail / amber / rust.
- Remove the body-level `font-family: Georgia` default. Body should
  default to Geist via `--font-sans`.
- Ensure dark mode is NOT enabled. Defer dark mode.

**Acceptance criteria.**

- [ ] All hex values match §1.1 exactly.
- [ ] `npm run build` passes.
- [ ] Tailwind classes work for all tokens: `bg-sage`, `text-forest`,
  `border-lichen`, `bg-ember/20`, etc.
- [ ] `import { colors } from "@/lib/design/tokens"` returns typed object
      with every palette entry.
- [ ] No reference to Georgia anywhere in styles.

**Verification.**

```bash
npm run check-env
npm run lint
npm run build
```

**Open questions.** None.

---

### P0.2 Load Fraunces display font

**Owner:** Design-System Agent
**Depends on:** P0.1
**References:** Master Plan §5.5

**Goal.** Add Fraunces as the display font and wire it into Tailwind.

**Files to create/modify.**

- `app/layout.tsx` — load Fraunces via `next/font/google`, weights 400 and
  500, with `variable: "--font-display"`. Keep Geist loaded. Apply the
  Fraunces class alongside Geist on `<html>`.
- `app/globals.css` — add `--font-display` to `@theme inline` mapping.
- `tailwind.config.ts` (or `postcss` theme) — expose `display` as a font
  family utility: `font-display` → Fraunces.
- Update heading defaults so any `<h1>`, `<h2>`, `<h3>`, `<h4>` defaults to
  `font-display` via CSS cascade. Do NOT force Fraunces onto `body`.

**Implementation notes.**

- Use `display: "swap"` for font loading.
- Add `font-feature-settings: "ss01"` for Fraunces to get its subtle
  soft-serif alternates on headlines.
- Confirm no FOUT flash on the homepage.

**Acceptance criteria.**

- [ ] `<h1>` on the home page renders in Fraunces.
- [ ] Body text continues to render in Geist.
- [ ] No console warnings about font loading.
- [ ] Lighthouse performance score does not drop more than 2 points on
      the home page.

**Verification.**

```bash
npm run check-env && npm run lint && npm run build
```

Manual: load `/` on a desktop Chrome, confirm Fraunces on headings and
Geist on body.

**Open questions.** None.

---

### P0.3 UI primitives library

**Owner:** Design-System Agent
**Depends on:** P0.1, P0.2
**References:** Master Plan §5.4–§5.7, §6, §7.2

**Goal.** Build a small set of typed, composable primitives that every
other prompt in this playbook will rely on. Single source of truth.

**Files to create/modify.**

Create `app/components/primitives/` with these files, each exporting a
default component:

- `Button.tsx` — variants: `primary` (sage fill), `secondary` (cream with
  sage border), `ghost` (no border), `danger` (rust outline). Sizes `sm`,
  `md`, `lg`.
- `Card.tsx` — paper surface, 1px lichen border, radius 20, shadow from
  §1.3. Props: `as` (polymorphic), `padded` default true.
- `Tag.tsx` — pill, 999 radius, small type, variants by palette.
- `CreditsPill.tsx` — dedicated component. Clay numeral, Geist 500, small
  "credits" label. Always the same width regardless of number (tabular
  figures).
- `SafetyCallout.tsx` — a quiet amber-bordered card with an icon slot and
  a copy slot. Not scary, never blocks content.
- `ProfileCard.tsx` — used on `/explore` and in "nearby" grids. Avatar,
  first name, neighborhood, up to two top skills, a "Say hi" secondary and
  a "Request a session" primary.
- `SessionCard.tsx` — renders a scheduled session: partner name, skill,
  time, venue, status.
- `MapPin.tsx` — SVG pin per §2.3.1. Props: `category`, `selected`.
- `Eyebrow.tsx` — the micro/uppercase label per §1.2.

Additionally:

- `app/components/primitives/index.ts` — barrel export.
- `app/components/primitives/README.md` — one-line description of each
  component, Master Plan section reference, and usage example.

**Implementation notes.**

- All primitives are server components unless they require interactivity
  (`Button` interactive states → client).
- Use CSS variables (not hard-coded hex) everywhere so palette changes
  cascade automatically.
- `Button` must meet WCAG AA contrast on both `primary` and `secondary`
  against cream background.
- All text uses logical properties (`padding-inline`, `margin-block`) so
  internationalization stays easy.
- `CreditsPill` uses `font-variant-numeric: tabular-nums`.

**Acceptance criteria.**

- [ ] Every primitive is consumed at least once on the updated
      `/design/preview` page (P0.4).
- [ ] No primitive imports from outside `app/components/primitives/` or
      `src/lib/design/`.
- [ ] All primitives pass axe-core in the preview page.
- [ ] TypeScript types exported for every prop.

**Verification.** `npm run ready`.

**Open questions.** None.

---

### P0.4 /design/preview rebuild

**Owner:** Design-System Agent
**Depends on:** P0.1, P0.2, P0.3
**References:** Master Plan §5.4–§5.7, Gate C checklist

**Goal.** Turn `/design/preview` into the single gating surface for Gate C
owner sign-off. Displays every token and every primitive with
copy-paste code samples and notes.

**Files to create/modify.**

- `app/design/preview/page.tsx` — rebuild.
- `app/design/preview/sections/` — one component per preview section
  (palette swatches, type scale, buttons, cards, profile card, session
  card, credits pill, safety callout, map pin, eyebrow, iconography).

**Implementation notes.**

- Palette swatches: grid of chips with name, token, hex, contrast ratios
  vs cream and ink.
- Type scale: all heading levels rendered with sample text from the
  Master Plan taglines ("Try something new, wherever you are.").
- Every component section shows default + any variants side by side.
- Include a "copy this prop" helper on every example that writes JSX to
  clipboard.
- Page is cream background, cards on paper surface.

**Acceptance criteria.**

- [ ] Owner can sign off Gate C by scrolling this one page.
- [ ] All sections render without layout shift.
- [ ] Mobile breakpoint is clean down to 360px wide.

**Verification.** `npm run ready` and manual review in a desktop and
mobile viewport.

**Open questions.** None.

---

### P0.5 Reconcile the canonical home route

**Owner:** App-Shell Agent
**Depends on:** none (can run parallel with P0.1–P0.4)
**References:** Master Plan §8.1, §7.1

**Goal.** Dabble.it.com currently serves the richer "Skills travel best when
they walk next door" home from `app/dabble/` while `app/page.tsx` shows the
Phase 1 foundation placeholder. Reconcile so `/` is the real home and
`/dabble/` either redirects to `/` or is removed.

**Files to create/modify.**

- `app/page.tsx` — replace placeholder with the new home (P0.6 will add
  the full layout; for P0.5, stub the route with an import from the home
  component).
- `app/dabble/page.tsx` — either delete, or convert to a `redirect('/')`
  Next.js server action.
- Audit `app/dabble/signin/` and `app/dabble/signup/` — these likely hold
  the auth routes. Decision: keep auth under `/dabble/signin` and
  `/dabble/signup` for now, OR move to `/signin` and `/signup`. Produce a
  short RFC in `docs/rfcs/RFC-0001-home-reconciliation.md` and pick one.

**Implementation notes.**

- If the decision is to move auth to top-level, preserve redirects from
  old URLs for at least 90 days.
- Every internal link that pointed at `/dabble` must be updated.
- Confirm the Vercel deployment's alias continues to map correctly.

**Acceptance criteria.**

- [ ] Hitting `/` on dabble.it.com renders the new home.
- [ ] Old `/dabble` URLs either render the new home or 301 redirect.
- [ ] Every nav link is live.
- [ ] Sign-in flow is unbroken.

**Verification.**

```bash
npm run ready
# Manual smoke on preview:
# GET /            → 200, new home
# GET /dabble      → 301 /
# GET /dabble/signin → 200 (or 301 to /signin if moved)
```

**Open questions.**

- Move auth to top-level, or keep under `/dabble`? Document the call in
  the RFC.

---

### P0.6 Home page layout with new copy and imagery

**Owner:** App-Shell Agent
**Depends on:** P0.1, P0.2, P0.3, P0.5
**References:** Master Plan §8.1, §5.1–§5.3, §2 of this playbook

**Goal.** Build the 7-block home layout with finalized copy and placeholder
slots for commissioned imagery.

**Files to create/modify.**

- `app/(marketing)/home/Home.tsx` — extracted home component.
- `app/page.tsx` — render `Home`.
- `content/home.mdx` (new) — store hero/subhead/supporting copy as content
  so future edits do not require JSX churn.
- `public/img/home/` — placeholder hero and skills-strip images.

**Layout (top to bottom).**

1. **Hero.**
   - Headline (verbatim): `Try something new, wherever you are.`
   - Subhead (verbatim): `Dabble connects you with people who love what
     you want to try — on your block, in a town you just arrived in, or
     anywhere in between. Earn credits by sharing a skill, spend them to
     learn one. No cash, no pressure, no leaderboard.`
   - Supporting line: `Great skills are hiding in plain sight. The local
     who knows the eddy. The neighbor with the starter. The stranger on
     the lift with a better turn. Dabble is how you meet them.`
   - Primary CTA: `Join Dabble.` → `/signup`.
   - Secondary CTA: `Browse nearby.` → `/explore`.
   - Hero image slot: 16:9. Use the hero photograph in §2.1.3. Include a
     cream plate behind any headline text that overlaps the photo.
2. **How it works.** Three-up grid using the "Meet / Share / Grow"
   illustrations from §2.2.2 #1. Under each, one sentence in Geist 16px.
3. **Skills strip.** Horizontal scroll of 8 cards. Image (4:5 per
   §2.1.4), skill name in Fraunces 20px, one-line description in Geist
   14px. Use CSS scroll snap.
4. **Why credits, not cash.** Two paragraphs in Geist 18px, left-aligned,
   max 68ch. Include a `SafetyCallout` linking to `/credits`.
5. **Where Dabble is now.** A muted map of North America with three
   pinned cities (NYC + Hudson Valley, Front Range, one mountain town).
   One-line copy: `Dabble is open everywhere, and seeding in a few
   places first. We’d love you to be early in yours.`
6. **Testimonial pair.** Two stacked `Card`s with a 1:1 portrait (§2.1.5)
   plus a short, first-name-only quote.
7. **Safety callout.** `SafetyCallout` with: `Dabble is tips, not
   lessons. Here is how we keep it safe.` → `/safety`.
8. **Final CTA.** Single primary button, `Join Dabble.`
9. **Footer.** Already-existing footer primitive.

**Implementation notes.**

- All images are wired to `next/image` with explicit width/height and the
  `sizes` prop set per breakpoint.
- All copy comes from `content/home.mdx`. The component imports it.
- Hero CTA pair is the only place in the entire site that stacks two
  filled sage buttons; every other page uses one filled + one ghost.
- Mobile: skills strip collapses to swipeable cards. How-it-works stacks.

**Acceptance criteria.**

- [ ] Hero copy matches the Master Plan verbatim (from §8.1 updated
      edition).
- [ ] No mention of the retired "skills travel best when they walk next
      door" line anywhere on the new home.
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95.
- [ ] Every image has an `alt` attribute that describes the scene, not
      the skill in the abstract.

**Verification.** `npm run ready` and a Lighthouse run on the preview URL.

**Open questions.** None.

---

### P0.7 Commission or generate category illustrated icons

**Owner:** Design-System Agent (asset sourcing) + the illustrator
**Depends on:** P0.1
**References:** §2.2.1, §2.2.3 of this playbook

**Goal.** Produce the five category icons as SVGs, stored in
`public/img/categories/` and consumed via a `CategoryIcon` primitive.

**Files to create/modify.**

- `public/img/categories/outdoor.svg`
- `public/img/categories/home-diy.svg`
- `public/img/categories/craft.svg`
- `public/img/categories/food.svg`
- `public/img/categories/music.svg`
- `app/components/primitives/CategoryIcon.tsx` — selects by category slug.

**Implementation notes.**

- Icons ship at 128×128 viewBox. Downscale with CSS only.
- Sage forest stroke (`#2D5016`), 1.5px, with the category accent fill as
  noted in §2.2.3. No gradient, no drop shadow.
- Keep the SVG editable — text elements out, paths only, no embedded
  raster.

**Illustrator brief to attach to the commission.**

Paste §2 of this document (complete) plus the Master Plan §5.6 into the
brief. Require first round to include all five at thumbnail and one (the
illustrator picks which) at full finish. Revise, then finish the rest.

**Generative AI brief (if iterating before commission).**

Generate each icon with this template:

```
A hand-drawn, slightly loose line illustration in the style of 1970s U.S.
National Park brochures and REI co-op editorial, single-weight sage-forest
#2D5016 line at 1.5pt on a cream #F6F1E8 background, with one small flat
accent fill [CATEGORY ACCENT HEX]. Subject: [category brief from §2.2.3].
Composition: centered, roughly 80% of the 128px canvas. No gradients, no
drop shadows, no isometric perspective, no cartoon faces.
--ar 1:1 --style raw
```

**Acceptance criteria.**

- [ ] Five SVGs present and referenced from `CategoryIcon`.
- [ ] Each icon reads clearly at 24px (filter chip size) and at 128px.
- [ ] Color values match the palette exactly.

**Open questions.**

- Commission or AI-generate for v1? Document the decision in
  `docs/rfcs/RFC-0002-category-illustration-sourcing.md`.

---

### P0.8 Commission or source hero + skills-strip photography

**Owner:** Design-System Agent (asset sourcing)
**Depends on:** none
**References:** §2.1 of this playbook, Master Plan §5.6

**Goal.** Produce or license the hero photograph and the eight
skills-strip photographs.

**Files to create/modify.**

- `public/img/home/hero.jpg` (16:9, 2400×1350 and 1200×675 at 2x / 1x)
- `public/img/home/skills/*.jpg` (4:5, 1200×1500 at 2x / 600×750 at 1x)

**Implementation notes.**

- Use the specific briefs in §2.1.3 and §2.1.4. Each brief is precise
  enough to hand to a photographer OR feed to Midjourney / Firefly.
- Grade all images through a single preset so they look like one world.
- Provide the photographer with the Master Plan voice pillars (§5.2) so
  their direction matches.

**Acceptance criteria.**

- [ ] Every image meets §2.1.1 treatment.
- [ ] Every image has a model release if it's original photography.
- [ ] Every image has an accurate `alt` text written.

**Open questions.**

- Commission originals, source from Unsplash with careful curation, or
  generate with AI for the launch? Document in
  `docs/rfcs/RFC-0003-photography-sourcing.md`. Original photography is
  the long-term answer; curated stock is acceptable for first launch.

---

## 4. P1 prompts — Profiles, Explore, Safety

### P1.1 Profile schema RFC and migration

**Owner:** Product-Spec Agent (RFC) + Data/Auth Agent (migration)
**Depends on:** none
**References:** Master Plan §8.3, §8.4, §10

**Goal.** Align the Supabase profiles table with the Master Plan profile
model. Add what is missing.

**Files to create/modify.**

- `docs/rfcs/RFC-0004-profile-schema.md` (new) — RFC mapping current
  schema to required schema.
- `supabase/migrations/20260419_profiles_v2.sql` (new) — additive
  migration.

**Required fields to add (all nullable initially).**

- `display_pronouns text`
- `intro_line text` (the one-line intro)
- `skills_offered jsonb` — array of objects `{ skill, level, session_types,
  venues }`
- `skills_wanted jsonb` — array of objects `{ skill, note }`
- `venue_notes text`
- `safety_attestations jsonb` — array of `{ cert, self_attested_bool,
  proof_available_bool }`
- `availability jsonb` — 7×4 grid of booleans
- `map_accuracy text check (map_accuracy in ('block','neighborhood','city'))`
  default `'neighborhood'`
- `who_can_message text check (who_can_message in ('anyone','confirmed',
  'session_only'))` default `'anyone'`

**New linked tables.**

- `vouches` — `from_profile_id`, `to_profile_id`, `session_id`, `body text`,
  `created_at`. RLS: read-public, insert-by-participant-only, update-by-
  author-within-1-hour.

**Implementation notes.**

- Do not drop or rename existing columns in this migration.
- Preserve RLS patterns from current `profiles` policies.
- Add indexes on `skills_offered` using GIN, and on `to_profile_id` in
  `vouches`.

**Acceptance criteria.**

- [ ] RFC reviewed and merged.
- [ ] Migration applies cleanly to a fresh Supabase DB.
- [ ] Existing `/api/explore/discoverable` continues to return 200.

**Verification.**

```bash
npm run ready
# Supabase: apply migration, confirm schema diff, run existing API tests.
```

**Open questions.**

- Sessions table exists? If yes, confirm `vouches.session_id` FK target.

---

### P1.2 Public profile page

**Owner:** App-Shell Agent
**Depends on:** P1.1
**References:** Master Plan §8.3

**Goal.** Render the public profile with the sections from §8.3.

**Files to create/modify.**

- `app/explore/neighbor/[id]/page.tsx` — public profile view.
- `app/explore/neighbor/[id]/Profile.tsx` — the actual layout component.
- `src/lib/profileView.ts` — server-side query helpers.

**Layout (top to bottom).**

- Identity block: avatar, first name, neighborhood, pronouns, one photo.
- One-line intro.
- Skills offered.
- Skills wanted.
- Venue notes.
- Safety attestations.
- Vouches.
- Session count (offered / received).
- Availability snapshot.
- Request button (Clay, "Request a session").

**Implementation notes.**

- Never expose last name or exact address in this view. Map shows
  neighborhood-level, never block-level unless `map_accuracy = 'block'`.
- Avatar fallback uses the §2.2.4 component.
- Sessions-count is a display only, never a rank.

**Acceptance criteria.**

- [ ] No five-star rating appears.
- [ ] No response-rate metric appears.
- [ ] Direct linking to a profile works from the explore map.

**Verification.** `npm run ready` plus manual profile preview.

**Open questions.** None.

---

### P1.3 Profile edit

**Owner:** App-Shell Agent
**Depends on:** P1.1, P1.2
**References:** Master Plan §8.4

**Goal.** Build the edit view as a single scroll with section anchors.

**Files to create/modify.**

- `app/profile/edit/page.tsx`
- `app/profile/edit/sections/*.tsx` (Identity, SkillsOffered, SkillsWanted,
  Availability, Safety, Privacy)
- `app/api/profile/me/route.ts` — extend PATCH handler to accept the new
  fields.

**Implementation notes.**

- Each section has a "Preview as others see" link scrolling to a
  side-drawer `/preview` view.
- Skills offered and wanted use a typeahead combobox against a static
  `skills.json` seed file in `content/`.
- Avatar upload is deferred; keep the initials fallback for v1.

**Acceptance criteria.**

- [ ] Save returns 200 and updates the profile in Supabase.
- [ ] Error state matches the microcopy in Master Plan §Appendix A.
- [ ] Client-side validation prevents > 6 skills offered or wanted.

**Verification.** `npm run ready`.

**Open questions.** None.

---

### P1.4 Explore map improvements

**Owner:** Maps Agent
**Depends on:** P0.3 (for MapPin primitive), P0.7 (for pins and icons)
**References:** Master Plan §8.2, §2.3 of this playbook

**Goal.** Update `ExploreMap.tsx` so pins are category-colored, clustered
by neighborhood, and masked so exact addresses never render.

**Files to create/modify.**

- `app/components/ExploreMap.tsx` — update.
- `src/lib/maps/clustering.ts` — neighborhood clustering helper.
- `src/lib/maps/style.ts` — extract the warm Google Maps style into a
  typed constant.

**Implementation notes.**

- Pin color by category per §2.3.1.
- Selected state per §2.3.1.
- Clusters: show a count bubble in the dominant-category color. Clicking
  zooms in one level.
- Location privacy: jitter pins within a 400m radius if the profile's
  `map_accuracy` is `neighborhood`; 1000m if `city`.
- Keep feature flag `NEXT_PUBLIC_ENABLE_MAPS` gate — fall back to the
  list-only view when off.

**Acceptance criteria.**

- [ ] No exact address ever renders on the map.
- [ ] Toggling the flag off yields a clean list view with no console
      errors.
- [ ] Accessibility: map has a list-mode toggle with keyboard navigation.

**Verification.** `npm run ready`.

**Open questions.** None.

---

### P1.5 Explore filter bar and empty state

**Owner:** App-Shell Agent
**Depends on:** P0.3, P0.7
**References:** Master Plan §8.2, Appendix A

**Goal.** Build the filter bar and the explore empty state.

**Files to create/modify.**

- `app/explore/Filters.tsx`
- `app/explore/EmptyState.tsx`
- `app/explore/page.tsx` — wire in filters and empty state.

**Filter dimensions.**

- Skill category (segmented control with category icons).
- Specific skill (typeahead).
- Distance (5 / 10 / 25 / 50 miles + "Anywhere in view").
- Session type (Tip / Short / Walk-with).
- Venue (freeform chip input).
- Availability this week (chip list of weekdays × morning/midday/afternoon/
  evening).

**Empty state (copy verbatim).**

> No matches in view here. Widen your map, try a nearby town, or post a
> profile — we'll let you know when someone in range signs up.

With the §2.2.2 #2 illustration above the copy.

**Acceptance criteria.**

- [ ] Every filter reads/writes to URL params.
- [ ] Empty state copy matches Master Plan exactly.
- [ ] Mobile: filters collapse behind a single button.

**Verification.** `npm run ready`.

**Open questions.** None.

---

### P1.6 Safety hub pages

**Owner:** Product-Spec Agent (copy) + App-Shell Agent (pages)
**Depends on:** P0.3
**References:** Master Plan §8.9, §10

**Goal.** Build the Safety hub with tier-specific briefs and the waiver
landing page.

**Files to create/modify.**

- `app/safety/page.tsx`
- `app/safety/outdoor/page.tsx`
- `app/safety/home-diy/page.tsx`
- `app/safety/waiver/page.tsx`
- `content/safety/*.mdx` (one MDX file per subpage so copy is editable
  without JSX changes)

**Implementation notes.**

- Use `SafetyCallout` primitives liberally.
- The waiver page links to a static PDF in `public/legal/session-waiver.pdf`
  (to be added later by counsel; include a placeholder).
- Safety hub must be reachable from every page through the footer.

**Acceptance criteria.**

- [ ] All four pages render without optional flags (Maps / AI off).
- [ ] Copy matches the Master Plan exactly where quoted.

**Verification.** `npm run ready`.

**Open questions.**

- Counsel review of waiver language. Block `/safety/waiver` behind a
  "Coming soon" state until counsel signs off.

---

### P1.7 Community guidelines

**Owner:** Product-Spec Agent (copy) + App-Shell Agent (page)
**Depends on:** none
**References:** Master Plan §8.10

**Goal.** One simple page with the 9 numbered rules from §8.10.

**Files to create/modify.**

- `app/community-guidelines/page.tsx`
- `content/community-guidelines.mdx`

**Implementation notes.**

- Long-form body can use Source Serif 4 (if §1.2's long-form family is
  loaded).
- No imagery on this page — rules stand alone.

**Acceptance criteria.**

- [ ] All 9 rules present and worded exactly as in the Master Plan.
- [ ] Page is linkable from footer and from reporting flows.

**Verification.** `npm run ready`.

**Open questions.** None.

---

### P1.8 Content directory extraction

**Owner:** Stability Agent
**Depends on:** any P0 or P1 prompt that hard-codes copy
**References:** Master Plan §14

**Goal.** Establish `content/` as the canonical copy store so agents can
edit copy without touching JSX.

**Files to create/modify.**

- `content/home.mdx`
- `content/about.mdx`
- `content/philosophy.mdx`
- `content/safety/*.mdx`
- `content/community-guidelines.mdx`
- `content/microcopy.json` — structured strings for empty states,
  confirmations, errors, notifications.
- `src/lib/content/index.ts` — typed loader.

**Implementation notes.**

- MDX for prose pages, JSON for short strings.
- Include a `scripts/check-copy.ts` that fails if any hard-coded string
  over 40 characters exists in `app/` files other than primitives.

**Acceptance criteria.**

- [ ] All prompts P0.6, P1.6, P1.7 consume from `content/`.
- [ ] `npm run check-copy` passes.

**Verification.** `npm run ready`.

**Open questions.** None.

---

## 5. P2 prompts — Credits and Sessions

### P2.1 Credits domain RFC

**Owner:** Product-Spec Agent
**Depends on:** none
**References:** Master Plan §9

**Goal.** Produce `docs/rfcs/RFC-0005-credits-domain.md` covering wallet,
ledger, idempotency, early-adopter grant, gift caps, non-marketplace
framing.

**Deliverables.**

- Data model for `credits_wallet` (1:1 with profile) and `credits_ledger`
  (append-only).
- State diagram for credit movement (request, accept, settle, cancel,
  no-show).
- Idempotency strategy (every movement keyed by `session_id + phase`).
- Rules for the early-adopter grant (flagged by `NEXT_PUBLIC_FREE_SEED_PHASE`).
- Rules for gift caps (3 per recipient/month, 10 per sender/month).
- Rules for pay-it-forward (negative-balance acceptance path).
- Explicit statement: credits never expire; there is no dollar display
  anywhere in the app during the seed phase.

**Acceptance criteria.**

- [ ] RFC reviewed by Owner and merged before P2.2 starts.

**Open questions.**

- Stripe wiring — behind a flag at RFC time, implementation deferred.

---

### P2.2 Credits schema migration

**Owner:** Data/Auth Agent
**Depends on:** P2.1
**References:** RFC-0005

**Files to create/modify.**

- `supabase/migrations/20260426_credits.sql` — create `credits_wallet`,
  `credits_ledger`, necessary triggers for balance derivation or
  materialized balance.
- RLS: wallet reads restricted to owner; ledger reads restricted to
  participants.

**Acceptance criteria.**

- [ ] Migration applies cleanly.
- [ ] Supabase RLS policies tested via `supabase test`.

**Open questions.** None.

---

### P2.3 /credits page

**Owner:** App-Shell Agent
**Depends on:** P0.3, P2.2
**References:** Master Plan §8.6

**Goal.** Balance / Ledger / Gift tabs.

**Files to create/modify.**

- `app/credits/page.tsx`
- `app/credits/Balance.tsx`, `Ledger.tsx`, `Gift.tsx`
- `app/api/credits/*` routes for balance, ledger, gift.

**Implementation notes.**

- Balance tab: large Clay numeral, subcopy ("That is enough for about X
  short sessions.").
- Ledger tab: timeline with human labels. Filter by incoming/outgoing.
- Gift tab: form with recipient search, amount (1–3), short note.
- Free-for-early-adopters banner appears if
  `process.env.NEXT_PUBLIC_FREE_SEED_PHASE === 'true'`.

**Acceptance criteria.**

- [ ] No dollar sign anywhere on the page during seed phase.
- [ ] Gift caps enforced client- and server-side.

**Verification.** `npm run ready`.

**Open questions.** None.

---

### P2.4 Session lifecycle RFC

**Owner:** Product-Spec Agent
**Depends on:** P2.1
**References:** Master Plan §8.5, §11

**Goal.** RFC-0006 with state machine, messages model, waiver storage,
safety-tier gating, and settle flow.

**Acceptance criteria.**

- [ ] RFC reviewed and merged before P2.5.

---

### P2.5 Sessions schema

**Owner:** Data/Auth Agent
**Depends on:** P2.4

**Files to create/modify.**

- `supabase/migrations/20260503_sessions.sql`
- Create `sessions`, `session_messages`, `waiver_acknowledgements`,
  `session_venues` tables.

**Acceptance criteria.**

- [ ] RLS covers participant-only access for messages and waivers.

---

### P2.6 Session UI

**Owner:** App-Shell Agent
**Depends on:** P2.5, P0.3

**Files to create/modify.**

- `app/sessions/page.tsx` — list.
- `app/sessions/[id]/page.tsx` — detail view with timeline, prep
  checklist, safety brief, messaging.
- `app/sessions/new/page.tsx` — request flow.

**Implementation notes.**

- Safety tier is derived from the skill, not user-set.
- Tier 3 gates: prerequisite checklist before the request can be sent.
- Tier 4 skills are blocked entirely at the picker.

**Acceptance criteria.**

- [ ] Full flow from request → accept → settle round-trip works in
      preview.
- [ ] Credits move on settlement, never on request.

**Verification.** `npm run ready` plus end-to-end smoke on preview.

---

## 6. P3 prompts — Onboarding and messaging

### P3.1 Six-step signup

**Owner:** App-Shell Agent
**Depends on:** P1.1, P2.3 (for welcome credit)
**References:** Master Plan §8.7

**Goal.** Rebuild `/signup` as a 6-step wizard with skip-and-return.

**Files to create/modify.**

- `app/(auth)/signup/page.tsx`
- `app/(auth)/signup/steps/*.tsx`

**Implementation notes.**

- Each step has its own route segment for back/forward via browser.
- On completion, credit 3 welcome credits immediately, and queue a 10-
  credit early-adopter grant if the seed-phase flag is on.

**Acceptance criteria.**

- [ ] Median time-to-first-profile under 3 minutes in usability test.
- [ ] Abandoned signups can resume from last step via email link.

---

### P3.2 Messages + notifications

**Owner:** App-Shell Agent
**Depends on:** P2.5

**Files to create/modify.**

- `app/messages/page.tsx`
- `app/messages/[id]/page.tsx`
- `app/notifications/page.tsx`

**Implementation notes.**

- Messages are scoped to an accepted or pending session, never free-form.
- Notifications follow the voice patterns in Master Plan Appendix A.

**Acceptance criteria.**

- [ ] Messages deliver realtime via Supabase channels.
- [ ] Notifications are both in-app and (opt-in) email.

---

## 7. Cross-cutting (X.\*)

### X.1 Feature flag harness

**Owner:** Stability Agent
**Depends on:** none

**Goal.** Central, typed feature-flag module.

**Files to create/modify.**

- `src/lib/flags.ts` — read from `NEXT_PUBLIC_*` env vars, return typed
  flag object. Defaults are safe (integrations off, seed-phase on).
- Replace scattered `process.env.NEXT_PUBLIC_*` reads with `flags.maps`,
  `flags.ai`, `flags.seedPhase`, `flags.credits`.

**Acceptance criteria.**

- [ ] `npm run build` passes with every flag off.
- [ ] Unit test proves flags defaults are safe.

---

### X.2 Accessibility baseline

**Owner:** Stability Agent
**Depends on:** P0.4

**Goal.** Install axe-core in CI and set a passing baseline on `/design/
preview`, `/`, `/explore`, `/safety`.

**Files to create/modify.**

- `scripts/a11y.mjs`
- CI job (GitHub Actions) that runs axe on preview deploys.

**Acceptance criteria.**

- [ ] Zero critical violations on the listed pages.

---

### X.3 Copy-guard script

**Owner:** Stability Agent
**Depends on:** P1.8

**Goal.** Prevent hard-coded long strings from slipping into JSX by CI.

**Files to create/modify.**

- `scripts/check-copy.ts` — fails the build if any JSX file contains a
  string literal over 40 chars outside an allowlisted set of paths.

**Acceptance criteria.**

- [ ] `npm run check-copy` is part of `npm run ready`.

---

## 8. Handoff checklist

Every PR landing from a prompt in this file must include:

- The Master Plan sections it implements (by number).
- Screenshots or short Looms for any visual surface.
- Results of `npm run check-env && npm run lint && npm run build`.
- The §1.4 voice check — no forbidden words, no retired tagline.
- Any new copy stored in `content/`, not in JSX.
- Any new imagery cited against §2 of this playbook.

---

## 9. Reference index

- Master Plan: `docs/Dabble-Master-Plan.docx`
- Agent operating guide: `AGENTS.md`
- Agent handoff template: `docs/AGENT_HANDOFF_TEMPLATE.md`
- Agent task queue: `docs/AGENT_TASK_QUEUE.md`
- Agent prompt templates (short-form): `docs/AGENT_PROMPTS.md`
- Phase 1 scope: `docs/PHASE_1_SCOPE.md`
- Phase status: `docs/PHASE_STATUS.md`
- QA checklist: `docs/QA_CHECKLIST.md`
