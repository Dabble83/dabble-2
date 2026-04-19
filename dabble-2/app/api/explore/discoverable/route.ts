import type { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { filterDiscoverableProfiles } from "@/src/lib/exploreCategories";
import type { ExploreCategoryId } from "@/src/lib/exploreTypes";
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

const DISCOVER_PAGE_SIZE = 200;

async function runDiscoverQuery(
  supabase: SupabaseClient,
  select: string,
  discoverableOnly: boolean,
) {
  let q = supabase.from("profiles").select(select).limit(DISCOVER_PAGE_SIZE);
  if (discoverableOnly) {
    q = q.eq("is_discoverable", true);
  }
  return q;
}

const VALID_CATS: ExploreCategoryId[] = ["outdoor", "diy", "craft", "food", "music"];

function parseExploreFilters(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawCats = searchParams.get("cat")?.split(",").filter(Boolean) ?? [];
  const categories = rawCats.filter((c): c is ExploreCategoryId => VALID_CATS.includes(c as ExploreCategoryId));
  const olat = Number(searchParams.get("olat"));
  const olng = Number(searchParams.get("olng"));
  const origin =
    Number.isFinite(olat) && Number.isFinite(olng) ? { lat: olat, lng: olng } : null;
  const kmParsed = Number(searchParams.get("km"));
  const maxKm =
    origin != null
      ? Number.isFinite(kmParsed) && kmParsed >= 1 && kmParsed <= 50
        ? Math.round(kmParsed)
        : 50
      : null;
  const teachingOnly = searchParams.get("now") === "1";
  return { categories, maxKm, origin, teachingOnly };
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const filters = parseExploreFilters(request);

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

    const profiles = filterDiscoverableProfiles(
      rows
        .map((raw) => normalizeProfileRow(raw))
        .filter((p): p is NonNullable<typeof p> => p != null)
        .map(toDiscoverableProfile),
      {
        categories: filters.categories,
        maxKm: filters.origin ? filters.maxKm : null,
        origin: filters.origin,
        teachingOnly: filters.teachingOnly,
      },
    );

    return ok({ profiles });
  }

  return fail("Failed to load discoverable profiles", 500, lastError ?? "unknown");
}
