# RFC 001 — Profile schema extensions (DRAFT)

| Field | Value |
|-------|--------|
| Status | **DRAFT — not implemented** |
| Scope | `public.profiles` column additions + app/API alignment |
| Drivers | `docs/CURSOR_BUILD_PROMPTS.md` §4 Phase **P1** (profile / discoverability track; **P1.1** is referenced in product planning — the prompts stub currently lists P1.6/P1.7 only; extend the stub when P1.1 is formalized). Master Plan **§7 (Audience)** and **§8 (IA)** are intended to anchor who sees what on Explore vs. profile setup; they are not yet in `docs/MASTER_PLAN.md` — this RFC should be reconciled when those sections land. |
| Out of scope for this RFC | Any SQL migration files, Supabase runs, or runtime schema changes. **No database work until you approve.** |

---

## 1. Summary

Extend `profiles` so a dabble can express **what they teach**, **what they want to learn**, **how they describe their level**, **credits** (seed phase), **visibility** (discoverability + location precision + travel radius), **availability**, and **safety tier consent** (aligned with Master Plan §12 tiers).

Today’s canonical shape (see `docs/SUPABASE_PROFILES_RESET.sql` and `app/api/profile/*`) includes `interests`, `skills`, `is_discoverable`, `location_label`, optional `lat`/`lng`. This RFC adds clearer semantics and fields required for credits + safety UX without prescribing exact SQL.

---

## 2. Proposed columns

All new columns live on **`public.profiles`** unless a follow-up RFC splits credits into a separate ledger.

| Column | Type | Nullable / default | Notes |
|--------|------|---------------------|--------|
| `skills_offered` | `text[]` | `NOT NULL DEFAULT '{}'` | Things this user can teach (replaces or absorbs today’s `skills` — see §6). |
| `skills_curious` | `text[]` | `NOT NULL DEFAULT '{}'` | Things they want to learn (replaces or absorbs today’s `interests`). |
| `experience_note` | `text` | `NULL` | Free text: “how I’d describe my skill level.” **Max 280 characters** (product + DB `CHECK` recommended). |
| `credit_balance` | `integer` | `NOT NULL DEFAULT 3` | Seed-phase starting balance per Master Plan §10; ledger rules TBD (§5, §8). |
| `is_discoverable` | `boolean` | already exists | Shown on Explore / discoverable APIs when `true`. |
| `show_exact_location` | `boolean` | `NOT NULL DEFAULT false` | When `false`, clients/APIs should avoid exposing precise `lat`/`lng` to others (neighborhood / label only). |
| `travel_radius_km` | `integer` | `NULL` | How far they are willing to meet or be matched; **`NULL` = unspecified** (UI copy: “not set” vs “anywhere” is an open question). |
| `availability_note` | `text` | `NULL` | Human-readable windows (“weekday evenings,” “Saturdays”). Structured calendars are out of scope for this RFC. |
| `safety_tier_consent` | `integer` | `NOT NULL DEFAULT 2` (proposed) | **1–4**, max tier user is willing to **teach or learn within** (maps to Master Plan §12). Enforce `CHECK (safety_tier_consent BETWEEN 1 AND 4)`. |

### 2.1 Relationship to existing `skills` / `interests`

The app currently persists **`skills`** and **`interests`** (`app/api/profile/update/route.ts`). Renaming in Postgres is disruptive; recommended approach:

1. **Add** `skills_offered` / `skills_curious`.
2. **Backfill** once: `skills_offered := skills`, `skills_curious := interests` (where non-null).
3. **Dual-write** from the API during a transition window.
4. **Deprecate** then **drop** `skills` / `interests` in a later migration after clients only use the new names.

Alternative (smaller diff): keep DB names `skills` / `interests` and only rename in the API layer — rejected here because you explicitly asked for `skills_offered` / `skills_curious` as column names.

---

## 3. Migration plan (conceptual — no files in this PR)

**Phase A — additive**

- Add all new columns with safe defaults (`DEFAULT '{}'` for arrays, `DEFAULT 3` for credits, `DEFAULT false` for `show_exact_location`, proposed `DEFAULT 2` for `safety_tier_consent` pending your call).
- Backfill arrays from legacy columns as in §2.1.
- Backfill `credit_balance`: set to `3` for rows where the column is new (or only bump accounts that should receive seed credits — **policy decision**, see §8).

**Phase B — constraints**

- Add `CHECK (safety_tier_consent BETWEEN 1 AND 4)`.
- Add `CHECK (char_length(experience_note) <= 280)` if `experience_note` is not null (or always enforce in app only — tradeoff in §8).

**Phase C — cleanup (later)**

- Remove `skills` / `interests` after API + clients exclusively use new columns.

**Rollback:** drop new columns only if no production data depends on them; prefer feature flags in app before irreversible drops.

---

## 4. RLS policy updates

Current policies (`SUPABASE_PROFILES_RESET.sql`):

- `SELECT` — public (`USING (true)`).
- `INSERT` / `UPDATE` / `DELETE` — owner `auth.uid() = id`.

**Issues introduced by this RFC**

1. **`credit_balance`** — must not be arbitrarily writable by the end user if credits are economy-critical. Options:
   - **4a.** `UPDATE` policy with `WITH CHECK` that **forbids** clients from changing `credit_balance` (only other columns) — still allows malicious direct API use unless column-level or trigger guard.
   - **4b.** **`BEFORE UPDATE` trigger** (security definer): if `NEW.credit_balance IS DISTINCT FROM OLD.credit_balance` and caller is not a service role, **raise exception**.
   - **4c.** Move balances to **`profile_credits`** or **`credit_ledger`** and keep `profiles` free of mutable money-like fields (strongest integrity; more tables).

**Recommendation for draft:** document **4b + 4a** as minimum; recommend **4c** if you expect audits or disputes.

2. **`show_exact_location` / `lat` / `lng`** — public `SELECT` exposes coordinates today. Either:
   - **Views** for public vs self (complex), or
   - **API layer** strips `lat`/`lng` when `show_exact_location` is false (matches current server-driven explore pattern), or
   - **Postgres column privileges** / RLS with separate policies (harder on Supabase).

**Recommendation:** keep RLS `SELECT` broad for simplicity; enforce **field-level redaction in `GET /api/profile/by-username` and explore** using `show_exact_location`.

3. **`safety_tier_consent`** — user-owned; default policy OK. Consider whether **lowering** tier should require re-acknowledgment in UI (product, not RLS).

---

## 5. API endpoint changes (Next.js app)

| Route | Change |
|-------|--------|
| `GET /api/profile/me` | Extend `.select(...)` to include new fields; return `credit_balance` only to the authenticated owner (already owner-scoped). |
| `POST /api/profile/update` | Accept camelCase body fields mapping to new columns; validate `experience_note` length, `safety_tier_consent` range, arrays max length/count if you add limits. **Reject** or ignore client-supplied `credit_balance` unless you explicitly allow admin paths. |
| `GET /api/profile/check` | Optionally factor new fields into `isProfileComplete` (`src/lib/profileCompletion.ts`) — e.g. require `safety_tier_consent` before “complete.” |
| `GET /api/profile/by-username` | Public: omit or redact `credit_balance`, `availability_note` (if sensitive), and coordinates when `show_exact_location` is false. |
| `GET /api/explore/discoverable` | Include `skills_offered` / `skills_curious` for cards; respect `show_exact_location` for map pins; optionally filter by `travel_radius_km` when geo matching exists. |

**Types:** extend `ProfileRecord` in `src/lib/profileTypes.ts` and any Zod/manual validators used by forms.

---

## 6. Master Plan / product alignment

- **§10 Credits:** `credit_balance` default `3` matches free-seed story; post–10k members policy is **not** defined here.
- **§12 Safety tiers:** `safety_tier_consent` should be explained in onboarding and `/safety`; matching logic (e.g. session tier ≤ min(teacher_consent, learner_consent)) belongs in a future sessions RFC.

---

## 7. Open questions (owner)

1. **Seed credits:** Should every existing row get `credit_balance = 3` on migration, or only accounts created after launch / under 10k members? Who is the source of truth for “member count”?
2. **Credits storage:** Is `profiles.credit_balance` sufficient, or do you want an append-only **ledger** from day one?
3. **`travel_radius_km`:** Should `NULL` mean “not willing to travel” or “no limit”? Should we use `0` for one of those meanings explicitly?
4. **`safety_tier_consent` default:** Is `2` (deliberate public session) the right default, or must users opt in from a quiz with no default?
5. **Deprecation cadence:** Single breaking migration vs. long dual-write for `skills`/`interests`?
6. **Public `availability_note`:** Always visible on public profile, or only after match / only to self?
7. **Array caps:** Max tags per array to prevent abuse / huge payloads?
8. **P1.1 / §7–§8 text:** Approve adding stub lines to `CURSOR_BUILD_PROMPTS.md` and §7–§8 to `MASTER_PLAN.md` so this RFC references stable anchors.

---

## 8. Acceptance criteria (when implemented later)

- [ ] Migration applied in staging; backfill verified on a copy of prod data.
- [ ] RLS/trigger prevents user from self-awarding credits (if balance stays on `profiles`).
- [ ] Public routes never leak `credit_balance` or exact coordinates when flags say no.
- [ ] Lint/build green; profile setup UI reads/writes new fields.

---

*End of RFC 001 draft.*
