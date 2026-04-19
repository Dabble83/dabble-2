import type { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { requireRouteUser } from "@/src/lib/routeAuth";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, supabase);
  if (auth instanceof Response) return auth;

  const { data, error } = await supabase
    .from("credit_balances")
    .select("user_id, available_credits, held_credits, updated_at")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return fail("Failed to load credit balance", 500, error.message);
  }

  if (!data) {
    return ok({
      balance: {
        userId: auth.user.id,
        availableCredits: 0,
        heldCredits: 0,
        updatedAt: null as string | null,
      },
    });
  }

  return ok({
    balance: {
      userId: data.user_id,
      availableCredits: data.available_credits,
      heldCredits: data.held_credits,
      updatedAt: data.updated_at,
    },
  });
}
