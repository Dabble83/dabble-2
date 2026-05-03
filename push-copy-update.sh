#!/usr/bin/env bash
# One-shot: clean up the FUSE-leftover lock files, refresh the stale index,
# then push the prepared commit (3a9b830 — "copy: apply Frazer's site-wide
# voice and content edits") to origin/main. Vercel will auto-deploy.
set -euo pipefail
cd "$(dirname "$0")"

echo "Cleaning sandbox lock files..."
rm -f .git/index.lock .git/HEAD.lock

echo "Refreshing index from HEAD (works around the stale-index display)..."
git reset --mixed HEAD >/dev/null

echo ""
echo "--- Local main is at:"
git log --oneline -1
echo "--- Working tree status (should be clean):"
git status --short || true
echo ""
echo "--- Compared to origin:"
git fetch origin main --quiet
git log --oneline origin/main..main

echo ""
git push origin main

echo ""
echo "Pushed. Vercel should auto-deploy within a minute or two."
echo "Check: https://vercel.com/dashboard"
echo "Live: https://dabble.it.com"
