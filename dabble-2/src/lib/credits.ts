import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

export type CreditsResult = { ok: true } | { ok: false; error: string };

export type CreditLedgerInsertOptions = {
  idempotencyKey?: string;
  counterpartyUserId?: string | null;
  metadata?: Record<string, unknown>;
};

function isUniqueViolation(message: string, code?: string): boolean {
  return code === "23505" || message.toLowerCase().includes("duplicate key");
}

async function insertLedgerRow(
  supabase: SupabaseClient,
  params: {
    userId: string;
    delta: number;
    reason: string;
    sessionId?: string | null;
    idempotencyKey: string;
    counterpartyUserId?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<CreditsResult> {
  const { error } = await supabase.from("credit_ledger").insert({
    user_id: params.userId,
    delta: params.delta,
    currency: "CREDIT",
    reason: params.reason,
    session_id: params.sessionId ?? null,
    counterparty_user_id: params.counterpartyUserId ?? null,
    idempotency_key: params.idempotencyKey,
    metadata: params.metadata ?? {},
  });

  if (!error) return { ok: true };
  if (isUniqueViolation(error.message, error.code)) {
    return { ok: true };
  }
  return { ok: false, error: error.message };
}

/**
 * Credit the user (positive delta). Uses service-role Supabase client only — never call from the browser.
 */
export async function earn(
  userId: string,
  amount: number,
  reason: string,
  sessionId?: string | null,
  options?: CreditLedgerInsertOptions,
): Promise<CreditsResult> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase server configuration missing" };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "amount must be a positive finite number" };
  }

  const idempotencyKey = options?.idempotencyKey ?? randomUUID();

  return insertLedgerRow(supabase, {
    userId,
    delta: amount,
    reason,
    sessionId,
    idempotencyKey,
    counterpartyUserId: options?.counterpartyUserId,
    metadata: options?.metadata,
  });
}

/**
 * Debit the user (negative delta). Uses service-role Supabase client only — never call from the browser.
 * Insufficient balance causes Postgres to raise from trigger CHECK path; surfaced as insert error.
 */
export async function spend(
  userId: string,
  amount: number,
  reason: string,
  sessionId?: string | null,
  options?: CreditLedgerInsertOptions,
): Promise<CreditsResult> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase server configuration missing" };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "amount must be a positive finite number" };
  }

  const idempotencyKey = options?.idempotencyKey ?? randomUUID();

  return insertLedgerRow(supabase, {
    userId,
    delta: -amount,
    reason,
    sessionId,
    idempotencyKey,
    counterpartyUserId: options?.counterpartyUserId,
    metadata: options?.metadata,
  });
}

function seedPhaseEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_FREE_SEED_PHASE;
  return v === "true" || v === "1";
}

const SEED_MEMBER_CAP = 10_000;
const SEED_CREDITS = 3;

/**
 * Idempotent seed grant (RFC 002 §10.5): 3 credits on first profile row when flag is on and member count is under cap.
 * Intended to run from the profile upsert route after a new `profiles` row is created.
 */
export async function maybeGrantSeedSignupCredits(userId: string): Promise<CreditsResult> {
  if (!seedPhaseEnabled()) {
    return { ok: true };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase server configuration missing" };
  }

  const { count, error: countError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return { ok: false, error: countError.message };
  }
  if (count !== null && count >= SEED_MEMBER_CAP) {
    return { ok: true };
  }

  return earn(userId, SEED_CREDITS, "seed_signup", null, {
    idempotencyKey: `seed_signup:${userId}`,
    metadata: { phase: "free_seed", cap: SEED_MEMBER_CAP },
  });
}
