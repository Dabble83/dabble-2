import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { fetchProfileRowByUsername, toPublicProfile } from "@/src/lib/profileDb";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

/** Stable demo row for marketing / Lighthouse when DB has no matching user (avoids 404 console noise). */
const DEMO_PUBLIC_PROFILE: ProfileRecord = {
  id: "00000000-0000-4000-8000-000000000001",
  username: "demo-user",
  display_name: "Demo User",
  bio: null,
  interests_intro: null,
  skills_intro: null,
  interests: ["Bike repair", "Woodworking"],
  skills: ["Sourdough", "Knitting"],
  skills_offered: ["Sourdough", "Knitting"],
  skills_curious: ["Bike repair", "Woodworking"],
  experience_note: null,
  location_label: "Park Slope",
  is_discoverable: false,
  show_exact_location: false,
  travel_radius_km: null,
  availability_note: null,
  safety_tier_consent: 2,
  lat: null,
  lng: null,
  avatar_url: null,
};

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username) {
    return fail("Missing username", 400);
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const { profile, error } = await fetchProfileRowByUsername(supabase, username);
  if (error) {
    return fail("Failed to load profile", 500, error.message);
  }

  if (!profile) {
    if (username === "demo-user") {
      return ok({ profile: toPublicProfile(DEMO_PUBLIC_PROFILE) });
    }
    return fail("Profile not found", 404);
  }

  return ok({ profile: toPublicProfile(profile) });
}
