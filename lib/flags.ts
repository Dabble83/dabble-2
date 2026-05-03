/**
 * Typed feature flags (NEXT_PUBLIC_*). Single source of truth for client + server bundles.
 *
 * Each function must read process.env.NEXT_PUBLIC_* with literal dot notation so
 * Next.js can statically inline the value into the client bundle at build time.
 * Dynamic bracket access (process.env[name]) is not replaced by the bundler and
 * always returns undefined in the browser.
 */

/** Google Maps / explore map module. Only the literal string `"true"` enables. */
export function isMapsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MAPS === "true";
}

/**
 * Credits balance, ledger, and session debits. Defaults on when unset;
 * set `NEXT_PUBLIC_ENABLE_CREDITS=false` to hide.
 */
export function isCreditsEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_ENABLE_CREDITS?.trim().toLowerCase();
  if (v === undefined || v === "") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return true;
}

/** Starter credits seed while member count is under cap (see `maybeGrantSeedSignupCredits`). */
export function isFreeSeedPhase(): boolean {
  const v = process.env.NEXT_PUBLIC_FREE_SEED_PHASE?.trim().toLowerCase();
  return v === "true" || v === "1";
}

/** AI-assisted flows (profile copy, images, etc.). */
export function isAIEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_AI === "true";
}
