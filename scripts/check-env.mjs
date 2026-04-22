#!/usr/bin/env node
/**
 * Reports documented env vars (from manifest below). Does not fail the build.
 * - In CI: always exit 0 (informational only).
 * - Locally: warns for vars you marked `warnIfMissing` once those phases are active.
 *
 * Loads `.env.local` into `process.env` when present so checks match `next dev` behavior.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const isCI =
  process.env.CI === "true" ||
  process.env.CI === "1" ||
  process.env.GITHUB_ACTIONS === "true";

/** @type {{ key: string, tier: 'PUBLIC' | 'SERVER_ONLY', phase: string, warnIfMissing?: boolean }[]} */
const DOCUMENTED = [
  {
    key: "NEXT_PUBLIC_ENABLE_MAPS",
    tier: "PUBLIC",
    phase: "Maps",
    warnIfMissing: false,
  },
  {
    key: "NEXT_PUBLIC_ENABLE_CREDITS",
    tier: "PUBLIC",
    phase: "Credits UI + ledger (omit or true; false hides)",
    warnIfMissing: false,
  },
  {
    key: "NEXT_PUBLIC_ENABLE_AI",
    tier: "PUBLIC",
    phase: "AI-assisted features",
    warnIfMissing: false,
  },
  {
    key: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
    tier: "PUBLIC",
    phase: "Maps",
    warnIfMissing: false,
  },
  {
    key: "NEXT_PUBLIC_FREE_SEED_PHASE",
    tier: "PUBLIC",
    phase: "Credits — grant 3 starter credits on first profile while under 10k members (RFC 002)",
    warnIfMissing: false,
  },
  {
    key: "GOOGLE_MAPS_SERVER_KEY",
    tier: "SERVER_ONLY",
    phase: "Maps / geocode",
    warnIfMissing: false,
  },
  {
    key: "NEXT_PUBLIC_SITE_URL",
    tier: "PUBLIC",
    phase: "Canonical origin for metadata, sitemap, and profile meta fetches",
    warnIfMissing: false,
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    tier: "PUBLIC",
    phase: "Auth & data",
    warnIfMissing: false,
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    tier: "PUBLIC",
    phase: "Auth & data",
    warnIfMissing: false,
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    tier: "SERVER_ONLY",
    phase: "Auth & data (admin scripts only)",
    warnIfMissing: false,
  },
  {
    key: "OPENAI_API_KEY",
    tier: "SERVER_ONLY",
    phase: "AI (optional)",
    warnIfMissing: false,
  },
];

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

function isSet(key) {
  const v = process.env[key];
  return typeof v === "string" && v.length > 0;
}

function main() {
  loadEnvLocal();

  console.log("[check-env] dabble-2 — documented variables\n");

  const warnings = [];
  const securityWarnings = [];

  for (const row of DOCUMENTED) {
    const set = isSet(row.key);
    const status = set ? "set" : "missing";
    console.log(
      `  ${row.key.padEnd(38)} ${status.padEnd(8)}  [${row.tier}]  (${row.phase})`,
    );
    if (!set && row.warnIfMissing) {
      warnings.push(row.key);
    }
  }

  // Security hygiene checks for local app env files.
  if (isSet("GITHUB_TOKEN")) {
    securityWarnings.push(
      "GITHUB_TOKEN is present in .env.local. Keep GitHub auth outside app env files.",
    );
  }

  if (isSet("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")) {
    securityWarnings.push(
      "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY should never be set. Service role keys must stay server-only.",
    );
  }

  // Conditional configuration warnings.
  // Keep in sync with `lib/flags.ts` `isMapsEnabled()` (literal "true" only).
  if (process.env.NEXT_PUBLIC_ENABLE_MAPS === "true" && !isSet("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")) {
    warnings.push("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (required when maps are enabled)");
  }

  if (warnings.length && !isCI) {
    console.warn(
      "\n[check-env] Warning: optional integration vars missing:",
      warnings.join(", "),
    );
  }

  if (securityWarnings.length) {
    console.warn("\n[check-env] Security warning(s):");
    for (const warning of securityWarnings) {
      console.warn(`  - ${warning}`);
    }
  }

  if (isCI) {
    console.log("\n[check-env] CI detected — exiting 0 (informational only).");
  }

  process.exit(0);
}

main();
