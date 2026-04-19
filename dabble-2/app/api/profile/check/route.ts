import { NextRequest } from "next/server";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { isProfileComplete } from "@/src/lib/profileCompletion";
import { fail, ok } from "@/src/lib/apiResponses";
import { fetchProfileRowForOwner } from "@/src/lib/profileDb";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";
import { requireRouteUser } from "@/src/lib/routeAuth";

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, supabase);
  if (auth instanceof Response) return auth;

  const { profile, error } = await fetchProfileRowForOwner(supabase, auth.user.id);
  if (error) {
    return fail("Failed to check profile", 500, error.message);
  }

  const p = profile as ProfileRecord | null;
  return ok({
    complete: isProfileComplete(p),
    username: p?.username ?? null,
  });
}
