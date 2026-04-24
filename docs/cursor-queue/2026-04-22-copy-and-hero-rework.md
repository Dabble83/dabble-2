# Cursor queue — Copy cleanup + hero rework

**Created:** 2026-04-22
**Goal:** Strip internal design/vibe language from public-facing copy, set new
hero taglines on the homepage and `/explore`, and replace the line-art hero
illustration on the homepage with a real image.

Run these prompts in order. Each one is scoped to a single concern so you can
review and merge (or revert) independently. After all five, run Prompt 6 to
verify nothing regressed.

---

## Prompt 1 — Homepage hero copy

> **Task:** Rework the hero on `app/page.tsx` so the first thing a visitor sees is the tagline **"Try something new, wherever you are."** Strip internal design/vibe language from the copy.
>
> **Specific changes:**
> 1. Replace the H1 (currently `"Learn something new from the block next door"`) with `"Try something new, wherever you are."`
> 2. Delete the `ui-label` line `"A gentle place to learn and share"` — it reads like a design note.
> 3. Rewrite the intro paragraph under the H1 so it's one plain sentence about what Dabble does — no metaphors, no "calm/gentle/editorial" language. Draft: *"Dabble connects people nearby who want to teach what they love with people who are curious to try something new — bread, bikes, music, repair, and everything in between."*
> 4. Replace the paragraph starting `"No hustle, no leaderboard — just clear profiles, calm layouts..."` with a plain benefit line — e.g. *"Clear profiles, small credits, no hustle."* Drop `"calm layouts"` specifically; that's a design descriptor, not product copy.
> 5. Delete the italic caption under the illustration (`"Illustration: homes, paths, and a small exchange..."`). That's literal design criticism in the UI.
> 6. Keep both CTAs (`Start your profile`, `Browse neighbors`) — but change `"Browse neighbors"` to `"Find Dabblers close by"` to match the new `/explore` tagline.
>
> **Acceptance:**
> - `npm run lint` passes
> - `npm run build` passes
> - The word "calm" does not appear in `app/page.tsx`
> - The word "gentle" does not appear in `app/page.tsx`
> - No illustration caption remains
> - H1 text matches exactly: `Try something new, wherever you are.`
>
> **Guardrails:** per AGENTS.md, small PR, verification commands run, no secrets in NEXT_PUBLIC_*.

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

## Prompt 4 — Replace homepage hero illustration with a real image

> **Task:** Swap the inline SVG line-art `HeroIllustration` on the homepage for a proper image. Use the existing concept at `public/design/concepts/Dabble-Landing-Concept.png` served via `next/image`, optimized.
>
> **Specific changes:**
> 1. In `app/page.tsx`: remove the `import { HeroIllustration } from "@/app/components/HeroIllustration"` line and replace the `<HeroIllustration />` usage with a `next/image` `<Image>` tag:
>    ```tsx
>    import Image from "next/image";
>    ...
>    <Image
>      src="/design/concepts/Dabble-Landing-Concept.png"
>      alt="Two people sharing a skill outdoors, illustrated."
>      width={1200}
>      height={900}
>      priority
>      sizes="(min-width: 1024px) 26rem, 100vw"
>      className="h-auto w-full rounded-2xl"
>    />
>    ```
>    Pick the actual intrinsic `width` and `height` from the PNG — use `node -e "const s = require('sharp'); s('public/design/concepts/Dabble-Landing-Concept.png').metadata().then(m => console.log(m.width, m.height))"` (install sharp as a dev dep if not present).
> 2. The landing PNG is ~2.5 MB, which is too heavy. Pre-compress it to WebP at a sensible size:
>    ```
>    npx sharp-cli -i public/design/concepts/Dabble-Landing-Concept.png \
>      -o public/design/concepts/Dabble-Landing-Concept.webp \
>      --resize 1600 \
>      --webp-quality 82
>    ```
>    Then update the `src` to the `.webp` path. Keep the PNG in the repo for now (it may be referenced elsewhere) but switch the hero to the WebP.
> 3. Delete `app/components/HeroIllustration.tsx` — it's only used on this one page and we're ripping it out.
> 4. Confirm no other file imports `HeroIllustration` before deletion (`grep -r HeroIllustration app/` — should return only the page.tsx import we're removing).
> 5. Update the wrapping card: keep the existing rounded outer container but remove the illustration caption (already planned in Prompt 1; if that prompt ran first, this step is a no-op).
>
> **Acceptance:**
> - `npm run lint` passes
> - `npm run build` passes
> - The homepage renders an actual image (not an SVG line drawing) above the fold on `/`
> - The WebP source is under 500 KB
> - No `HeroIllustration` import remains anywhere
> - `next build` reports no warnings about the image (missing dimensions, etc.)
>
> **Guardrails:** don't add unnecessary npm deps beyond `sharp` (and only if needed for compression). Don't touch `next.config.ts` image domains — the image is local.

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
