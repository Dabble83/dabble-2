import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { requireRouteUser } from "@/src/lib/routeAuth";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";
import { isUuid } from "@/src/lib/isUuid";
import { acceptSession } from "@/src/lib/sessions";

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, supabase);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as {
    sessionId?: string;
    scheduledStartAt?: string | null;
    scheduledEndAt?: string | null;
  };

  const sessionId = body.sessionId?.trim();
  if (!sessionId || !isUuid(sessionId)) {
    return fail("sessionId must be a valid UUID.", 400);
  }

  const result = await acceptSession(supabase, {
    sessionId,
    teacherUserId: auth.user.id,
    scheduledStartAt: body.scheduledStartAt ?? null,
    scheduledEndAt: body.scheduledEndAt ?? null,
  });

  if (!result.ok) {
    return fail(result.error, result.status);
  }

  return ok({ session: result.session });
}
