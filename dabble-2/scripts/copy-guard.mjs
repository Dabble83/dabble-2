#!/usr/bin/env node
/**
 * Warns when retired marketing / positioning phrases reappear in source or docs.
 * Exits 0 always (non-blocking for CI); failures are console warnings.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const PHRASES = [
  "Skills travel best when they walk next door",
  "Phase 1 foundation",
  "neighbors learning together",
];

const SKIP_DIR_NAMES = new Set(["node_modules", ".next", ".git", "dist", "build"]);
const SKIP_FILE_NAMES = new Set(["copy-guard.mjs"]);
const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".jsx",
  ".md",
  ".mdx",
  ".css",
  ".html",
  ".json",
]);

function shouldSkipDir(rel) {
  const parts = rel.split(path.sep);
  if (parts.includes(".claude")) return true;
  return false;
}

/** @param {string} dir @param {string} rel */
function walk(dir, rel, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of entries) {
    const name = ent.name;
    const subRel = rel ? path.join(rel, name) : name;
    const full = path.join(dir, name);
    if (ent.isDirectory()) {
      if (SKIP_DIR_NAMES.has(name)) continue;
      if (shouldSkipDir(subRel)) continue;
      walk(full, subRel, out);
    } else {
      if (SKIP_FILE_NAMES.has(name)) continue;
      const ext = path.extname(name);
      if (!TEXT_EXT.has(ext)) continue;
      out.push({ full, rel: subRel });
    }
  }
}

function main() {
  const files = [];
  walk(root, "", files);

  const lowerPhrases = PHRASES.map((p) => p.toLowerCase());
  /** @type {{ file: string; phrase: string; line: number; snippet: string }[]} */
  const hits = [];

  for (const { full, rel } of files) {
    let text;
    try {
      text = fs.readFileSync(full, "utf8");
    } catch {
      continue;
    }
    const lower = text.toLowerCase();
    for (const phrase of lowerPhrases) {
      let idx = 0;
      while ((idx = lower.indexOf(phrase, idx)) !== -1) {
        const line = text.slice(0, idx).split(/\r?\n/).length;
        const lineStart = text.lastIndexOf("\n", idx - 1) + 1;
        const lineEnd = text.indexOf("\n", idx);
        const snippet = text
          .slice(lineStart, lineEnd === -1 ? undefined : lineEnd)
          .trim()
          .slice(0, 200);
        hits.push({
          file: rel,
          phrase,
          line,
          snippet,
        });
        idx += phrase.length;
      }
    }
  }

  if (hits.length) {
    console.warn("\n[copy-guard] Retired phrase(s) detected (please rewrite):\n");
    for (const h of hits) {
      console.warn(`  ${h.file}:${h.line}  —  "${h.phrase}"`);
      if (h.snippet) console.warn(`    ${h.snippet}`);
    }
    console.warn("\n[copy-guard] See docs for current voice / positioning.\n");
  } else {
    console.log("[copy-guard] OK — no retired phrases found.");
  }
}

main();
