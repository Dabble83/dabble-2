import { NextRequest } from "next/server";
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
  const userId = auth.user.id;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, interests_intro, skills_intro, interests, skills, location_label, is_discoverable",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return fail("Failed to load profile", 500, error.message);
  }

  return ok({ profile: data ?? null });
}

