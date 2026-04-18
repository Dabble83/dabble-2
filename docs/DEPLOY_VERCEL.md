## Deploy Dabble 2.0 to Vercel

This repository is a Next.js App Router project deployed from the repo root.

### 1) Create/link the Vercel project

- In Vercel: **Add New → Project**
- Import this GitHub repository
- Confirm **Framework Preset** is Next.js

Suggested project commands:

- **Install Command**: `npm ci`
- **Build Command**: `npm run build`
- **Output Directory**: default

### 2) Configure environment variables

In **Project → Settings → Environment Variables**, set these for **Production** and **Preview**:

Required for auth/profile/explore:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never `NEXT_PUBLIC_*`)

Optional (maps):

- `NEXT_PUBLIC_ENABLE_MAPS` (`true`/`false`)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `GOOGLE_MAPS_SERVER_KEY`

Optional (AI):

- `OPENAI_API_KEY`

Use `.env.example` as the canonical list.

### 3) Enable automatic redeploys from GitHub Actions

This repo includes `.github/workflows/vercel-auto-deploy.yml`, which does:

- **PRs to `main`**: run `npm run ready`, then create a **Vercel Preview** deployment
- **Push to `main`**: run `npm run ready`, then deploy to **Vercel Production**

Add the following **GitHub Actions secrets** at:
**GitHub Repo → Settings → Secrets and variables → Actions**.

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

How to get IDs:

1. Link locally once with `npx vercel link`
2. Read `.vercel/project.json` for `orgId` and `projectId`

### 4) Production branch and protection

In **Vercel → Project → Settings → Git**:

- Set **Production Branch** = `main`

In **GitHub branch protection** (recommended):

- Require the "Vercel Auto Deploy / Verify app gates" check before merge

### 5) First deployment

After secrets are added, push to `main` (or merge a PR into `main`).
The workflow will deploy automatically without manual intervention.