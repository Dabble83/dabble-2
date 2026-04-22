import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import {
  clampExperienceNote,
  clampSafetyTierConsent,
  clampTagArray,
  isMissingColumnError,
  parseTravelRadiusKm,
} from "@/src/lib/profileDb";
import { maybeGrantSeedSignupCredits } from "@/src/lib/credits";
import { requireRouteUser } from "@/src/lib/routeAuth";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

function toUsernameSeed(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const authResult = await requireRouteUser(request, supabase);
  if (authResult instanceof Response) {
    return authResult;
  }

  const body = (await request.json()) as {
    userId?: string;
    displayName?: string;
    bio?: string;
    username?: string;
    interestsIntro?: string;
    skillsIntro?: string;
    interests?: string[];
    skills?: string[];
    skillsCurious?: string[];
    skillsOffered?: string[];
    locationLabel?: string;
    isDiscoverable?: boolean;
    experienceNote?: string | null;
    showExactLocation?: boolean;
    travelRadiusKm?: number | null;
    availabilityNote?: string | null;
    safetyTierConsent?: number;
    lat?: number | null;
    lng?: number | null;
  };

  if (body.userId && body.userId !== authResult.user.id) {
    return fail("Forbidden", 403);
  }
  const userId = authResult.user.id;

  function parseOptionalLatLng(): { lat: number | null; lng: number | null } {
    const la = body.lat;
    const ln = body.lng;
    if (la == null || ln == null) return { lat: null, lng: null };
    const latN = typeof la === "number" ? la : Number(la);
    const lngN = typeof ln === "number" ? ln : Number(ln);
    if (!Number.isFinite(latN) || !Number.isFinite(lngN)) return { lat: null, lng: null };
    if (latN < -90 || latN > 90 || lngN < -180 || lngN > 180) return { lat: null, lng: null };
    return { lat: latN, lng: lngN };
  }

  const coords = parseOptionalLatLng();

  const displayName = body.displayName?.trim() || null;
  const usernameInput = body.username?.trim();
  const candidateUsername = usernameInput
    ? toUsernameSeed(usernameInput)
    : displayName
      ? toUsernameSeed(displayName)
      : `dabbler-${userId.slice(0, 8)}`;
  const username = candidateUsername || `dabbler-${userId.slice(0, 8)}`;

  const { data: existingUsername } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .maybeSingle();
  if (existingUsername?.id) {
    return fail("That username is already in use. Please choose another.", 409);
  }

  const { data: existingProfileRow } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  const isNewProfile = !existingProfileRow?.id;

  const skillsOffered = clampTagArray(body.skillsOffered ?? body.skills);
  const skillsCurious = clampTagArray(body.skillsCurious ?? body.interests);

  const extendedPayload = {
    id: userId,
    username,
    display_name: displayName,
    bio: body.bio?.trim() ? body.bio.trim() : null,
    interests_intro: body.interestsIntro ?? null,
    skills_intro: body.skillsIntro ?? null,
    interests: skillsCurious,
    skills: skillsOffered,
    skills_offered: skillsOffered,
    skills_curious: skillsCurious,
    experience_note: clampExperienceNote(body.experienceNote ?? undefined),
    location_label: body.locationLabel ?? null,
    is_discoverable: body.isDiscoverable ?? false,
    show_exact_location: body.showExactLocation ?? false,
    travel_radius_km: parseTravelRadiusKm(body.travelRadiusKm),
    availability_note: body.availabilityNote?.trim() ? body.availabilityNote.trim() : null,
    safety_tier_consent: clampSafetyTierConsent(body.safetyTierConsent ?? 2),
    lat: coords.lat,
    lng: coords.lng,
  };

  const extendedPayloadNoCoords = {
    id: userId,
    username,
    display_name: displayName,
    bio: body.bio?.trim() ? body.bio.trim() : null,
    interests_intro: body.interestsIntro ?? null,
    skills_intro: body.skillsIntro ?? null,
    interests: skillsCurious,
    skills: skillsOffered,
    skills_offered: skillsOffered,
    skills_curious: skillsCurious,
    experience_note: clampExperienceNote(body.experienceNote ?? undefined),
    location_label: body.locationLabel ?? null,
    is_discoverable: body.isDiscoverable ?? false,
    show_exact_location: body.showExactLocation ?? false,
    travel_radius_km: parseTravelRadiusKm(body.travelRadiusKm),
    availability_note: body.availabilityNote?.trim() ? body.availabilityNote.trim() : null,
    safety_tier_consent: clampSafetyTierConsent(body.safetyTierConsent ?? 2),
  };

  const legacyPayload = {
    id: userId,
    username,
    display_name: displayName,
    bio: body.bio?.trim() ? body.bio.trim() : null,
    interests_intro: body.interestsIntro ?? null,
    skills_intro: body.skillsIntro ?? null,
    interests: skillsCurious,
    skills: skillsOffered,
    location_label: body.locationLabel ?? null,
    is_discoverable: body.isDiscoverable ?? false,
  };

  const corePayload = {
    id: userId,
    username,
    display_name: displayName,
    interests: skillsCurious,
    skills: skillsOffered,
  };

  const tryUpsert = async (payload: Record<string, unknown>) =>
    supabase.from("profiles").upsert(payload, { onConflict: "id" }).select("id, username, display_name").single();

  let { data, error } = await tryUpsert(extendedPayload);
  if (error && isMissingColumnError(error.message)) {
    ({ data, error } = await tryUpsert(extendedPayloadNoCoords));
  }
  if (error && isMissingColumnError(error.message)) {
    ({ data, error } = await tryUpsert(legacyPayload));
  }
  if (error && isMissingColumnError(error.message)) {
    ({ data, error } = await tryUpsert(corePayload));
  }

  if (error) {
    return fail("Failed to update profile", 500, error.message);
  }

  if (isNewProfile) {
    const seed = await maybeGrantSeedSignupCredits(userId);
    if (!seed.ok) {
      console.error("[credits] seed signup grant failed:", seed.error);
    }
  }

  return ok({ profile: data });
}
