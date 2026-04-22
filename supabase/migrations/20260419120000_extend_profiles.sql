-- RFC 001 — Extend public.profiles (skills_offered / skills_curious, credits, visibility, safety tier).
-- Run manually in the Supabase SQL Editor (or via CLI) when ready. Safe to re-run pieces with IF NOT EXISTS / exception guards.
-- Do NOT run from the app; this file is the canonical migration script.

-- ---------------------------------------------------------------------------
-- 1) Columns (additive)
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS skills_offered text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS skills_curious text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS experience_note text,
  ADD COLUMN IF NOT EXISTS credit_balance integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS show_exact_location boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS travel_radius_km integer,
  ADD COLUMN IF NOT EXISTS availability_note text,
  ADD COLUMN IF NOT EXISTS safety_tier_consent integer NOT NULL DEFAULT 2;

-- ---------------------------------------------------------------------------
-- 2) Backfill from legacy arrays + safe defaults
-- ---------------------------------------------------------------------------

UPDATE public.profiles
SET
  skills_offered = COALESCE(skills, '{}'::text[]),
  skills_curious = COALESCE(interests, '{}'::text[]);

-- Seed credits: new column already defaults to 3; ensure nulls never remain (defensive).
UPDATE public.profiles
SET credit_balance = 3
WHERE credit_balance IS NULL;

-- ---------------------------------------------------------------------------
-- 3) Constraints
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_safety_tier_consent_range
    CHECK (safety_tier_consent BETWEEN 1 AND 4);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_experience_note_len
    CHECK (experience_note IS NULL OR char_length(experience_note) <= 280);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- 4) credit_balance guard (service_role only may change balance)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.profiles_enforce_credit_balance_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := COALESCE(auth.jwt() ->> 'role', '');

  IF TG_OP = 'INSERT' THEN
    IF jwt_role = 'service_role' THEN
      RETURN NEW;
    END IF;
    IF jwt_role IN ('authenticated', 'anon') THEN
      NEW.credit_balance := 3;
      RETURN NEW;
    END IF;
    -- SQL editor / maintenance (no JWT): leave NEW untouched
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.credit_balance IS DISTINCT FROM OLD.credit_balance THEN
    IF jwt_role = 'service_role' THEN
      RETURN NEW;
    END IF;
    IF jwt_role IN ('authenticated', 'anon') THEN
      RAISE EXCEPTION 'credit_balance cannot be updated by clients'
        USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_credit_balance_guard ON public.profiles;
CREATE TRIGGER profiles_credit_balance_guard
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.profiles_enforce_credit_balance_guard();

-- ---------------------------------------------------------------------------
-- 5) RLS — keep existing policies; document + ensure UPDATE policy exists
-- ---------------------------------------------------------------------------

-- Re-assert owner UPDATE policy (idempotent if definition matches).
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

COMMENT ON POLICY "Users can update their own profile" ON public.profiles IS
  'RFC 001: clients cannot change credit_balance; enforced by trigger profiles_credit_balance_guard unless JWT role is service_role.';
