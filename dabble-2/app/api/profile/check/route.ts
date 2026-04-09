import { NextRequest } from "next/server";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { isProfileComplete } from "@/src/lib/profileCompletion";
import { fail, ok } from "@/src/lib/apiResponses";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return fail("Missing userId", 400);
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, interests_intro, skills_intro, interests, skills, location_label, is_discoverable",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return fail("Failed to check profile", 500, error.message);
  }

  const profile = (data ?? null) as ProfileRecord | null;
  return ok({
    complete: isProfileComplete(profile),
    username: profile?.username ?? null,
  });
}
