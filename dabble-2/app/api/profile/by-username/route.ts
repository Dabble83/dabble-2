import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
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

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, bio, interests_intro, skills_intro, interests, skills, location_label, is_discoverable",
    )
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return fail("Failed to load profile", 500, error.message);
  }

  if (!data) {
    return fail("Profile not found", 404);
  }

  return ok({ profile: data });
}
