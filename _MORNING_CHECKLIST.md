# Morning Checklist — Dabble 2.0 Salvage + Vercel Auto-Deploy

Hi Frazer, everything is ready but needs two of your commands and a 2-minute Vercel dashboard check to go live. You can delete this file after.

## Status when you wake up

- **Local `main`** is updated to a new commit `2271075 salvage: port product code, migrations, and design briefs from force-pushed origin`. This is the clean standalone structure + all the salvageable work from the force-pushed origin (credits, sessions, forgot-password flow, SEO, a11y, design briefs, 3 Supabase migrations, RFCs).
- **`origin/main`** still has the bad monorepo restructure (`aeedec5`). We are going to overwrite it.
- **`backup/pre-salvage-2026-04-21`** (local branch) points at origin's current tip, so nothing is lost even if the force-push goes wrong.
- **Build verified locally:** `npm run lint` ✓, TypeScript ✓, `next build` compiled 33 static pages ✓ (sandbox couldn't clean `.next/export` but that works fine on your machine).

## Step 1 — Open a terminal in the repo and clear the stuck locks

```
cd ~/wherever/dabble-2    # your actual path to the clone
rm -f .git/index.lock .git/HEAD.lock
rm -f TEST_WRITE.tmp
rm -rf .github            # removes Cursor's old auto-deploy workflow (superseded)
```

If `rm` on `.git/*.lock` says "Operation not permitted," quit Cursor first (it may be holding a git handle), then retry.

## Step 2 — Sanity check

```
git log --oneline main -3
# Top line should be:  2271075 salvage: port product code, migrations, and design briefs from force-pushed origin

git log --oneline backup/pre-salvage-2026-04-21 -1
# Should be:  aeedec5 docs: sync phase status; align /about with MASTER_PLAN §2–§3

git status
# Should show: "On branch main" and a clean working tree
```

## Step 3 — Push the backup first, THEN force-push clean main

```
# 3a. Push the backup branch to origin so the old state has a named ref
git push origin backup/pre-salvage-2026-04-21

# 3b. Force-push clean main, but only if origin's main is still at aeedec5
#     (if someone else has pushed since, this will safely refuse)
git push --force-with-lease=main:aeedec5 origin main
```

If 3b refuses, run `git fetch origin` and tell me what origin's main points at — we'll adjust.

## Step 4 — Verify Vercel auto-deploys on this push

Within 30 seconds of the force-push, a new deployment should appear at:

  https://vercel.com/<your-org>/dabble-2/deployments

If it does and goes to "Ready", you are done. 

If no deployment appears, check **Vercel → Settings → Git**:

1. **Connected Repository** = `Dabble83/dabble-2`
2. **Production Branch** = `main`
3. **Root Directory** = `/` (or empty) — this is the critical one; origin's recent monorepo restructure may have pushed it to `dabble-2`. Change it back to empty/`/`.
4. **Ignored Build Step** = empty / "Automatic"
5. Under **Deployment Protection**: no "Required Approval" gate on production.

Then hit "Redeploy" once to pick up the setting change. Every push to `main` after that auto-deploys with zero clicks.

## Step 5 — (Optional) Supabase note

You said Supabase can be wiped and started fresh. The three migrations are now in `supabase/migrations/`:

- `20260419120000_extend_profiles.sql`
- `20260420130000_credits.sql`
- `20260421140000_sessions.sql`

When you're ready, apply them in order against a fresh Supabase project (via the Supabase Dashboard SQL editor or `supabase db push`). After that, update these env vars in Vercel (Production + Preview):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, never `NEXT_PUBLIC_*`)

The site will boot without these (core flows degrade gracefully per AGENTS.md), but auth/profile/explore will 500 until they are set.

## Step 6 — Delete this file

```
rm _MORNING_CHECKLIST.md
```

## If anything goes sideways

The safety net is the backup branch. To reset origin back to the force-pushed state at any time:

```
git push --force-with-lease=main:2271075 origin backup/pre-salvage-2026-04-21:main
```

That moves origin/main back to `aeedec5`. You lose the salvage commit but nothing else.
