import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { fetchProfileRowByUsername, toPublicProfile } from "@/src/lib/profileDb";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

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
    return fail("Profile not found", 404);
  }

  return ok({ profile: toPublicProfile(profile) });
}
