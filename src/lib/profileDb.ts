import type { SupabaseClient } from "@supabase/supabase-js";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";
import type { ProfileRecord } from "@/src/lib/profileTypes";

/** Max tags per array on write (API guard; DB may add CHECK later). */
export const PROFILE_TAG_ARRAY_MAX = 50;

export const PROFILE_SELECT_OWNER_EXTENDED =
  "id, username, display_name, bio, interests_intro, skills_intro, interests, skills, skills_offered, skills_curious, experience_note, credit_balance, location_label, is_discoverable, show_exact_location, travel_radius_km, availability_note, safety_tier_consent, lat, lng, avatar_url";

export const PROFILE_SELECT_OWNER_LEGACY =
  "id, username, display_name, bio, interests_intro, skills_intro, interests, skills, location_label, is_discoverable, lat, lng, avatar_url";

export const DISCOVERABLE_SELECT_EXTENDED =
  "id, username, display_name, location_label, interests, skills, skills_offered, skills_curious, is_discoverable, show_exact_location, travel_radius_km, lat, lng, availability_note";

export const DISCOVERABLE_SELECT_NO_NEW_ARRAYS =
  "id, username, display_name, location_label, interests, skills, is_discoverable, show_exact_location, travel_radius_km, lat, lng, availability_note";

export const DISCOVERABLE_SELECT_NO_VISIBILITY =
  "id, username, display_name, location_label, interests, skills, is_discoverable, lat, lng";

export const DISCOVERABLE_SELECT_EXTENDED_NO_COORDS =
  "id, username, display_name, location_label, interests, skills, skills_offered, skills_curious, is_discoverable, show_exact_location, travel_radius_km, availability_note";

export const DISCOVERABLE_SELECT_NO_NEW_ARRAYS_NO_COORDS =
  "id, username, display_name, location_label, interests, skills, is_discoverable, show_exact_location, travel_radius_km, availability_note";

export const DISCOVERABLE_SELECT_NO_VISIBILITY_NO_COORDS =
  "id, username, display_name, location_label, interests, skills, is_discoverable";

export const DISCOVERABLE_SELECT_MINIMAL =
  "id, username, display_name, location_label, interests, skills";

export function isMissingColumnError(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("column") && normalized.includes("does not exist");
}

export function clampTagArray(tags: unknown, max = PROFILE_TAG_ARRAY_MAX): string[] {
  if (!Array.isArray(tags)) return [];
  const unique = [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))];
  return unique.slice(0, max);
}

export function clampExperienceNote(note: string | null | undefined): string | null {
  if (note == null || note.trim() === "") return null;
  const t = note.trim();
  return t.length <= 280 ? t : t.slice(0, 280);
}

export function clampSafetyTierConsent(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 2;
  return Math.min(4, Math.max(1, Math.round(v)));
}

export function parseTravelRadiusKm(n: unknown): number | null {
  if (n === null || n === undefined || n === "") return null;
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v) || v < 0) return null;
  return Math.min(5000, Math.round(v));
}

type ProfileRow = Record<string, unknown>;

function stringArrayFrom(x: unknown): string[] {
  return Array.isArray(x) ? (x as string[]).map((s) => String(s).trim()).filter(Boolean) : [];
}

/** Prefer first non-empty array (handles pre-backfill rows where new cols are {}). */
function coalesceStringArray(preferred: unknown, fallback: unknown): string[] {
  const a = stringArrayFrom(preferred);
  if (a.length) return a;
  return stringArrayFrom(fallback);
}

/** Normalize DB row to ProfileRecord (owner view); merges legacy skills/interests with RFC columns. */
export function normalizeProfileRow(row: ProfileRow | null): ProfileRecord | null {
  if (!row) return null;
  const offered = coalesceStringArray(row.skills_offered, row.skills);
  const curious = coalesceStringArray(row.skills_curious, row.interests);
  const creditRaw = row.credit_balance;
  let creditBalance = 3;
  if (typeof creditRaw === "number" && Number.isFinite(creditRaw)) {
    creditBalance = creditRaw;
  } else if (typeof creditRaw === "string" && creditRaw.trim() !== "") {
    const n = Number(creditRaw);
    if (Number.isFinite(n)) creditBalance = n;
  }

  return {
    id: row.id as string,
    username: row.username as string,
    display_name: (row.display_name as string | null) ?? null,
    bio: (row.bio as string | null) ?? null,
    interests_intro: (row.interests_intro as string | null) ?? null,
    skills_intro: (row.skills_intro as string | null) ?? null,
    interests: curious,
    skills: offered,
    skills_offered: offered,
    skills_curious: curious,
    experience_note: (row.experience_note as string | null) ?? null,
    credit_balance: Number.isFinite(creditBalance) ? creditBalance : 3,
    location_label: (row.location_label as string | null) ?? null,
    is_discoverable: Boolean(row.is_discoverable),
    show_exact_location: row.show_exact_location === true,
    travel_radius_km:
      row.travel_radius_km === null || row.travel_radius_km === undefined
        ? null
        : Math.round(Number(row.travel_radius_km)),
    availability_note: (row.availability_note as string | null) ?? null,
    safety_tier_consent: clampSafetyTierConsent(row.safety_tier_consent),
    lat: row.lat != null && row.lat !== "" ? Number(row.lat) : null,
    lng: row.lng != null && row.lng !== "" ? Number(row.lng) : null,
    avatar_url: (row.avatar_url as string | null) ?? null,
  };
}

/** Public profile: strip economy/sensitive fields; hide coordinates unless user opted in. */
export function toPublicProfile(row: ProfileRecord): ProfileRecord {
  const showExact = row.show_exact_location === true;
  return {
    id: row.id,
    username: row.username,
    display_name: row.display_name,
    bio: row.bio,
    interests_intro: row.interests_intro,
    skills_intro: row.skills_intro,
    interests: row.interests,
    skills: row.skills,
    skills_offered: row.skills_offered,
    skills_curious: row.skills_curious,
    experience_note: row.experience_note,
    location_label: row.location_label,
    is_discoverable: row.is_discoverable,
    show_exact_location: row.show_exact_location,
    travel_radius_km: row.travel_radius_km,
    safety_tier_consent: row.safety_tier_consent,
    lat: showExact ? row.lat ?? null : null,
    lng: showExact ? row.lng ?? null : null,
    avatar_url: row.avatar_url ?? null,
  };
}

export function toDiscoverableProfile(row: ProfileRecord): DiscoverableProfile {
  const showExact = row.show_exact_location === true;
  return {
    id: row.id,
    username: row.username,
    display_name: row.display_name,
    location_label: row.location_label,
    interests: row.interests,
    skills: row.skills,
    lat: showExact ? row.lat ?? null : null,
    lng: showExact ? row.lng ?? null : null,
    is_discoverable: row.is_discoverable ?? null,
    show_exact_location: row.show_exact_location ?? null,
    travel_radius_km: row.travel_radius_km ?? null,
    skills_offered: row.skills_offered ?? row.skills ?? null,
    skills_curious: row.skills_curious ?? row.interests ?? null,
    availability_note: row.availability_note ?? null,
  };
}

export async function fetchProfileRowForOwner(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ profile: ProfileRecord | null; error: Error | null }> {
  const attempt = async (select: string) =>
    supabase.from("profiles").select(select).eq("id", userId).maybeSingle();

  let { data, error } = await attempt(PROFILE_SELECT_OWNER_EXTENDED);
  if (error && isMissingColumnError(error.message)) {
    ({ data, error } = await attempt(PROFILE_SELECT_OWNER_LEGACY));
  }

  if (error) {
    return { profile: null, error: new Error(error.message) };
  }
  return { profile: normalizeProfileRow((data ?? null) as ProfileRow | null), error: null };
}

export async function fetchProfileRowByUsername(
  supabase: SupabaseClient,
  username: string,
): Promise<{ profile: ProfileRecord | null; error: Error | null }> {
  const attempt = async (select: string) =>
    supabase.from("profiles").select(select).eq("username", username).maybeSingle();

  let { data, error } = await attempt(PROFILE_SELECT_OWNER_EXTENDED);
  if (error && isMissingColumnError(error.message)) {
    ({ data, error } = await attempt(PROFILE_SELECT_OWNER_LEGACY));
  }

  if (error) {
    return { profile: null, error: new Error(error.message) };
  }
  return { profile: normalizeProfileRow((data ?? null) as ProfileRow | null), error: null };
}
