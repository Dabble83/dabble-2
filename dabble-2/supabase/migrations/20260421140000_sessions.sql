-- RFC 003 — Sessions, messages, ratings (apply after `20260420130000_credits.sql` when using credit_ledger.session_id FK).
-- File only — apply manually in Supabase when ready. See dabble-2/TODO.md.

-- ---------------------------------------------------------------------------
-- 1) sessions
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  session_type text NOT NULL,
  price_credits integer NOT NULL,
  status text NOT NULL DEFAULT 'proposed',
  location_summary text,
  scheduled_start_at timestamptz,
  scheduled_end_at timestamptz,
  proposed_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  learner_marked_complete_at timestamptz,
  teacher_marked_complete_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sessions_no_self_booking CHECK (learner_id <> teacher_id),
  CONSTRAINT sessions_type_check CHECK (session_type IN ('tip', 'short', 'walk_with')),
  CONSTRAINT sessions_status_check CHECK (
    status IN ('proposed', 'accepted', 'scheduled', 'completed', 'cancelled', 'no_show')
  ),
  CONSTRAINT sessions_price_positive CHECK (price_credits > 0)
);

CREATE INDEX IF NOT EXISTS sessions_learner_idx ON public.sessions (learner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS sessions_teacher_idx ON public.sessions (teacher_id, created_at DESC);
CREATE INDEX IF NOT EXISTS sessions_status_idx ON public.sessions (status);

COMMENT ON TABLE public.sessions IS 'RFC 003: neighbor session lifecycle; mutations via service role APIs.';

-- ---------------------------------------------------------------------------
-- 2) session_messages
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.session_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions (id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT session_messages_body_len CHECK (char_length(body) BETWEEN 1 AND 4000)
);

CREATE INDEX IF NOT EXISTS session_messages_session_created_idx
  ON public.session_messages (session_id, created_at ASC);

COMMENT ON TABLE public.session_messages IS 'RFC 003: thread scoped to one session.';

-- ---------------------------------------------------------------------------
-- 3) session_ratings
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.session_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions (id) ON DELETE CASCADE,
  rater_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  ratee_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  stars smallint NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT session_ratings_stars_range CHECK (stars BETWEEN 1 AND 5),
  CONSTRAINT session_ratings_note_len CHECK (note IS NULL OR char_length(note) <= 500),
  CONSTRAINT session_ratings_one_per_rater UNIQUE (session_id, rater_id)
);

CREATE INDEX IF NOT EXISTS session_ratings_session_idx ON public.session_ratings (session_id);

COMMENT ON TABLE public.session_ratings IS 'RFC 003: post-completion ratings; credit bonuses wired in app layer.';

-- ---------------------------------------------------------------------------
-- 4) Optional FK: credit_ledger.session_id → sessions.id (requires credits migration applied)
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  ALTER TABLE public.credit_ledger
    ADD CONSTRAINT credit_ledger_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES public.sessions (id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_table THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- 5) RLS (defense in depth; APIs use service_role)
-- ---------------------------------------------------------------------------

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_select_participant" ON public.sessions;
CREATE POLICY "sessions_select_participant"
  ON public.sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = learner_id OR auth.uid() = teacher_id);

DROP POLICY IF EXISTS "session_messages_select_participant" ON public.session_messages;
CREATE POLICY "session_messages_select_participant"
  ON public.session_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = session_id
        AND (auth.uid() = s.learner_id OR auth.uid() = s.teacher_id)
    )
  );

DROP POLICY IF EXISTS "session_messages_insert_participant" ON public.session_messages;
CREATE POLICY "session_messages_insert_participant"
  ON public.session_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = session_id
        AND (auth.uid() = s.learner_id OR auth.uid() = s.teacher_id)
        AND s.status NOT IN ('cancelled', 'no_show')
    )
  );

DROP POLICY IF EXISTS "session_ratings_select_participant" ON public.session_ratings;
CREATE POLICY "session_ratings_select_participant"
  ON public.session_ratings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.id = session_id
        AND (auth.uid() = s.learner_id OR auth.uid() = s.teacher_id)
    )
  );

GRANT SELECT ON public.sessions TO authenticated;
GRANT SELECT, INSERT ON public.session_messages TO authenticated;
GRANT SELECT ON public.session_ratings TO authenticated;

GRANT ALL ON public.sessions TO service_role;
GRANT ALL ON public.session_messages TO service_role;
GRANT ALL ON public.session_ratings TO service_role;
