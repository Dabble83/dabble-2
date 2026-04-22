# RFC 002 — Credits economy (DRAFT)

| Field | Value |
|-------|--------|
| Status | **DRAFT ONLY — not implemented; for owner review** |
| Scope | Ledger semantics, session pricing, holds/settlement, refunds, seed allocation, abuse mitigations; **no** paid-credits product in this RFC |
| Drivers | `docs/CURSOR_BUILD_PROMPTS.md` **§5 P2.1** (credits economy track — add to prompts stub when formalized); `docs/MASTER_PLAN.md` **§10** (`/how-it-works` canonical numbers and copy) |
| Out of scope | Purchasing credits with money, tax/accounting treatment, marketplace payouts, full session-booking UX, migrations, and any runtime code until approved |

---

## 1. Summary

Dabble routes neighbor exchange through **whole-number credits**, not cash. This RFC sketches how credits are **defined**, **priced by session shape**, **earned and spent**, **held then settled** around pending meetups, **refunded** under simple rules, **seeded** for early members, and **protected** against obvious abuse. It proposes a minimal **ledger-first** storage shape so balances are explainable and auditable.

Numbers below align with **Master Plan §10** unless explicitly labeled as a proposal.

---

## 2. Credit unit

- **1 credit** ≈ **20 minutes** of focused, in-person neighbor help (§10.1). It is **not** a dollar, **not** a contract, and **not** convertible to cash in product (see §9).
- Sessions are priced in **whole credits** only so expectations stay legible in UI and receipts.

---

## 3. Session-type pricing (spend at booking)

Canonical table (§10.3):

| Shape | Credits | Intent |
|-------|---------|--------|
| **Tip** | **1** | Small favor, a few minutes |
| **Short** | **3** | Hands-on demo length |
| **Walk-with** | **6** | Longer neighborhood session |

**Proposal (RFC-level):** the booking flow stores `session_type` (or equivalent) and `price_credits` at book time so later catalog changes do not rewrite history.

---

## 4. Earn events

Aligned with §10.2 spirit; **exact amounts** below are **draft policy** pending owner sign-off.

| Event | Draft credit effect | Notes |
|-------|---------------------|--------|
| **Complete session as teacher** | **+N** where **N = price_credits** of that session (e.g. teach a Short → +3) | Requires **both parties** (or defined quorum) to mark complete; dispute path TBD |
| **Rated by learner ≥ 4** (when ratings exist) | **+1** bonus **once per completed session** (cap TBD) | Intention: reward quality without turning ratings into a grind; **floor** and abuse rules in §8 |

**Open:** whether partial completion or “tip only” earns fractional rules (this RFC assumes **whole credits** only; Tips still earn **1** if completed as Tip).

---

## 5. Spend events

- **Book session:** learner (or whoever pays per future product rules) **authorizes a hold** of `price_credits` against their **spendable balance** (see §6). No separate “spend” row until settlement unless you prefer double-entry clarity (owner choice in schema).

---

## 6. Hold vs settle pattern (pending sessions)

**Goal:** avoid double-spends and make cancellations reversible without destructive deletes.

**Draft flow**

1. **Hold (pending booking):** insert `session_holds` (or ledger rows with `state = 'pending'`) for **`amount = price_credits`**, reducing **spendable** balance but not yet moving value to the teacher.
2. **Settle (completed session):** release hold, post **immutable ledger** lines: learner **−price_credits**, teacher **+price_credits** (and any **bonus** per §4).
3. **Cancel / no-show (§7):** transition hold per refund rules; ledger records the **refund** or **forfeit** explicitly.

**Materialized balance:** `credit_balances` (or computed view) = sum(ledger posted) − **active holds** (or include holds in a separate “available vs reserved” column pair).

**Open:** single-table ledger with `entry_type` vs split `session_holds` + `credit_ledger`; both are sketched in §11.

---

## 7. Refund rules (draft)

| Scenario | Draft outcome |
|----------|----------------|
| **Cancel ≥ 24h before scheduled start** | **Full release** of hold to learner spendable balance; **no** teacher earn |
| **Cancel \< 24h** | **Owner policy** — options: partial to teacher, full forfeit to house, or credit to community pool (not in scope until defined) |
| **No-show** (defined: which party failed to attend / confirm) | Hold releases per policy table; **repeat no-shows** may trigger trust flags (safety RFC / ops playbook, out of scope here) |

**Open:** timezone for “24h,” who may initiate cancel, and whether the teacher can force-complete vs learner-only.

---

## 8. Free seed phase allocation (§10.5)

- While **member count \< 10,000**, each **new member** receives **3 starter credits** so they can book a **Short** (3) before first teach.
- **Implementation sketch:** grant via ledger row `reason = 'seed_signup'` idempotent on `user_id` (or first-profile-completion event — **owner pick**).
- **Member count source of truth:** must be defined (e.g. `profiles` row count, auth user count, or marketing definition); **RFC assumes a single server-side gate** so clients cannot self-award.

---

## 9. Abuse surface and mitigations

| Risk | Mitigation (draft) |
|------|---------------------|
| **Self-dealing** (A books B where A controls B) | Device/graph heuristics + rate limits + manual review queue; block same **payment instrument** / phone reuse if ever added; **RLS + server-only ledger writers** |
| **Sock puppets** farming completes | Velocity caps on earn; require **distinct** learner–teacher pairs for bonuses; **≥4 rating** bonus only from accounts with **minimum tenure / session history** (threshold TBD) |
| **Collusion** (fake completes) | Dual confirmation, dispute window, audit trail on IP/device (privacy policy alignment required) |
| **Balance tampering** | No client-writable balance; **append-only** `credit_ledger`; admin adjustments as separate signed `reason` |

**Not in scope:** full fraud model or ML scoring.

---

## 10. Future paid-credits exit ramp (acknowledged, **not** in scope)

At some future phase, Dabble *might* introduce optional **paid credit packs** or **top-ups** for accessibility—not a marketplace wage. This RFC **does not** specify pricing, payment rails, tax, or ledger migration. If paid credits ship, expect:

- Separate **“purchased” vs “earned”** buckets or a unified balance with **traceable** provenance (owner decision).
- Clear **ToS** update and **refund law** compliance.

**No implementation until a later RFC.**

---

## 11. Schema sketch (illustrative SQL shapes)

**Not migration SQL.** Names are indicative.

### 11.1 `credit_ledger` (immutable append-only)

| Column | Purpose |
|--------|---------|
| `id` | UUID PK |
| `user_id` | Who is affected |
| `delta` | Integer **credits** (+ earn, − spend, + refund) |
| `currency` | Literal `'CREDIT'` for future-proofing |
| `reason` | Enum-like text: `seed_signup`, `session_settle`, `session_bonus_rating`, `refund`, `admin_adjustment`, … |
| `session_id` | FK when row ties to a session |
| `counterparty_user_id` | Optional; aids audits |
| `idempotency_key` | UNIQUE; prevents double-post on retries |
| `metadata` | `jsonb` small audit payload |
| `created_at` | Server timestamp |

**Rule:** no `UPDATE` / `DELETE` on business rows (superuser migrations only).

### 11.2 `credit_balances` (materialized or computed)

**Option A — materialized:** `user_id`, `available_credits`, `held_credits`, `updated_at`, maintained by trigger or job from ledger + holds.

**Option B — computed view:** `SUM(ledger.delta) - SUM(active_holds.amount)` per user; simpler early on, slower at scale.

**Open:** whether `profiles.credit_balance` (RFC 001) remains a **cache** invalidated from ledger or is **deprecated** when ledger ships.

### 11.3 `session_holds`

| Column | Purpose |
|--------|---------|
| `id` | UUID PK |
| `session_id` | Booking/session FK |
| `learner_user_id` | Who pays |
| `amount` | Credits held |
| `status` | `pending` \| `captured` \| `released` \| `expired` |
| `release_at` | Optional auto-release if session never confirms |
| `created_at` / `updated_at` | Audit |

**Settlement** posts ledger rows and terminalizes the hold.

---

## 12. Consistency checks (for a later implementation PR)

- [ ] All balance changes trace to **ledger** and/or **hold** state machine.
- [ ] Seed grant is **idempotent** per user under \<10k rule.
- [ ] No public API allows arbitrary `delta`.
- [ ] Session pricing at book time matches §3 table unless an admin override path exists (documented).

---

## 13. Open questions for owner

1. **Cancel \< 24h:** full refund, partial to teacher, or platform retention?
2. **Earn amount:** should teacher always earn **exactly** `price_credits`, or a **percentage** reserved for “house” sustainability?
3. **Ratings bonus:** confirm **+1** cap per session and minimum star threshold (**≥4** as stated in prompt).
4. **Member count:** authoritative query and whether **10,000** is inclusive or exclusive of the last grant.
5. **When is “signup”** for seed grant: auth creation, first profile save, or first `is_discoverable = true`?
6. **Disputes:** who can block settlement and for how long?
7. **Hold expiry:** if a session stays “pending” forever, auto-release after N days?
8. **Relationship to RFC 001** `credit_balance`: migrate off, or keep as denormalized cache with triggers?

---

*End of draft. Stop here pending review.*
