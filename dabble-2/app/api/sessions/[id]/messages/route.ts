import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { requireRouteUser } from "@/src/lib/routeAuth";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";
import { isUuid } from "@/src/lib/isUuid";
import { getSession, insertSessionMessage, isParticipant, listSessionMessages } from "@/src/lib/sessions";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, supabase);
  if (auth instanceof Response) return auth;

  const { id } = await ctx.params;
  if (!isUuid(id)) {
    return fail("Invalid session id.", 400);
  }

  const session = await getSession(supabase, id);
  if (!session) {
    return fail("Session not found.", 404);
  }
  if (!isParticipant(session, auth.user.id)) {
    return fail("Forbidden", 403);
  }

  const list = await listSessionMessages(supabase, id);
  if (!list.ok) {
    return fail(list.error, list.status);
  }

  return ok({ messages: list.messages });
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, supabase);
  if (auth instanceof Response) return auth;

  const { id } = await ctx.params;
  if (!isUuid(id)) {
    return fail("Invalid session id.", 400);
  }

  const body = (await request.json()) as { body?: string };
  const text = body.body;
  if (typeof text !== "string") {
    return fail("body must be a string.", 400);
  }

  const posted = await insertSessionMessage(supabase, {
    sessionId: id,
    senderId: auth.user.id,
    body: text,
  });

  if (!posted.ok) {
    return fail(posted.error, posted.status);
  }

  return ok({ message: posted.message });
}
