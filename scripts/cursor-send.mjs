#!/usr/bin/env node
/**
 * cursor-send.mjs — fire a queued prompt into Cursor's Cloud Agents API.
 *
 * Flow:
 *   1. You (or Claude in Cowork) maintain a queue markdown file under
 *      docs/cursor-queue/, with prompts delimited by `## Prompt N — Title`
 *      and each prompt body written as a blockquote.
 *   2. This script extracts prompt N, detects the repo URL + target branch,
 *      and POSTs to https://api.cursor.com/v0/agents with autoCreatePr=true.
 *   3. Cursor runs the agent in the cloud. When it finishes, it opens a PR
 *      on GitHub. Vercel auto-deploys a preview. You review + merge.
 *
 * Usage:
 *   node scripts/cursor-send.mjs <queue-file> <prompt-number> [flags]
 *   node scripts/cursor-send.mjs <queue-file> all            [flags]
 *
 * Flags:
 *   --dry-run           Print the parsed prompt + payload, do not call the API.
 *   --ref <branch>      Source ref (default: current git HEAD's upstream or "main").
 *   --branch <name>     Explicit new branch name (default: cursor/<queue>-p<N>).
 *   --no-pr             Set autoCreatePr=false (agent runs but leaves no PR).
 *   --model <id>        Override model (default: "default").
 *
 * Setup:
 *   1. Generate an API key at https://cursor.com/dashboard → Integrations.
 *   2. Add to .env.local:        CURSOR_API_KEY=cur_...
 *   3. Commit nothing from .env.local. The key is SERVER_ONLY.
 *
 * Exit codes:
 *   0  OK (or dry-run printed)
 *   1  Usage / arg error
 *   2  Prompt not found in queue file
 *   3  CURSOR_API_KEY missing
 *   4  Cursor API returned non-2xx
 *   5  Git metadata unavailable (not a repo / no origin)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const API_URL = "https://api.cursor.com/v0/agents";

// --------------------------------------------------------------------------
// .env.local loader (matches scripts/check-env.mjs behavior)
// --------------------------------------------------------------------------

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

// --------------------------------------------------------------------------
// CLI arg parsing
// --------------------------------------------------------------------------

function parseArgs(argv) {
  const positional = [];
  const flags = {
    dryRun: false,
    ref: null,
    branch: null,
    autoCreatePr: true,
    model: "default",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--ref") flags.ref = argv[++i];
    else if (a === "--branch") flags.branch = argv[++i];
    else if (a === "--no-pr") flags.autoCreatePr = false;
    else if (a === "--model") flags.model = argv[++i];
    else if (a === "-h" || a === "--help") {
      printUsage();
      process.exit(0);
    } else if (a.startsWith("--")) {
      console.error(`Unknown flag: ${a}`);
      process.exit(1);
    } else positional.push(a);
  }
  return { positional, flags };
}

function printUsage() {
  console.log(
    [
      "Usage: node scripts/cursor-send.mjs <queue-file> <prompt-number|all> [flags]",
      "",
      "Flags:",
      "  --dry-run           Print payload, do not call the API",
      "  --ref <branch>      Source branch (default: main)",
      "  --branch <name>     New branch name (default: cursor/<queue>-p<N>)",
      "  --no-pr             Do not auto-create a PR",
      "  --model <id>        Override model",
    ].join("\n"),
  );
}

// --------------------------------------------------------------------------
// Queue-file parser
//
// Format expected (see docs/cursor-queue/README.md):
//   ## Prompt 1 — Short title
//
//   > **Task:** …
//   > …full blockquote body…
//
//   ---
//
// Rules:
//   - Prompt header matches /^## Prompt (\d+) —\s*(.*)$/.
//   - Prompt body is every line until the next `## Prompt` header or `^---$`.
//   - Only lines starting with `> ` or `>` are kept; the leading marker is stripped.
//   - Blank blockquote lines (`>` alone) become blank lines in the prompt.
// --------------------------------------------------------------------------

function parseQueue(markdown) {
  const lines = markdown.split("\n");
  const prompts = new Map();
  let current = null;
  let bodyLines = [];

  const flush = () => {
    if (current == null) return;
    prompts.set(current.number, {
      number: current.number,
      title: current.title,
      body: trimBody(bodyLines).join("\n"),
    });
    current = null;
    bodyLines = [];
  };

  for (const raw of lines) {
    const headerMatch = raw.match(/^##\s+Prompt\s+(\d+)\s*[—–-]\s*(.*)$/);
    if (headerMatch) {
      flush();
      current = {
        number: Number(headerMatch[1]),
        title: headerMatch[2].trim(),
      };
      continue;
    }
    if (current == null) continue;
    if (/^---\s*$/.test(raw)) {
      flush();
      continue;
    }
    // Keep blockquote lines only; strip "> " prefix.
    if (raw.startsWith("> ")) bodyLines.push(raw.slice(2));
    else if (raw === ">") bodyLines.push("");
    // Non-blockquote prose between header and blockquote is ignored.
  }
  flush();
  return prompts;
}

function trimBody(lines) {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === "") start++;
  while (end > start && lines[end - 1].trim() === "") end--;
  return lines.slice(start, end);
}

// --------------------------------------------------------------------------
// Git metadata
// --------------------------------------------------------------------------

function detectRepo() {
  let remote;
  try {
    remote = execSync("git remote get-url origin", {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
  // Normalize SSH → HTTPS
  //   git@github.com:Owner/Repo.git → https://github.com/Owner/Repo
  const ssh = remote.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (ssh) return `https://${ssh[1]}/${ssh[2]}`;
  const https = remote.match(/^https?:\/\/([^/]+)\/(.+?)(?:\.git)?$/);
  if (https) return `https://${https[1]}/${https[2]}`;
  return remote.replace(/\.git$/, "");
}

// --------------------------------------------------------------------------
// API call
// --------------------------------------------------------------------------

async function createAgent({ apiKey, payload }) {
  const auth = Buffer.from(`${apiKey}:`).toString("base64");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, ok: res.ok, body };
}

// --------------------------------------------------------------------------
// Log writer — append a line to .cursor-queue.log next to the queue file
// so we can tell which prompts have been sent.
// --------------------------------------------------------------------------

function logSend({ queueFile, promptNumber, agentId, dryRun }) {
  const logPath = path.join(
    path.dirname(queueFile),
    ".cursor-queue.log",
  );
  const line = [
    new Date().toISOString(),
    dryRun ? "DRY" : "SENT",
    path.basename(queueFile),
    `p${promptNumber}`,
    agentId || "-",
  ].join("\t");
  fs.appendFileSync(logPath, line + "\n", "utf8");
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------

async function main() {
  loadEnvLocal();
  const { positional, flags } = parseArgs(process.argv.slice(2));

  if (positional.length < 2) {
    printUsage();
    process.exit(1);
  }

  const queueFile = path.resolve(positional[0]);
  const target = positional[1];

  if (!fs.existsSync(queueFile)) {
    console.error(`Queue file not found: ${queueFile}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(queueFile, "utf8");
  const prompts = parseQueue(markdown);
  if (prompts.size === 0) {
    console.error(`No prompts found in ${queueFile}`);
    process.exit(2);
  }

  const numbers =
    target === "all"
      ? Array.from(prompts.keys()).sort((a, b) => a - b)
      : [Number(target)];

  for (const n of numbers) {
    if (!prompts.has(n)) {
      console.error(`Prompt ${n} not found in queue.`);
      process.exit(2);
    }
    await sendOne({ prompt: prompts.get(n), queueFile, flags });
  }
}

async function sendOne({ prompt, queueFile, flags }) {
  const repoUrl = detectRepo();
  if (!repoUrl) {
    console.error(
      "Could not detect the origin remote. Run inside a git repo with an 'origin' remote.",
    );
    process.exit(5);
  }

  const ref = flags.ref || "main";
  const queueSlug = path
    .basename(queueFile, path.extname(queueFile))
    .replace(/[^a-z0-9-]+/gi, "-")
    .toLowerCase();
  const branchName =
    flags.branch || `cursor/${queueSlug}-p${prompt.number}`;

  const payload = {
    prompt: {
      text:
        `# Prompt ${prompt.number} — ${prompt.title}\n\n${prompt.body}\n\n` +
        `_When finished, run \`npm run ready\` and report any failures in the PR body._`,
    },
    source: { repository: repoUrl, ref },
    target: {
      autoCreatePr: flags.autoCreatePr,
      branchName,
    },
    model: flags.model,
  };

  console.log(
    `\n── Prompt ${prompt.number}: ${prompt.title} ──`,
  );
  console.log(`   repo:   ${repoUrl}`);
  console.log(`   ref:    ${ref}`);
  console.log(`   branch: ${branchName}`);
  console.log(`   pr:     ${flags.autoCreatePr}`);
  console.log(`   chars:  ${payload.prompt.text.length}`);

  if (flags.dryRun) {
    console.log("   [dry-run] payload preview:");
    console.log(
      payload.prompt.text
        .split("\n")
        .map((l) => "   │ " + l)
        .join("\n"),
    );
    logSend({
      queueFile,
      promptNumber: prompt.number,
      agentId: null,
      dryRun: true,
    });
    return;
  }

  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error(
      "\nCURSOR_API_KEY is not set. Add it to .env.local (get the key from https://cursor.com/dashboard → Integrations).",
    );
    process.exit(3);
  }

  const res = await createAgent({ apiKey, payload });
  if (!res.ok) {
    console.error(`\nCursor API returned ${res.status}:`);
    console.error(
      typeof res.body === "string"
        ? res.body
        : JSON.stringify(res.body, null, 2),
    );
    process.exit(4);
  }

  const agentId =
    (res.body && (res.body.id || res.body.agentId)) || "unknown";
  const watchUrl =
    res.body && (res.body.url || res.body.dashboardUrl)
      ? res.body.url || res.body.dashboardUrl
      : `https://cursor.com/agents/${agentId}`;

  console.log(`   status: ${res.body.status || "created"}`);
  console.log(`   agent:  ${agentId}`);
  console.log(`   watch:  ${watchUrl}`);

  logSend({
    queueFile,
    promptNumber: prompt.number,
    agentId,
    dryRun: false,
  });
}

main().catch((err) => {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
