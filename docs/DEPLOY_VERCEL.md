## Deploy Dabble 2.0 to Vercel

This app lives under `dabble-2/` and is a Next.js App Router project.

### 1) Create the Vercel project

- In Vercel: **Add New → Project**
- Import the GitHub repo

### 2) Point Vercel at the `dabble-2` app

In the “Configure Project” step (or later in Project Settings):

- **Root Directory**: `dabble-2`
- **Framework Preset**: Next.js (auto-detected)

Suggested commands if Vercel asks:

- **Install Command**: `npm ci`
- **Build Command**: `npm run build`
- **Output Directory**: default

### 3) Set environment variables

In **Project → Settings → Environment Variables**, set the following (at least for **Production**, and for **Preview** if you want preview deploys to work):

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

Use `dabble-2/.env.example` as the canonical list.

### 4) Deploy

Click **Deploy**. Vercel will provide a URL.

### 5) Production branch (recommended)

In **Project → Settings → Git**, set:

- **Production Branch**: `main`

This ensures merges to `main` trigger production deployments.