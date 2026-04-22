import type { SupabaseClient } from "@supabase/supabase-js";
import { sessionDebitOnAccept, sessionPayTeacher, sessionRefundOnCancel } from "@/src/lib/credits";

export type SessionType = "tip" | "short" | "walk_with";

export type SessionStatus =
  | "proposed"
  | "accepted"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export const SESSION_PRICES: Record<SessionType, number> = {
  tip: 1,
  short: 3,
  walk_with: 6,
};

export type SessionRow = {
  id: string;
  learner_id: string;
  teacher_id: string;
  session_type: SessionType;
  price_credits: number;
  status: SessionStatus;
  location_summary: string | null;
  scheduled_start_at: string | null;
  scheduled_end_at: string | null;
  proposed_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  learner_marked_complete_at: string | null;
  teacher_marked_complete_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SessionResult = { ok: true; session: SessionRow } | { ok: false; error: string; status: number };

export function parseSessionType(raw: unknown): SessionType | null {
  if (raw === "tip" || raw === "short" || raw === "walk_with") return raw;
  return null;
}

export async function getSession(supabase: SupabaseClient, id: string): Promise<SessionRow | null> {
  const { data, error } = await supabase.from("sessions").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return data as SessionRow;
}

export function isParticipant(session: SessionRow, userId: string): boolean {
  return session.learner_id === userId || session.teacher_id === userId;
}

/** New messages allowed (read history still OK after cancel via RLS / API). */
export function messagesOpen(session: SessionRow): boolean {
  return session.status !== "cancelled" && session.status !== "no_show";
}

export async function proposeSession(
  supabase: SupabaseClient,
  input: {
    learnerId: string;
    teacherId: string;
    sessionType: SessionType;
    locationSummary?: string | null;
    scheduledStartAt?: string | null;
    scheduledEndAt?: string | null;
  },
): Promise<SessionResult> {
  if (input.learnerId === input.teacherId) {
    return { ok: false, error: "Learner and teacher must be different people.", status: 400 };
  }
  const price = SESSION_PRICES[input.sessionType];
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      learner_id: input.learnerId,
      teacher_id: input.teacherId,
      session_type: input.sessionType,
      price_credits: price,
      status: "proposed",
      location_summary: input.locationSummary?.trim() ? input.locationSummary.trim() : null,
      scheduled_start_at: input.scheduledStartAt ?? null,
      scheduled_end_at: input.scheduledEndAt ?? null,
    })
    .select("*")
    .single();

  if (error) {
    return { ok: false, error: error.message, status: 500 };
  }
  return { ok: true, session: data as SessionRow };
}

export async function acceptSession(
  supabase: SupabaseClient,
  input: {
    sessionId: string;
    teacherUserId: string;
    scheduledStartAt?: string | null;
    scheduledEndAt?: string | null;
  },
): Promise<SessionResult> {
  const row = await getSession(supabase, input.sessionId);
  if (!row) return { ok: false, error: "Session not found.", status: 404 };
  if (row.teacher_id !== input.teacherUserId) {
    return { ok: false, error: "Only the teacher can accept this session.", status: 403 };
  }
  if (row.status !== "proposed") {
    if (row.status === "accepted" || row.status === "scheduled") {
      return { ok: true, session: row };
    }
    return { ok: false, error: "This session cannot be accepted in its current state.", status: 409 };
  }

  const debit = await sessionDebitOnAccept(row.learner_id, row.price_credits, row.id, row.teacher_id);
  if (!debit.ok) {
    return { ok: false, error: debit.error, status: 400 };
  }

  const start = input.scheduledStartAt ?? row.scheduled_start_at;
  const end = input.scheduledEndAt ?? row.scheduled_end_at;
  const nextStatus: SessionStatus = start && end ? "scheduled" : "accepted";
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("sessions")
    .update({
      status: nextStatus,
      accepted_at: now,
      scheduled_start_at: start ?? null,
      scheduled_end_at: end ?? null,
      updated_at: now,
    })
    .eq("id", row.id)
    .eq("status", "proposed")
    .select("*")
    .maybeSingle();

  if (error || !data) {
    const refund = await sessionRefundOnCancel(row.learner_id, row.price_credits, row.id);
    if (!refund.ok) {
      return {
        ok: false,
        error: `${refund.error} (acceptance also failed; ops may need to reconcile session ${row.id})`,
        status: 500,
      };
    }
    return { ok: false, error: "Could not confirm acceptance; your debit was refunded.", status: 500 };
  }

  return { ok: true, session: data as SessionRow };
}

export async function cancelSession(
  supabase: SupabaseClient,
  input: { sessionId: string; actorUserId: string },
): Promise<SessionResult> {
  const row = await getSession(supabase, input.sessionId);
  if (!row) return { ok: false, error: "Session not found.", status: 404 };
  if (!isParticipant(row, input.actorUserId)) {
    return { ok: false, error: "You are not a party to this session.", status: 403 };
  }
  if (row.status === "cancelled") {
    return { ok: true, session: row };
  }
  if (["completed", "no_show"].includes(row.status)) {
    return { ok: false, error: "This session cannot be cancelled.", status: 409 };
  }

  const priorStatus = row.status;
  const needRefund = priorStatus === "accepted" || priorStatus === "scheduled";
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("sessions")
    .update({
      status: "cancelled",
      cancelled_at: now,
      updated_at: now,
    })
    .eq("id", row.id)
    .in("status", ["proposed", "accepted", "scheduled"])
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Could not cancel this session.", status: 500 };
  }

  if (needRefund) {
    const refund = await sessionRefundOnCancel(row.learner_id, row.price_credits, row.id);
    if (!refund.ok) {
      return {
        ok: false,
        error: `${refund.error} Session is marked cancelled; reconcile credits manually if needed.`,
        status: 500,
      };
    }
  }

  return { ok: true, session: data as SessionRow };
}

async function tryFinalizeCompletion(
  supabase: SupabaseClient,
  sessionId: string,
  now: string,
): Promise<SessionResult> {
  const fresh = await getSession(supabase, sessionId);
  if (!fresh) return { ok: false, error: "Session missing.", status: 500 };
  if (
    !fresh.learner_marked_complete_at ||
    !fresh.teacher_marked_complete_at ||
    fresh.status === "completed"
  ) {
    return { ok: true, session: fresh };
  }
  if (!["accepted", "scheduled"].includes(fresh.status)) {
    return { ok: true, session: fresh };
  }

  const pay = await sessionPayTeacher(fresh.teacher_id, fresh.price_credits, fresh.id, fresh.learner_id);
  if (!pay.ok) {
    return { ok: false, error: pay.error, status: 500 };
  }

  const { data: done, error: finErr } = await supabase
    .from("sessions")
    .update({
      status: "completed",
      completed_at: now,
      updated_at: now,
    })
    .eq("id", fresh.id)
    .in("status", ["accepted", "scheduled"])
    .select("*")
    .maybeSingle();

  if (finErr || !done) {
    const again = await getSession(supabase, fresh.id);
    if (again?.status === "completed") return { ok: true, session: again };
    return { ok: false, error: "Could not finalize session completion.", status: 500 };
  }
  return { ok: true, session: done as SessionRow };
}

export async function markSessionComplete(
  supabase: SupabaseClient,
  input: { sessionId: string; actorUserId: string },
): Promise<SessionResult> {
  const row = await getSession(supabase, input.sessionId);
  if (!row) return { ok: false, error: "Session not found.", status: 404 };
  if (!isParticipant(row, input.actorUserId)) {
    return { ok: false, error: "You are not a party to this session.", status: 403 };
  }
  if (row.status === "completed") {
    return { ok: true, session: row };
  }
  if (!["accepted", "scheduled"].includes(row.status)) {
    return { ok: false, error: "Session is not in a state that can be completed.", status: 409 };
  }

  const now = new Date().toISOString();
  const patch: Record<string, string> = { updated_at: now };
  if (input.actorUserId === row.learner_id && !row.learner_marked_complete_at) {
    patch.learner_marked_complete_at = now;
  } else if (input.actorUserId === row.teacher_id && !row.teacher_marked_complete_at) {
    patch.teacher_marked_complete_at = now;
  }

  if (Object.keys(patch).length > 1) {
    const { error } = await supabase.from("sessions").update(patch).eq("id", row.id);
    if (error) {
      return { ok: false, error: error.message, status: 500 };
    }
  }

  return tryFinalizeCompletion(supabase, input.sessionId, now);
}

export type SessionMessageRow = {
  id: string;
  session_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export async function listSessionMessages(
  supabase: SupabaseClient,
  sessionId: string,
): Promise<{ ok: true; messages: SessionMessageRow[] } | { ok: false; error: string; status: number }> {
  const { data, error } = await supabase
    .from("session_messages")
    .select("id, session_id, sender_id, body, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    return { ok: false, error: error.message, status: 500 };
  }
  return { ok: true, messages: (data ?? []) as SessionMessageRow[] };
}

export async function insertSessionMessage(
  supabase: SupabaseClient,
  input: { sessionId: string; senderId: string; body: string },
): Promise<
  { ok: true; message: SessionMessageRow } | { ok: false; error: string; status: number }
> {
  const trimmed = input.body.trim();
  if (trimmed.length < 1 || trimmed.length > 4000) {
    return { ok: false, error: "Message must be between 1 and 4000 characters.", status: 400 };
  }

  const session = await getSession(supabase, input.sessionId);
  if (!session) return { ok: false, error: "Session not found.", status: 404 };
  if (!isParticipant(session, input.senderId)) {
    return { ok: false, error: "You cannot post to this thread.", status: 403 };
  }
  if (!messagesOpen(session)) {
    return { ok: false, error: "This thread no longer accepts new messages.", status: 409 };
  }

  const { data, error } = await supabase
    .from("session_messages")
    .insert({
      session_id: input.sessionId,
      sender_id: input.senderId,
      body: trimmed,
    })
    .select("id, session_id, sender_id, body, created_at")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Failed to post message.", status: 500 };
  }
  return { ok: true, message: data as SessionMessageRow };
}
