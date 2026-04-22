import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { requireRouteUser } from "@/src/lib/routeAuth";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";
import { isUuid } from "@/src/lib/isUuid";
import { parseSessionType, proposeSession } from "@/src/lib/sessions";

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, supabase);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as {
    teacherId?: string;
    sessionType?: string;
    locationSummary?: string | null;
    scheduledStartAt?: string | null;
    scheduledEndAt?: string | null;
  };

  const teacherId = body.teacherId?.trim();
  if (!teacherId || !isUuid(teacherId)) {
    return fail("teacherId must be a valid UUID.", 400);
  }

  const sessionType = parseSessionType(body.sessionType);
  if (!sessionType) {
    return fail("sessionType must be tip, short, or walk_with.", 400);
  }

  const result = await proposeSession(supabase, {
    learnerId: auth.user.id,
    teacherId,
    sessionType,
    locationSummary: body.locationSummary ?? null,
    scheduledStartAt: body.scheduledStartAt ?? null,
    scheduledEndAt: body.scheduledEndAt ?? null,
  });

  if (!result.ok) {
    return fail(result.error, result.status);
  }

  return ok({ session: result.session });
}
