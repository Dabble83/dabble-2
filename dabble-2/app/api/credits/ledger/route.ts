import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { requireRouteUser } from "@/src/lib/routeAuth";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_OFFSET = 10_000;

function parseIntParam(raw: string | null, fallback: number, max: number): number {
  if (raw == null || raw.trim() === "") return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.min(n, max);
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, supabase);
  if (auth instanceof Response) return auth;

  const { searchParams } = request.nextUrl;
  const limit = parseIntParam(searchParams.get("limit"), DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseIntParam(searchParams.get("offset"), 0, MAX_OFFSET);

  const { data, error, count } = await supabase
    .from("credit_ledger")
    .select(
      "id, user_id, delta, currency, reason, session_id, counterparty_user_id, idempotency_key, metadata, created_at",
      { count: "exact" },
    )
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return fail("Failed to load credit ledger", 500, error.message);
  }

  const rows = data ?? [];
  const total = count ?? rows.length;
  const hasMore = offset + rows.length < total;

  return ok({
    entries: rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      delta: row.delta,
      currency: row.currency,
      reason: row.reason,
      sessionId: row.session_id,
      counterpartyUserId: row.counterparty_user_id,
      idempotencyKey: row.idempotency_key,
      metadata: row.metadata,
      createdAt: row.created_at,
    })),
    limit,
    offset,
    total,
    hasMore,
  });
}
