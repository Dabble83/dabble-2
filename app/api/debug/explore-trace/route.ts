import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";
import {
  DISCOVERABLE_SELECT_EXTENDED,
  isMissingColumnError,
  normalizeProfileRow,
  toDiscoverableProfile,
} from "@/src/lib/profileDb";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ step: "no_client" });
  }

  // Try the first select
  const { data, error } = await supabase
    .from("profiles")
    .select(DISCOVERABLE_SELECT_EXTENDED)
    .eq("is_discoverable", true)
    .limit(200);

  if (error) {
    return NextResponse.json({
      step: "query_error",
      isMissing: isMissingColumnError(error.message),
      error: error.message,
    });
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const normalized = rows.map((r) => normalizeProfileRow(r));
  const nonNull = normalized.filter((p) => p != null);
  const discoverable = nonNull.map(toDiscoverableProfile);

  return NextResponse.json({
    step: "ok",
    rawCount: rows.length,
    normalizedCount: nonNull.length,
    discoverableCount: discoverable.length,
    sample: discoverable.slice(0, 2).map((p) => ({
      username: p.username,
      lat: p.lat,
      is_discoverable: p.is_discoverable,
    })),
  });
}
