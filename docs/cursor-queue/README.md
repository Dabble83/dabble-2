# Cursor queue — fire prompts straight into Cursor without copy-paste

This folder holds ready-to-run Cursor prompts (one file per batch of related
changes). A small script, `scripts/cursor-send.mjs`, reads a queue file and
fires a prompt directly into Cursor's Cloud Agents API — no IDE focus, no
clipboard, no typing. Cursor runs the agent in the cloud and opens a GitHub PR
when it's done. Vercel auto-deploys a preview. You review and merge.

## One-time setup

1. Generate a Cursor API key at <https://cursor.com/dashboard> → Integrations.
   (Requires a Cursor plan that includes Cloud Agents — Pro or above.)
2. Add it to `.env.local` at repo root:
   ```
   CURSOR_API_KEY=cur_...
   ```
   `.env.local` is gitignored. Do NOT commit it.
3. Confirm with a dry run:
   ```
   npm run cursor:send:dry -- docs/cursor-queue/2026-04-22-copy-and-hero-rework.md 1
   ```
   You should see the parsed prompt printed without any API call.

## Firing a prompt

Send Prompt 1 from a queue file:

```
npm run cursor:send -- docs/cursor-queue/2026-04-22-copy-and-hero-rework.md 1
```

Send all prompts in order:

```
npm run cursor:send -- docs/cursor-queue/2026-04-22-copy-and-hero-rework.md all
```

Override the source branch (default is `main`) or the new branch name:

```
npm run cursor:send -- <file> 2 --ref main --branch cursor/explore-copy
```

Skip PR creation (agent runs but leaves its branch for manual review):

```
npm run cursor:send -- <file> 4 --no-pr
```

## What actually happens

1. The script parses `## Prompt N — Title` sections, strips the `>` blockquote
   markers, and extracts the prompt body.
2. It detects your `origin` remote and normalizes it to an HTTPS URL.
3. It POSTs to `https://api.cursor.com/v0/agents` with Basic auth:
   ```json
   {
     "prompt":  { "text": "<prompt body>" },
     "source":  { "repository": "<https repo url>", "ref": "main" },
     "target":  { "autoCreatePr": true, "branchName": "cursor/<slug>-p<N>" },
     "model":   "default"
   }
   ```
4. Cursor returns an agent ID. The script prints a dashboard URL you can
   watch. When the agent finishes, it opens a PR on GitHub.
5. Each send is appended to `.cursor-queue.log` alongside the queue file so
   you can tell which prompts have been fired.

## When Cowork writes a queue file for you

The intended flow is:

> Frazer: "Do X, Y, Z."
> Claude (in Cowork): writes a new file `docs/cursor-queue/<date>-<topic>.md`
> with a numbered list of prompts.
> Frazer: approves Claude's single `npm run cursor:send -- <file> 1` Bash call.
> Cursor Cloud Agent runs → opens PR → Vercel previews → you merge.

Your "yes" is literally one Bash approval per prompt. No paste required.

## Writing a queue file

Match the format of `2026-04-22-copy-and-hero-rework.md`:

```md
## Prompt 1 — Short title

> **Task:** What to do.
>
> **Specific changes:** …
>
> **Acceptance:** …
>
> **Guardrails:** …

---

## Prompt 2 — Next title

> …
```

Rules the parser cares about:

- Header must match `## Prompt N — Title` (em dash, en dash, or hyphen OK).
- Prompt body is everything in the blockquote; non-blockquote prose between
  the header and the first `>` line is ignored (use it for human notes).
- Prompts are separated by a blank line and a `---` rule, or by the next
  `## Prompt` header.

## Troubleshooting

| Symptom                                  | Fix                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `CURSOR_API_KEY is not set`              | Add it to `.env.local`. Don't commit it.                             |
| `Could not detect the origin remote`     | `git remote add origin https://github.com/<you>/<repo>.git`.         |
| `Cursor API returned 401`                | Key is invalid or revoked. Regenerate at cursor.com/dashboard.       |
| `Cursor API returned 402`                | Out of Cloud Agent credits on your Cursor plan. Upgrade or wait.     |
| Prompt parsed as empty                   | Check the blockquote markers — each line must start with `>`.        |

## Security notes

- `CURSOR_API_KEY` is server-only. Never add it to `NEXT_PUBLIC_*` or to any
  file that ships to the browser.
- The script reads `.env.local` only; it does not read `.env` or any other
  dotfile.
- No credentials are written to `.cursor-queue.log`.
