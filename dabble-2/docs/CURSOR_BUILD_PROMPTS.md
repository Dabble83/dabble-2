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

### §2 Imagery

Use placeholder components only until assets exist; do not generate photography in build pipelines.

### §3 Phase P0

- **P0.1** — Brand palette + type scale variables in `app/globals.css` `:root`, with existing `--brand*` tokens aliased to sage family so older styles keep working.
- **P0.2** — Fraunces (display, 400/500/600) + Inter (body, 400/500/600) via `next/font/google`, exposed as `--font-display` and `--font-sans`; wire into `@theme inline`; body uses Inter (`var(--font-sans)`).
