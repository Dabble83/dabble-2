# RFC 003 — Sessions lifecycle (DRAFT)

| Field | Value |
|-------|--------|
| Status | **DRAFT ONLY — not implemented; for owner review** |
| Scope | Session shapes, state machine, credit holds/settlement hooks, per-session messaging, post-completion ratings, cancellation policy, disputes; **no** migrations or app code until approved |
| Drivers | `docs/CURSOR_BUILD_PROMPTS.md` **§5 P2.4** (sessions track — add to prompts stub when formalized); `docs/MASTER_PLAN.md` **§10** (credits + session shapes); **§12–13** (safety tiers, in-app messaging preference, credits integrity — there is **no §11** in `MASTER_PLAN.md` today; this RFC treats “§10–11” as **§10 plus adjacent trust/safety intent** from §12–13) |
| Out of scope | Calendar sync, video calls, payments, push notifications, full moderation UI, and exact API route design |

---

## 1. Summary

A **session** is the atomic unit of neighbor exchange on Dabble: a learner requests a **shape** (Tip / Short / Walk-with) from a teacher, both agree on time and place, credits **hold** when the booking is firm, the meetup runs, then the ledger **settles** on honest completion. **Chat** stays scoped to that session so context does not bleed across relationships. After completion, a **lightweight rating** closes the loop and feeds future credit bonuses (per §10.2 spirit and RFC 002).

---

## 2. Session shapes (canonical prices)

Aligned with **Master Plan §10.3** (tune only when plan + product change together):

| Shape | Credits | Rough intent |
|-------|---------|----------------|
| **Tip** | **1** | Small favor, a few minutes |
| **Short** | **3** | Hands-on demo length |
| **Walk-with** | **6** | Longer neighborhood session |

At creation time, store `session_type` and `price_credits` on the row so catalog drift does not rewrite history.

---

## 3. State machine (draft)

**Actors:** `learner_id`, `teacher_id` (both `auth.users` / `profiles.id`). States are row-level; transitions are validated server-side.

| State | Meaning (draft) |
|-------|------------------|
| **proposed** | Learner sent a request; teacher has not accepted. |
| **accepted** | Teacher accepted; **credit hold** is placed on learner for `price_credits` (see RFC 002 `session_holds` / ledger pattern). |
| **scheduled** | Both parties confirmed a concrete window + public-ish location (Tier 2 default per §12.2). |
| **completed** | Meetup happened; dual confirmation path satisfied; **settlement** moves credits (learner spend / teacher earn) per policy. |
| **cancelled** | Legitimate wind-down; **release or partial settle** per cancellation window (§6). |
| **no-show** | One party failed the agreed window; **policy outcome** + trust signal (ops playbook, not fully specified here). |

**Happy path:** `proposed` → `accepted` → `scheduled` → `completed`.

**Transitions (illustrative):**

- `proposed` → `accepted` | `cancelled` (decline or withdraw before acceptance).
- `accepted` → `scheduled` | `cancelled`.
- `scheduled` → `completed` | `cancelled` | `no-show`.
- Terminal states: `completed`, `cancelled`, `no-show` (no further business transitions without admin tool).

**Open:** whether `accepted` and `scheduled` should merge for MVP (fewer states, simpler UX).

---

## 4. Credits: hold on acceptance, settle on completion

Cross-reference **RFC 002**:

- On **`accepted`** (or first moment both are financially committed — **owner pick**), create **`session_holds`** for `price_credits` against the learner.
- On **`completed`**, release hold and append **ledger** lines: learner −`price_credits`, teacher +`price_credits` (and optional **rating bonus** per §5 below).
- On **`cancelled`**, apply **RFC 002 refund windows** (e.g. ≥24h full release) with explicit ledger `reason = 'refund'` rows where needed.
- On **`no-show`**, forfeiture / partial credit to counterparty / house — **policy table** (open).

**Open:** single “commit point” vs separate `accepted` vs `scheduled` for when the hold attaches.

---

## 5. Messaging thread scoped to the session

- **One thread per `session_id`:** `session_messages` rows reference `session_id`; no cross-session fan-out from the product surface (§12.6 / §13.3: prefer in-app messaging).
- **Participants:** learner + teacher only (unless future “observer” or support injection is added).
- **Lifecycle:** allow messages in `proposed` … up through `completed` (or freeze after terminal state — **owner pick**).
- **Safety:** report flow can reference `session_id`; rate limits and retention policy TBD.

**Out of scope for this RFC:** attachments, read receipts, E2E encryption claims.

---

## 6. Rating step after completion (drives future credits)

Aligned with **§10.2** (“when ratings ship”) and RFC 002 earn table draft:

- After `completed`, prompt the **learner** for a **1–5** (or thumbs) rating + optional short note.
- **Teacher** may optionally rate learner on “showed up / respect” axis (symmetry **open**).
- **Credit linkage:** e.g. **+1** bonus to teacher when average or threshold ≥ **4**, **once per session**, idempotent ledger key `session_rating_bonus:{session_id}` — exact numbers already flagged as owner decisions in RFC 002.

**Integrity (§13.4):** ratings must not be gameable via self-dealing; pair with graph/velocity checks from RFC 002 §9.

---

## 7. Cancellation windows (draft)

Mirror **RFC 002 §7** unless product forks:

- **Cancel ≥ 24h before start:** full hold release to learner; no teacher earn.
- **Cancel \< 24h:** owner policy (partial / forfeit / pool).
- **Who can cancel:** learner, teacher, or both — **open** (symmetry vs abuse).

Timezone for “24h” must be explicit (e.g. learner-local vs session `timezone` column).

---

## 8. Dispute path (draft)

**Goals:** protect §13.4 integrity without turning Dabble into a court.

- **In-app “Something went wrong”** on the session surfaces a short form: category (no-show, quality, safety concern), free text, optional evidence links (not raw PII).
- **State:** optional `disputed_at` / `dispute_status` on `sessions`, or separate `session_disputes` table — **open**.
- **While disputed:** block settlement **or** allow provisional settle with clawback window — **high-risk**; default recommendation: **freeze settlement** until ops resolves or timeout.
- **Escalation:** email **safety@dabble.it.com** (per §13.5) remains canonical until in-product reporting ships.

---

## 9. Schema sketch (illustrative)

### 9.1 `sessions`

| Column | Notes |
|--------|--------|
| `id` | UUID PK |
| `learner_id`, `teacher_id` | FK to `auth.users` |
| `session_type` | `tip` \| `short` \| `walk_with` |
| `price_credits` | int, frozen at create |
| `status` | enum-like text per §3 |
| `proposed_at`, `accepted_at`, `scheduled_start_at`, `scheduled_end_at`, `completed_at`, `cancelled_at` | timestamps nullable |
| `location_summary` | text; public-first framing |
| `safety_tier` | int 1–4 if you want explicit tie to §12 tiers |
| `created_at`, `updated_at` | audit |

### 9.2 `session_messages`

| Column | Notes |
|--------|--------|
| `id` | UUID PK |
| `session_id` | FK → `sessions` |
| `sender_id` | FK → `auth.users` |
| `body` | text; length cap in product + DB |
| `created_at` | server time |

Indexes: `(session_id, created_at)`.

### 9.3 `session_ratings`

| Column | Notes |
|--------|--------|
| `id` | UUID PK |
| `session_id` | FK unique per rater **or** composite unique `(session_id, rater_id, role)` |
| `rater_id` | who submitted |
| `ratee_id` | who is rated |
| `stars` | smallint 1–5 |
| `note` | optional text, capped |
| `created_at` | |

**Idempotency:** prevent duplicate learner rating for same session via unique constraint.

---

## 10. Consistency checks (later implementation)

- [ ] State transitions are **server-enforced**; clients cannot jump to `completed`.
- [ ] Credit hold amount always matches `price_credits` at acceptance.
- [ ] Settlement is idempotent per `session_id`.
- [ ] Messages cannot be posted to sessions the user is not party to (RLS).

---

## 11. Open questions for owner

1. **Minimal MVP states:** collapse `accepted` + `scheduled`, or keep both for clearer accounting?
2. **Hold timing:** on `accepted` vs on `scheduled` vs on learner “confirm booking” third step?
3. **Dual completion:** must **both** tap complete, or learner-only + teacher silence = confirm?
4. **No-show attribution:** automatic vs manual accusation with counter-response?
5. **Ratings visibility:** public on profile, private to counterparty, or aggregate-only?
6. **Message retention:** how long to keep `session_messages` after terminal state?
7. **Tier enforcement:** block `Walk-with` until both parties completed a Tier-2 session together?
8. **Relationship to Explore:** does booking always start from a profile CTA, or can sessions exist without prior Explore view (deep link)?

---

*End of draft. Stop here pending review.*
