# Dabble — Claude Code Work Session Prompts

> Open Claude Code in Terminal with: `claude` from `/Users/frazerlanier/dabble-2`
> Run each prompt below as a separate Claude Code session (or sequential tasks in one session).
> Complete them in order — Prompt 3 depends on having `.env.local` set up first.

---

## PROMPT 1 — Place images across the site

```
I have four images in the content-export/ folder that I want to place throughout the site.
Move all four images to public/images/ (create that folder), then make the following changes:

**try.jpg** — Hero / Sign-in / Join context
- Home page (app/page.tsx): Place as a full-bleed or large hero image behind or alongside the
  main headline section. It should feel welcoming and aspirational. Use a Next.js <Image> with
  priority loading.
- Sign-in page (app/dabble/signin/page.tsx): Place try.jpg somewhere visually pleasing — either
  as a side panel on desktop or a subtle top banner on mobile — so long as it does not obscure
  or crowd the form fields.
- Sign-up page (app/dabble/signup/page.tsx): Same treatment as sign-in. The image should be
  visible on the initial "form" phase and remain accessible (but non-intrusive) during the quiz
  and welcome phases.
- Any other auth pages (forgot-password, update-password): Include try.jpg as a small tasteful
  header image (not full-bleed — keep forms easy to reach).

**explore.png** — Explore tab
- Place in the upper-right corner of the Explore page (app/explore/page.tsx). It should sit
  above the map/list area, decorative but not blocking the FilterBar or map controls.

**meet.png** — About & How It Works tabs
- Place in the upper-right corner of both app/about/page.tsx and app/how-it-works/page.tsx.
  Consistent position on both pages.

**share.png** — Guidelines tab
- Place in a logical, visually pleasing location on app/guidelines/page.tsx. Upper-right or
  inline with the intro paragraph — wherever it reads naturally.

**Implementation notes:**
- Use Next.js <Image> (from "next/image") throughout with appropriate width/height/alt attributes.
- Images should be responsive — scale gracefully on mobile.
- Do not stretch or distort images; use object-fit: cover or contain as appropriate.
- Keep alt text descriptive: e.g. alt="Two people sharing skills outdoors"
- After placing images, run `npm run build` to confirm no type or import errors.
```

---

## PROMPT 2 — Disable Safety tab + add Terms of Use / Disclaimer to signup

```
I need two things done related to legal protection and the Safety tab:

### Part A — Disable the Safety tab

1. In app/components/SiteHeader.tsx, remove the Safety nav link from both the desktop nav and
   the mobile nav menu entirely (do not just hide it — delete the <Link> elements).
2. In app/safety/page.tsx, replace the entire page content with a simple redirect to the
   Guidelines page:
   - Add: import { redirect } from "next/navigation"; at the top
   - Replace the default export with: export default function SafetyPage() { redirect("/guidelines"); }
   - Keep the file so the route doesn't 404, but visitors land on Guidelines instead.
3. Update the metadata in app/safety/page.tsx to noindex so search engines don't index it.

### Part B — Add Terms of Use / Disclaimer to signup

Create a new file: app/components/TermsModal.tsx

This component should render a modal/dialog that:
- Is triggered automatically when a user reaches the signup form (phase === "form") before
  they can submit
- Requires the user to scroll through the terms and check a checkbox labeled
  "I have read and agree to the Terms of Use and Disclaimer"
- Has a single "Agree & Continue" button that only becomes active after the checkbox is checked
- Stores agreement in component state (no localStorage needed — it just gates the form submit)

The terms text to display inside the modal is:

---
**DABBLE TERMS OF USE & DISCLAIMER**
*Last updated: [auto-insert current date]*

Welcome to Dabble. Before creating an account, please read the following carefully.

**1. What Dabble Is**
Dabble is a community platform that helps curious people share skills, knowledge, and time with
one another on a casual, non-commercial basis. All exchanges use Dabble credits — not money.
Dabble is not a marketplace, staffing agency, professional services platform, or licensed
instruction service.

**2. You Use Dabble at Your Own Risk**
By creating an account, you acknowledge and agree that:

- All interactions, meetups, exchanges, and communications that occur through or as a result of
  using Dabble are entirely at your own risk.
- Dabble.it.com, its founders, operators, employees, contractors, and affiliates (collectively,
  "Dabble") are not responsible for — and you expressly release Dabble from all liability for —
  any injury, loss, damage, harm, or outcome of any kind that arises from your use of the
  platform or your interactions with other users, whether online or in person.
- Dabble does not screen, verify, license, or certify its users, their skills, their
  qualifications, or their identities. You are responsible for exercising your own judgment
  before meeting or engaging with anyone you find through Dabble.

**3. No Safety Guarantee**
Dabble does not provide safety monitoring, emergency services, or any guarantee of user safety.
Any safety resources, tips, or guidelines published on this site are provided for informational
purposes only and do not constitute a duty of care or a promise of protection.

**4. Your Responsibilities**
You agree to:
- Be at least 18 years old (or have verifiable parental consent if younger).
- Interact with other users honestly, respectfully, and in good faith.
- Meet in public places and take reasonable personal safety precautions.
- Not use Dabble for commercial transactions, solicitation, or any illegal purpose.
- Report users who violate community guidelines using the in-app reporting tools.

**5. Limitation of Liability**
To the fullest extent permitted by applicable law, Dabble's total liability to you for any
claim arising from use of the platform is zero dollars ($0). In no event shall Dabble be
liable for any indirect, incidental, special, consequential, or punitive damages.

**6. Governing Law**
These terms are governed by the laws of the State of [Your State], without regard to conflict
of law principles.

**7. Changes to These Terms**
Dabble may update these terms at any time. Continued use of the platform after changes are
posted constitutes acceptance of the revised terms.

If you do not agree to these terms, do not create an account.
---

In app/dabble/signup/page.tsx:
- Import and render <TermsModal> above the signup form
- Add state: const [termsAccepted, setTermsAccepted] = useState(false);
- Pass termsAccepted and setTermsAccepted as props to TermsModal
- Gate the form's submit button: disable it (and show a subtle note) until termsAccepted is true
- The modal should not re-appear once dismissed for the session (component state is sufficient)

After changes, run `npm run build` to confirm no errors.
```

---

## PROMPT 3 — Enable Google Maps and wire up the API key

```
The project has Google Maps support built in but disabled. I want to enable it.

### Step 1 — Environment setup
Create (or update) .env.local in the project root with:

NEXT_PUBLIC_ENABLE_MAPS=true
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE

(I will paste my actual API key — leave the placeholder text as-is for now and tell me
when the file is ready so I can add the key.)

Also confirm these same two variables are documented in .env.example (they already exist
there — just verify).

### Step 2 — Verify the maps feature flag
Open lib/flags.ts and confirm NEXT_PUBLIC_ENABLE_MAPS is read correctly. If the flag is
currently hardcoded to false anywhere else in the codebase, update those instances to
respect the env variable.

### Step 3 — Check the Google Maps loader
Open app/explore/ExploreMap.tsx and review the @googlemaps/js-api-loader implementation:
- Confirm the API key is read from process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- Confirm the loader includes the "marker" library (needed for AdvancedMarkerElement)
- If the loader uses the older Marker class instead of AdvancedMarkerElement, update it
  to use AdvancedMarkerElement (Google deprecated the old Marker in 2024)
- Confirm map ID is set (required for AdvancedMarkerElement) — add mapId: "dabble-explore"
  as a default if none exists

### Step 4 — Real-time card updates
In app/explore/page.tsx, check how profile data is fetched for the map markers:
- If it uses a one-time fetch, upgrade it to use Supabase Realtime so new user cards
  appear on the map without a page refresh.
- Subscribe to the profiles table (or whichever table stores location + public profile data)
  using supabase.channel().on("postgres_changes", ...).subscribe()
- On INSERT or UPDATE events, merge the new profile into local state
- On component unmount, call supabase.removeChannel() to clean up

### Step 5 — Graceful fallback
Confirm that when NEXT_PUBLIC_ENABLE_MAPS=false (or API key is missing), the Explore
page still renders the list/card view without any console errors or broken UI.

### Step 6 — Vercel environment variables
After local testing works, remind me to add these two variables in the Vercel dashboard:
  Project Settings → Environment Variables
  - NEXT_PUBLIC_ENABLE_MAPS = true
  - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = [your key]

Run `npm run build` after all changes to confirm no type errors.
```

---

## After all three prompts — Final checklist for Claude Code

```
Please do a final review pass:
1. Run `npm run build` and fix any TypeScript or import errors
2. Check that all four images in public/images/ are referenced correctly and exist
3. Verify the Safety nav link is gone from SiteHeader.tsx
4. Verify TermsModal appears on the signup page and gates the submit button
5. Verify .env.local has NEXT_PUBLIC_ENABLE_MAPS=true (I will add the key)
6. Run `git status` and show me all changed files
7. Run `git diff --stat` so I can review what changed before committing
```

---

## Notes on opening Claude Code

In Terminal, run:

```bash
cd /Users/frazerlanier/dabble-2
claude
```

Then paste each prompt above into the Claude Code prompt. You can run all three in a single
session by pasting them one at a time and waiting for Claude Code to finish each before sending
the next.

**Important:** For Prompt 3, after Claude Code creates `.env.local`, you will need to manually
open the file and paste your Google Maps API key into the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=`
line before testing locally.