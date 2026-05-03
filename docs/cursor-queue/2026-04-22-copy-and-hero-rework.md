# Cursor queue — Copy cleanup + hero rework

**Created:** 2026-04-22
**Updated:** 2026-04-23 — Prompt 1 narrowed to just the H1 + metadata tagline swap (other copy kept as-is). Prompt 4 rewritten around a new hero concept: a hand-drawn pencil illustration of two people swapping skills (fly fishing for drywall). Step 0 added to spell out the image-generation workflow that must run before Prompt 4.
**Goal:** (1) Swap the landing H1 + metadata to `"Try something new, wherever you are."`. (2) Replace the line-art `HeroIllustration` SVG with a real pencil drawing that conveys a concrete skill exchange. (3) Leave the rest of the copy sweep (Prompts 2–3, 5) for a later pass unless you want to run them too.

Run these prompts in order. Each one is scoped to a single concern so you can
review and merge (or revert) independently. After all five, run Prompt 6 to
verify nothing regressed.

---

## Step 0 — Generate the hero PNG (human-in-the-loop, NOT a Cursor prompt)

Prompt 4 replaces the current SVG with a `next/image` tag pointing to a real PNG on disk. That PNG does not yet exist — you need to generate it first using an AI image tool (Midjourney, DALL·E 3, Sora, Flux, Gemini Imagen, Ideogram, etc.) or commission it from an illustrator. Cursor cannot generate images — this step is on you.

### Primary generation prompt (paste into your image tool)

> A hand-drawn graphite pencil illustration on warm off-white paper, showing a friendly, informal skill exchange between two adults standing outdoors on a calm afternoon. Two figures face each other mid-gesture, making soft eye contact, trading tools in the middle of the frame.
>
> **On the left:** a person in jeans and a paint-flecked work shirt, hair tied back, sleeves rolled, mid-step forward. They are handing a drywall taping knife (a wide flat trowel with a wooden handle) and a small square patch of drywall to the person opposite. A mud pan sits near their feet.
>
> **On the right:** a person in a vest and rolled-cuff pants, a small tackle box at their feet, holding out a fly-fishing rod in exchange. The rod is long and tapered with visible line guides, a fly reel on the handle, and a tuft of feathered dry fly dangling from the leader at the tip.
>
> Both figures have warm, natural body language — relaxed shoulders, slight smiles, present in the moment. They are not posed; they are mid-exchange.
>
> **Medium and style:** pure graphite pencil on textured ivory paper. Loose, confident sketch lines. Visible pencil strokes and soft cross-hatching for shading on clothes and tools. Slight imperfection in the linework — the feel of a real sketchbook drawing, not a digital vector. No color whatsoever — only graphite tones from near-white to soft charcoal. The warmth comes from the paper (ivory, around `#f5ede0`), not from hue. Editorial-magazine illustration style — think The New Yorker, Orion, The Atlantic, New York Review of Books. Warm, human, un-slick.
>
> **Composition:** both figures occupy the middle two-thirds of the frame horizontally, with a little breathing room above and below. Background is very minimal — a few loose pencil lines suggesting grass or a wooden porch step underfoot, maybe a faint horizontal line suggesting a river or a wall behind them, deliberately left unfinished like a sketch. No detailed landscape, no buildings, no text.
>
> **Format:** 4:3 landscape aspect ratio, at least 1600 × 1200 pixels, crisp high-resolution linework suitable for a website hero.
>
> **Avoid:** color, ink outlines, digital vector look, flat cel-shading, cartoon style, anime, 3D render, photographic realism, stock-illustration look, text, writing, signatures, watermarks, logos, harsh black outlines.

### Tool-specific appendages

- **Midjourney v6/v7:** append ` --ar 4:3 --stylize 250 --no color text watermark` and run with `--style raw` if the default adds too much flair.
- **DALL·E 3 / ChatGPT:** set aspect ratio to **Landscape**, paste the prompt unchanged. Ask for 2–3 variants in one request to compare.
- **Flux / Ideogram:** paste as-is; both respect detailed natural-language prompts. Flux Dev 1.1 is currently the strongest at pencil-texture realism.
- **Sora image mode / Gemini Imagen 3:** paste as-is; select 4:3 output if the UI offers it.

### Variations to try if the first pass doesn't land

If the primary prompt produces something too illustrative, too children's-book, or too posed, iterate with these:

- **Tighter crop on the exchange:** swap the composition line to *"Tight half-body composition, cropped at the waist — both pairs of hands clearly visible mid-exchange, the trowel and drywall patch passing in one direction, the fly rod passing in the other, a slight overlap where the tools cross."*
- **More environmental detail:** swap the composition line to *"The two figures stand at the edge of a slow river — water suggested by a few horizontal pencil strokes behind them, a half-sketched wooden fence or drying rack nearby."*
- **Softer, looser linework:** append *"even looser, more gestural lines, like a quick life-drawing study — some lines doubled or traced, the mark-making clearly visible."*
- **Sketchbook-page feel:** append *"the edges of the drawing fade into the paper grain — no clean rectangular border, just a naturally-ending sketch."*

### Post-generation steps

1. Pick the variant you want and download the highest-resolution PNG available.
2. Save it to `public/design/concepts/Dabble-hero-exchange.png`. (Use this exact filename — Prompt 4 expects it.)
3. Keep the original AI-tool output file separately for reference / future iteration.
4. Only after the PNG is saved and you've spot-checked it at ~26rem preview width, run Prompt 4.

---

## Prompt 1 — Homepage tagline swap (narrow)

> **Task:** Swap the landing H1 from `"Learn something new from the block next door"` to `"Try something new, wherever you are."`. Update the page's `metadata.description` so the first clause reflects the new tagline. **Do not touch any other copy on the landing page** — no changes to the `ui-label`, no rewrites of the intro paragraph or the benefit line, no CTA renames, no illustration-caption deletion. A broader copy sweep is intentionally queued separately.
>
> **Specific changes in `app/page.tsx`:**
> 1. Replace the H1 text (currently `"Learn something new from the block next door"`, around line 24) with `"Try something new, wherever you are."` — keep the exact same JSX structure and `className` attributes on the `<h1>`.
> 2. In the `metadata` export at the top of the file (around line 5–8), replace the description string. Currently it begins `"Learn something new from the block next door —"`. Change that opening clause so it matches the new H1, e.g.:
>    ```ts
>    description:
>      "Try something new, wherever you are — Dabble connects people who want to teach what they love with people who are curious. Clear profiles, small credits, calm meetups.",
>    ```
>    Keep the rest of the sentence unchanged from the current description (same "Dabble connects / Clear profiles / calm meetups" wording). Only the opening clause moves.
> 3. Leave every other line in `app/page.tsx` untouched.
>
> **Acceptance:**
> - `npm run lint` passes
> - `npm run build` passes
> - `grep -n "Learn something new from the block next door" app/page.tsx` returns no hits
> - `grep -n "Try something new, wherever you are" app/page.tsx` returns exactly two hits (the H1 and the metadata.description)
> - Diff is under 10 lines total
>
> **Guardrails:** single-concern PR, per AGENTS.md. No secrets in NEXT_PUBLIC_*. Do not run any codemods or formatters that would touch other files.

---

## Prompt 2 — Explore page hero copy

> **Task:** Change the `/explore` hero tagline to **"Find Dabblers close by."**
>
> **Specific changes:**
> 1. In `app/explore/page.tsx`, find the hero block near the bottom of `ExplorePageInner` (around line 640) that currently reads:
>    ```tsx
>    <p className="ui-label">Explore</p>
>    <h1 className="ui-heading text-4xl md:text-5xl">Neighbors worth meeting</h1>
>    ```
>    Replace the H1 text with `Find Dabblers close by.` Keep the `ui-label` as `Explore`.
> 2. Scan the rest of this file for "Neighbors" / "neighbor" in visible copy that specifically refers to people in search results — change those to "Dabblers" where it reads as product noun. Leave phrases like "Neighborhood" (the filter/geographic concept) untouched.
> 3. If the empty-state H2 reads `"No neighbors here yet"`, change to `"No Dabblers here yet."`
> 4. If the no-match H2 reads `"Nothing matches here"`, leave it — that's not a noun swap.
> 5. Update `metadata.title` / `metadata.description` for `/explore` (in the same file or the layout) so search engines see the same language.
>
> **Acceptance:**
> - `npm run lint` passes
> - `npm run build` passes
> - `grep -n "Neighbors worth meeting" app/explore/page.tsx` returns nothing
> - The new H1 appears exactly once in the file
> - "Dabblers" is the noun used for results in empty states and cards
>
> **Guardrails:** do not rename the `Neighborhood` filter. Keep the spelled-out noun "Dabblers" (not "dabbler's" possessive).

---

## Prompt 3 — About page de-vibe

> **Task:** Remove metaphorical and design-note language from `app/about/page.tsx` while keeping the founder story and the values grid.
>
> **Specific changes:**
> 1. Replace the opening header block (currently H1 `"Wherever you are"` plus the two lead paragraphs about "traveling serendipity" and "gig marketplace") with a short, plain mission statement. Draft:
>    ```
>    H1: About Dabble
>    Lead: Dabble helps people nearby teach what they love and try
>    something new together — no app-store hustle, no gig marketplace,
>    no course catalog. Just a clear profile, a small credit system,
>    and a way to meet a real person on your block or the one next door.
>    ```
> 2. Delete the entire `"Curiosity is portable"` section (H2 + both paragraphs). The metaphor is design-doc writing.
> 3. Keep the founder-story paragraph that starts `"Dabble began on snow..."` — move it under a new H2 `"Why we built it"`.
> 4. Keep the values grid (Curiosity / Calm / Care / Credit-not-cash) unchanged.
> 5. In the `"Who is building this"` section, replace the line `"keeping the product as human as the meetups it is meant to support"` with something concrete like `"and keeping the product simple."`
> 6. Update the `metadata.description` to match the new plain mission.
>
> **Acceptance:**
> - `npm run lint` passes
> - `npm run build` passes
> - The phrases `"Curiosity is portable"`, `"roots and roam"`, `"traveling serendipity"`, `"pack questions the way you pack a jacket"`, and `"repeat faces on familiar sidewalks"` do not appear anywhere in `app/about/page.tsx`
> - The founder-story paragraph about fly-casting and the ski trip is preserved

---

## Prompt 4 — Replace homepage hero illustration with the pencil drawing

> **Prerequisite:** Step 0 of this queue must be complete. The PNG must already exist at `public/design/concepts/Dabble-hero-exchange.png` — if it doesn't, stop and generate the image first. Do not fall back to an older concept file.
>
> **Task:** Swap the inline SVG line-art `HeroIllustration` on the homepage for the new pencil-drawn skill-exchange image, served through `next/image` and pre-compressed to WebP.
>
> **Specific changes:**
> 1. **Verify the source file exists.** Before editing any code:
>    ```
>    ls -lh public/design/concepts/Dabble-hero-exchange.png
>    ```
>    If the file is missing or is a zero-byte placeholder, abort this prompt and surface the error. Do not swap in a substitute image.
> 2. **Read the PNG's intrinsic dimensions** so the `<Image>` width/height are correct (Next.js requires exact ratios for layout stability). Install `sharp` as a dev dep if not already present (`npm i -D sharp`), then:
>    ```
>    node -e "require('sharp')('public/design/concepts/Dabble-hero-exchange.png').metadata().then(m => console.log(m.width, m.height))"
>    ```
>    Record the two numbers. They feed into step 4.
> 3. **Pre-compress the PNG to WebP.** Pencil drawings compress very well at high quality; aim for under 300 KB:
>    ```
>    npx sharp-cli -i public/design/concepts/Dabble-hero-exchange.png \
>      -o public/design/concepts/Dabble-hero-exchange.webp \
>      --resize 1600 \
>      --webp-quality 85
>    ```
>    If the resulting file is over 500 KB, retry with `--webp-quality 78`. Commit both the PNG (master) and the WebP (served) so future passes can re-derive the WebP if quality settings change.
> 4. **In `app/page.tsx`:** remove the `import { HeroIllustration } from "@/app/components/HeroIllustration"` line and replace the `<HeroIllustration />` usage with a `next/image` `<Image>` tag using the WebP as `src`:
>    ```tsx
>    import Image from "next/image";
>    ...
>    <Image
>      src="/design/concepts/Dabble-hero-exchange.webp"
>      alt="Pencil drawing of two people swapping skills — one handing over a drywall trowel, the other offering a fly-fishing rod."
>      width={/* intrinsic px from step 2 */}
>      height={/* intrinsic px from step 2 */}
>      priority
>      sizes="(min-width: 1024px) 26rem, 100vw"
>      className="h-auto w-full rounded-2xl"
>    />
>    ```
>    Use the exact `width` and `height` captured in step 2 (not the resized 1600 — the intrinsic of the source PNG). Next.js computes the layout ratio from these and the `sizes` hint handles responsive selection.
> 5. **Delete `app/components/HeroIllustration.tsx`** — it's only used on this one page and we're ripping it out. First confirm no other file imports it:
>    ```
>    grep -rn "HeroIllustration" app/ lib/ src/
>    ```
>    Only the import line in `app/page.tsx` (being removed) should match. If anything else does, stop and surface it rather than deleting.
> 6. Keep the wrapping `<div className="w-full max-w-[26rem] rounded-3xl border …">` card exactly as-is. The existing italic caption paragraph below the illustration (`"Illustration: homes, paths, and a small exchange…"`) is out of scope for this prompt — leave it for now; it'll be handled by a later copy-sweep prompt.
>
> **Acceptance:**
> - `npm run lint` passes
> - `npm run build` passes
> - The homepage renders the pencil drawing (not the SVG line drawing) above the fold on `/`
> - The WebP served to browsers is under 500 KB (hard cap; under 300 KB preferred)
> - No `HeroIllustration` import remains anywhere in the repo
> - `next build` reports no warnings about the image — in particular no "missing width/height" or "aspect ratio mismatch" warnings
> - Lighthouse performance on `/` desktop does not regress by more than 3 points vs. pre-change
>
> **Guardrails:** don't add npm deps beyond `sharp` and `sharp-cli`. Don't modify `next.config.ts` — the image is a local asset. Don't touch the `<HeroIllustration>`'s parent card layout; changing card dimensions is a separate concern. Don't inline the image as a base64 data URI; keep it a real file.

---

## Prompt 5 — Sweep for residual design-note language

> **Task:** Remove any remaining vibe/design-doc language from user-facing pages that Prompts 1–3 didn't already cover.
>
> **How to find it:**
> Run these greps from repo root and review each hit — remove or rewrite when the match is in *visible copy* (JSX string literals, metadata text), keep when the match is in a prop name, class, comment, or spec doc:
>
> ```
> git grep -n -i "editorial" -- 'app/**/*.tsx' 'app/**/*.ts'
> git grep -n -i "calm " -- 'app/**/*.tsx'
> git grep -n -i "gentle" -- 'app/**/*.tsx'
> git grep -n -i "vibe" -- 'app/**/*.tsx'
> git grep -n -i "curiosity is portable" -- 'app/**/*.tsx'
> git grep -n -i "hand to hand" -- 'app/**/*.tsx'
> git grep -n -i "traveling serendipity" -- 'app/**/*.tsx'
> git grep -n "shape of a block" -- 'app/**/*.tsx'
> ```
>
> **Specific known hits to also address:**
> - `app/safety/page.tsx` and `app/guidelines/page.tsx` — spot-check their hero paragraphs for the same kind of design-speak; apply the same plainer-language treatment if you find it.
> - `app/design/preview/page.tsx` — this is a designer-only preview route. Add a check so it returns `notFound()` in production (`process.env.NODE_ENV === "production"`). Design notes there shouldn't be indexable.
> - The `HeroIllustration` SVG comment `"editorial line-art style"` — moot if Prompt 4 deleted the file; skip if so.
>
> **Acceptance:**
> - `npm run lint` and `npm run build` pass
> - No JSX string contains `"editorial"`, `"curiosity is portable"`, `"roots and roam"`, `"traveling serendipity"`, or the illustration caption
> - `/design/preview` returns 404 when `NODE_ENV === "production"`
> - Supply a short changelog in the PR body listing every removed phrase with its former file:line

---

## Prompt 6 — Verify the whole queue

> **Task:** Local verification pass before merging any of the above PRs to main.
>
> Run from repo root:
> ```
> npm run ready
> npm run dev
> ```
> Then manually check:
> - `/` — H1 is `Try something new, wherever you are.`, real image above fold, no caption, no "calm/gentle" copy
> - `/explore` — H1 is `Find Dabblers close by.`, empty state uses "Dabblers"
> - `/about` — H1 is `About Dabble`, no "portable curiosity" language, founder story intact
> - `/design/preview` — 404 in production build, still reachable in dev
> - No new TypeScript, ESLint, or `next build` warnings vs. the current main
> - Lighthouse on `/` desktop is at least on par with pre-change (the new image should be `priority` and `sizes` should prevent CLS regression)
>
> If all green, merge each prompt's branch to main in order 1 → 5, then push. Vercel auto-deploy handles the rest.
