import { NextRequest } from "next/server";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { isProfileComplete } from "@/src/lib/profileCompletion";
import { fail, ok } from "@/src/lib/apiResponses";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";
import { requireRouteUser } from "@/src/lib/routeAuth";

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, supabase);
  if (auth instanceof Response) return auth;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, bio, interests_intro, skills_intro, interests, skills, location_label, is_discoverable",
    )
    .eq("id", auth.user.id)
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
