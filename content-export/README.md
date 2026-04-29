# Editing dabble.it.com text in Word

This folder is the bridge between the live site and Word. It lets you edit
every piece of public-facing text on dabble.it.com without touching code.

## How it works

```
content-export/
  manifest.json         ← source of truth (don't edit by hand)
  pages/                ← Word docs, one per page (open these to edit)
  edits-inbox/          ← drop edited Word docs here when you're done
```

1. **Open a doc.** Each page on dabble.it.com has its own Word file in
   `content-export/pages/` — `about.docx`, `home.docx`, etc.
2. **Edit normally.** Type new text. Make things bold, italic, or add a link
   the way you would in any Word document. The site will pick those up.
3. **Don't delete the small grey lines** that look like `[id: about.hero.heading]`.
   Those are how Claude knows where each piece of text lives in the code.
   If you accidentally delete one, just say so — Claude can put it back.
4. **Save the file** and drop it in `content-export/edits-inbox/`.
5. **In Cowork, say:** *"apply edits in content-export/edits-inbox"*. Claude
   will read the edited doc(s), update the code, and push to GitHub.
   Vercel auto-deploys, and the site updates within a minute or two.

## Regenerating the docs

Whenever the source code changes (new section, new page), regenerate the
Word docs from the manifest:

```bash
npm run content:export
```

This rewrites every file under `content-export/pages/` from `manifest.json`.
**Always do this before starting a new round of edits** so you're working
against the current site copy.

## What you can edit safely

- All visible text on each page.
- Bold, italic, links — these round-trip cleanly.
- Browser tab titles and SEO descriptions (the "Browser & search" section in
  each doc).

## What needs Claude (not Word)

- Adding a new section, paragraph, or value card.
- Reordering sections or list items.
- Changing the structure of a page (e.g. splitting one paragraph into two).
- Editing UI strings that depend on logic (error messages, conditional copy).

For any of these, just describe what you want in Cowork — they're code
changes, not copy changes.

## File-by-file map

| File | Live URL | Notes |
|------|----------|-------|
| `home.docx` | / | Eyebrow, hero, CTAs, credits strip |
| `about.docx` | /about | Mission, values, team |
| `how-it-works.docx` | /how-it-works | Five steps + credit math card |
| `guidelines.docx` | /guidelines | Respect, honesty, safe meetups, credits, reporting |
| `safety.docx` | /safety | Tier guide, never-host list, prep checklist |
| `explore.docx` | /explore | Filter UI, empty/error states, profile card labels |
| `signin.docx` | /dabble/signin | Tagline, form labels, error copy |
| `signup.docx` | /dabble/signup | 3-step quiz copy + welcome screen |
| `forgot-password.docx` | /dabble/forgot-password | Reset flow strings |
| `update-password.docx` | /dabble/update-password | Pending / closed / open gate states |
| `profile.docx` | /profile | Auth-gated landing strings |
| `profile-setup.docx` | /profile/setup | 3-step setup form labels and placeholders |
| `public-profile.docx` | /profile/[username] | Card titles, fallback bio, sessions sheet |
| `credits.docx` | /credits | Balance copy + ledger reason labels |
| `not-found.docx` | /404 | 404 page copy |
| `site-chrome.docx` | (cross-cutting) | Header nav, footer, default SEO title/description |

## If something breaks

- Lost an `[id: ...]` marker → tell Claude the field name; it will be restored.
- Accidentally deleted a whole section → reopen the original from
  `content-export/pages/` (regenerate with `npm run content:export` if you've
  already saved over it).
- The doc looks wrong after editing → don't worry about layout in Word.
  The site renders the text in its own design; Word is only the editing surface.
