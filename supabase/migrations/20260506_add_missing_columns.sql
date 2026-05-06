-- Migration: Add missing extended profile columns
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/yqnfdgwwgaehxfvjunfj/sql/new
-- Safe to re-run (uses IF NOT EXISTS / DO blocks).

-- 1. Add all missing columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS skills_offered        text[]   NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS skills_curious        text[]   NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS experience_note       text,
  ADD COLUMN IF NOT EXISTS credit_balance        integer  NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS show_exact_location   boolean  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS travel_radius_km      integer,
  ADD COLUMN IF NOT EXISTS availability_note     text,
  ADD COLUMN IF NOT EXISTS safety_tier_consent   integer  NOT NULL DEFAULT 2;

-- 2. Backfill skills_offered / skills_curious from legacy skills / interests columns
UPDATE public.profiles
SET
  skills_offered = COALESCE(skills,    '{}'::text[]),
  skills_curious = COALESCE(interests, '{}'::text[])
WHERE skills_offered = '{}'::text[]
   OR skills_curious = '{}'::text[];

-- 3. Seed credit_balance = 3 for any nulls (defensive)
UPDATE public.profiles
SET credit_balance = 3
WHERE credit_balance IS NULL;

-- 4. Constraints (idempotent)
DO $$ BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_safety_tier_consent_range
    CHECK (safety_tier_consent BETWEEN 1 AND 4);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_experience_note_len
    CHECK (experience_note IS NULL OR char_length(experience_note) <= 280);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. Credit balance guard trigger (service_role can write balance, clients cannot)
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
    IF jwt_role IN ('authenticated', 'anon') THEN
      NEW.credit_balance := 3;
    END IF;
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.credit_balance IS DISTINCT FROM OLD.credit_balance THEN
    IF jwt_role IN ('authenticated', 'anon') THEN
      RAISE EXCEPTION 'credit_balance cannot be updated by clients'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_credit_balance_guard ON public.profiles;
CREATE TRIGGER profiles_credit_balance_guard
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.profiles_enforce_credit_balance_guard();

-- 6. Ensure the owner UPDATE policy exists
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Done. Verify with:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'profiles' ORDER BY ordinal_position;
