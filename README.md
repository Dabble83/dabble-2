# Dabble 2.0

Greenfield prototype for [Dabble](../README.md) — built in phases so maps, AI, and auth stay isolated behind flags and adapters.

## Current state

- Next.js App Router, TypeScript, Tailwind CSS v4, ESLint
- Supabase-authenticated profile flow and API routes
- Explore list with filters + map adapter shell
- `npm run ready` gate (`check-env`, `lint`, `build`)

### Run locally

```bash
cd dabble-2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health).

### Environment

Copy `.env.example` to `.env.local` when you start integrating services. **Phase 0 does not require any variables** — `npm run build` should pass with an empty `.env.local` or none at all.

### Optional: standalone GitHub repo

If you want Dabble 2.0 as its own repository (instead of deploying from the monorepo with Root Directory `dabble-2`), see `docs/STANDALONE_REPO_EXPORT.md`.

### Product & design plan

- Master plan (including Phase 2 design): `docs/MASTER_PLAN.md`

### Scripts

| Script        | Purpose                                      |
| ------------- | -------------------------------------------- |
| `npm run dev` | Development server                           |
| `npm run build` | Production build                           |
| `npm run check-env` | Print status of documented env vars   |
| `npm run preflight` | `check-env` + `lint` before wider changes |
| `npm run ready` | `check-env` + `lint` + `build` gate check |

## Agent workflow

- Operating guide: `AGENTS.md`
- Runbook: `docs/AGENT_RUNBOOK.md`
- Prompt templates: `docs/AGENT_PROMPTS.md`
- Phase 1 scope contract: `docs/PHASE_1_SCOPE.md`
- Task queue: `docs/AGENT_TASK_QUEUE.md`
- Handoff template: `docs/AGENT_HANDOFF_TEMPLATE.md`
- QA checklist: `docs/QA_CHECKLIST.md`
- Phase status: `docs/PHASE_STATUS.md`

## Product specs (v1 repo)

Canonical copy and product notes live in the parent repo under `spec/` (e.g. `DABBLE_COPY.md`, `DABBLE_PRODUCT.md`).
