# Dabble 2.0

Greenfield prototype for [Dabble](../README.md) — built in phases so maps, AI, and auth stay isolated behind flags and adapters.

## Phase 0 (current)

- Next.js App Router, TypeScript, Tailwind CSS v4, ESLint
- `GET /api/health` — no database or third-party APIs
- `npm run check-env` — lists documented env vars (exits 0; safe in CI)

### Run locally

```bash
cd dabble-2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health).

### Environment

Copy `.env.example` to `.env.local` when you start integrating services. **Phase 0 does not require any variables** — `npm run build` should pass with an empty `.env.local` or none at all.

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

## Product specs (v1 repo)

Canonical copy and product notes live in the parent repo under `spec/` (e.g. `DABBLE_COPY.md`, `DABBLE_PRODUCT.md`).
