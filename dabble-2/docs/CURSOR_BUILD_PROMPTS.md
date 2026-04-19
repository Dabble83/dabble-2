# Cursor build prompts (stub)

Canonical product/design source of truth grows here over time.

## §4 Phase P1

- **P1.4** — Explore filters + map alignment: `FilterBar` on `/explore` with category multi-select (chips), distance slider **1–50 km** (requires `olat`/`olng` on the URL), and **“teaching now”** toggle (`now=1`). Filters must update URL query params and re-query `GET /api/explore/discoverable`. Map pins and list card top bands use **§2.3** category colors; primary pin color comes from `primary_category` when stored, otherwise inference from offers. On small screens, default to **list** with **Show on map** / **Show list** toggle until `lg`.
- **P1.6** — `/safety` static page: four-tier framework, out-of-scope list, first-meetup checklist, and report link; copy must match **Master Plan §12** (`docs/MASTER_PLAN.md`).
- **P1.7** — `/guidelines` static page: respect, honest skill claims, safe meetups (echo §12.6), credits integrity, reporting (including **72-hour** acknowledgement promise); copy must match **Master Plan §13**; warm trail-guide voice per **§1.5** when extending prose (otherwise stay verbatim to the plan).

### §1.5 Voice (trail guide)

Short sentences, plain words, calm invitations. No hustle, no shame, no fake urgency. Prefer “try,” “share,” and “together” over growth jargon.

### §2.3 Map motifs (Explore / Google Maps)

- **Category pin colors:** outdoor **sage** `#6d8570`, DIY **clay** `#c4a574`, craft **ember** `#c4785a`, food **forest** `#5c7a56`, music **ink** `#3d4a5c`. If someone spans multiple lanes, use their **`primary_category`** (store on profile when available; otherwise infer from offers/skills text).
- **Base map styling:** warm muted land (`#f2ebe3` family), **sage** water (`#b8cdc4`), **stone** road geometry and strokes (`#d6cfc3` / `#c4bdb2`), calm label ink on parchment.
