#!/usr/bin/env bash
set -euo pipefail

# Extract `dabble-2/` into a standalone git history and push it to a new empty GitHub repo.
#
# Prereqs:
# - You created an EMPTY GitHub repo (no README/license/gitignore) for Dabble 2.0
# - You have push access to that repo
# - `git` is installed locally
#
# Usage:
#   ./scripts/extract-dabble2-standalone.sh git@github.com:ORG/dabble-2.git
#   ./scripts/extract-dabble2-standalone.sh https://github.com/ORG/dabble-2.git
#
# Notes:
# - This uses `git subtree split`, which can take a bit on large histories.
# - After the first push, Vercel can import the new repo normally (no Root Directory needed).

if [[ "${1:-}" == "" ]]; then
  echo "Usage: $0 <new-empty-repo-url>" >&2
  exit 2
fi

NEW_REPO_URL="$1"

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if [[ ! -d dabble-2 ]]; then
  echo "error: expected folder dabble-2/ at repo root: $ROOT" >&2
  exit 1
fi

echo "[extract] splitting history for dabble-2/ ..."
SPLIT_SHA="$(git subtree split --prefix dabble-2 -b dabble-2-standalone-export)"

echo "[extract] pushing standalone history to: $NEW_REPO_URL"
git push "$NEW_REPO_URL" "$SPLIT_SHA:refs/heads/main"

echo
echo "[extract] done."
echo "Next:"
echo "- Import the new repo in Vercel (no Root Directory needed)"
echo "- Add env vars from dabble-2/.env.example (now at repo root after import)"
