# Cursor build prompts

Brand, type, imagery briefs, and phased build checklist for Dabble 2.0 implementation in this repo.

## §1 Brand Reference Sheet

### §1.2 Full brand palette (CSS custom properties)

| Token | Hex | Role |
|-------|-----|------|
| `ink` | `#1c2424` | Primary text |
| `sage` | `#6d8570` | Primary brand / CTAs |
| `sage-dark` | `#4d5c4d` | Borders on sage, pressed states |
| `sage-hover` | `#5f745f` | Hover on sage surfaces and links |
| `clay` | `#d4c4b0` | Secondary surfaces, outline CTAs |
| `clay-dark` | `#b8a794` | Clay hover / stronger clay accent |
| `ember` | `#c4705a` | Rare emphasis only |
| `forest` | `#2a3d2c` | Deep green accents, links on cream |
| `cream` | `#f4f0e6` | Page background |
| `stone` | `#6b736b` | Secondary / tertiary text |
| `rule` | `#e2ddd4` | Hairlines, dividers |

### §1.3 Type scale (CSS custom properties)

| Token | Size |
|-------|------|
| `--fs-display` | `clamp(2.5rem, 2rem + 2vw, 3.5rem)` |
| `--fs-h1` | `clamp(2rem, 1.5rem + 1.5vw, 2.75rem)` |
| `--fs-h2` | `clamp(1.625rem, 1.35rem + 1vw, 2rem)` |
| `--fs-h3` | `1.375rem` |
| `--fs-h4` | `1.125rem` |
| `--fs-body` | `1rem` |
| `--fs-small` | `0.875rem` |
| `--fs-micro` | `0.75rem` |

### §1.5 Voice (product tone)

**Do**

- Write in plain, neighborly language: short sentences, concrete verbs, human warmth.
- Prefer calm invitations (“Share what you love”, “Try a session”) over performance framing.
- Name the benefit to the block or community, not abstract “growth” or “optimization”.
- Use “dabblers” when a collective noun fits; otherwise say “neighbors” or “people”.

**Don’t**

- Use hustle culture, fake urgency, or scarcity tricks (“Only 2 spots left!!!”).
- Sound like a marketplace, gig platform, or SaaS growth blog (“leverage”, “rockstar”, “10x”).
- Shame incomplete profiles or use guilt to drive engagement.
- Promise outcomes you cannot stand behind; stay honest and local.

### §2 Imagery

Use placeholder components only until assets exist; do not generate photography in build pipelines.

### §2.3 Map pin colors

Pins and map affordances use the brand palette so the map feels like the rest of Dabble.

| Role | Token | Hex | Notes |
|------|-------|-----|--------|
| Default / general | `sage` | `#6d8570` | Standard dropped pin |
| Selected / focus | `forest` | `#2a3d2c` | Active selection, strong contrast on cream tiles |
| Offering / “guide” emphasis | `sage-dark` | `#4d5c4d` | Hosting or teaching context |
| Seeking / “want” emphasis | `clay-dark` | `#b8a794` | Learning or seeking context |
| Attention / rare warning on map | `ember` | `#c4705a` | Use sparingly; not for routine pins |
| Muted / cluster / low confidence | `stone` | `#6b736b` | Clusters, disabled, background pins |

### §3 Phase P0

- **P0.1** — Brand palette + type scale variables in `app/globals.css` `:root`, with existing `--brand*` tokens aliased to sage family so older styles keep working.
- **P0.2** — Fraunces (display, 400/500/600) + Inter (body, 400/500/600) via `next/font/google`, exposed as `--font-display` and `--font-sans`; wire into `@theme inline`; body uses Inter (`var(--font-sans)`).
- **P0.3** — `/design/preview` is the stakeholder-facing brand reference: palette swatches with hex + usage, type specimen (Fraunces + Inter + scale tokens), map pin colors (§2.3), voice do/don’t (§1.5), and category icon placeholders.
- **P0.4** — UI kit in `app/components/ui.tsx`: button variants (primary sage, secondary clay outline, ghost, destructive), card variants, text field primitives (`TextInput`, `Textarea`, `TagInput`), composed only on the preview page via those exports (no ad-hoc inline styles on the page).
- **P0.5** — Canonical marketing home at `app/page.tsx`: hero matches Master Plan §5.1 (eyebrow, H1, subhead, dual CTAs); retire superseded taglines (see §5.1 “Retired”).
- **P0.6** — Home below-the-fold modules: category deep-links to Explore (`/explore?category=…`), credits explainer with link to `/how-it-works`, testimonial placeholder (`TestimonialRow`, Master Plan §5.6).
