import type { NextRequest } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { fail } from "@/src/lib/apiResponses";

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim() || null;
}

export async function requireRouteUser(
  request: NextRequest,
  supabase: SupabaseClient,
): Promise<{ user: User } | Response> {
  const token = getBearerToken(request);
  if (!token) {
    return fail("Unauthorized", 401);
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return fail("Unauthorized", 401);
  }

  return { user: data.user };
}