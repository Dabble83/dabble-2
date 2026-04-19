import type { SupabaseClient } from "@supabase/supabase-js";
import { fail, ok } from "@/src/lib/apiResponses";
import {
  DISCOVERABLE_SELECT_EXTENDED,
  DISCOVERABLE_SELECT_EXTENDED_NO_COORDS,
  DISCOVERABLE_SELECT_MINIMAL,
  DISCOVERABLE_SELECT_NO_NEW_ARRAYS,
  DISCOVERABLE_SELECT_NO_NEW_ARRAYS_NO_COORDS,
  DISCOVERABLE_SELECT_NO_VISIBILITY,
  DISCOVERABLE_SELECT_NO_VISIBILITY_NO_COORDS,
  isMissingColumnError,
  normalizeProfileRow,
  toDiscoverableProfile,
} from "@/src/lib/profileDb";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

type ProfileRow = Record<string, unknown>;

function withNullCoords(rows: ProfileRow[]): ProfileRow[] {
  return rows.map((p) => ({ ...p, lat: null, lng: null }));
}

async function runDiscoverQuery(
  supabase: SupabaseClient,
  select: string,
  discoverableOnly: boolean,
) {
  let q = supabase.from("profiles").select(select).limit(60);
  if (discoverableOnly) {
    q = q.eq("is_discoverable", true);
  }
  return q;
}

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const selectAttempts: { select: string; discoverableOnly: boolean; nullCoords?: boolean }[] = [
    { select: DISCOVERABLE_SELECT_EXTENDED, discoverableOnly: true },
    { select: DISCOVERABLE_SELECT_NO_NEW_ARRAYS, discoverableOnly: true },
    { select: DISCOVERABLE_SELECT_NO_VISIBILITY, discoverableOnly: true },
    { select: DISCOVERABLE_SELECT_EXTENDED_NO_COORDS, discoverableOnly: true, nullCoords: true },
    { select: DISCOVERABLE_SELECT_NO_NEW_ARRAYS_NO_COORDS, discoverableOnly: true, nullCoords: true },
    { select: DISCOVERABLE_SELECT_NO_VISIBILITY_NO_COORDS, discoverableOnly: true, nullCoords: true },
    { select: DISCOVERABLE_SELECT_MINIMAL, discoverableOnly: false },
  ];

  let lastError: string | null = null;

  for (const attempt of selectAttempts) {
    const { data, error } = await runDiscoverQuery(
      supabase,
      attempt.select,
      attempt.discoverableOnly,
    );

    if (error) {
      const msg = error.message.toLowerCase();
      lastError = error.message;
      if (isMissingColumnError(error.message)) continue;
      if (msg.includes("is_discoverable")) continue;
      return fail("Failed to load discoverable profiles", 500, error.message);
    }

    let rows = (data ?? []) as unknown as ProfileRow[];
    if (attempt.nullCoords) rows = withNullCoords(rows);
    if (!attempt.discoverableOnly) {
      rows = rows.map((p) => ({
        ...p,
        is_discoverable: true,
        lat: p.lat ?? null,
        lng: p.lng ?? null,
        show_exact_location: p.show_exact_location ?? false,
        travel_radius_km: p.travel_radius_km ?? null,
      }));
    }

    const profiles = rows
      .map((raw) => normalizeProfileRow(raw))
      .filter((p): p is NonNullable<typeof p> => p != null)
      .map(toDiscoverableProfile);

    return ok({ profiles });
  }

  return fail("Failed to load discoverable profiles", 500, lastError ?? "unknown");
}
