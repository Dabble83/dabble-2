## Standalone GitHub repo for `dabble-2` (optional)

`dabble-2/` is intentionally a **subfolder inside** the `Dabble83/Dabble` monorepo. Vercel can deploy it by setting **Root Directory** to `dabble-2`.

If you still want a **separate GitHub repository** that contains only Dabble 2.0, use a **history-preserving split** of the `dabble-2/` subtree.

### 1) Create an empty GitHub repo

Create a new repository with **no** README, license, or `.gitignore` (it must be empty).

### 2) Run the export script (on your machine)

From the monorepo root:

```bash
chmod +x scripts/extract-dabble2-standalone.sh
./scripts/extract-dabble2-standalone.sh git@github.com:YOUR_ORG/dabble-2.git
```

This will:

- Split git history for the `dabble-2/` prefix
- Push it to the new repo’s `main` branch

### 3) Connect Vercel

Import the new repo in Vercel as a normal Next.js project (no Root Directory needed).

### 4) Environment variables

Use `.env.example` at the repo root (it’s the same file that used to live under `dabble-2/.env.example` in the monorepo layout).
