-- Run in Supabase SQL Editor (project ref: yqnfdgwwgaehxfvjunfj)
-- Resets public.profiles to the canonical Dabble 2.0 schema + RLS policies.

-- Drop existing table and start clean
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Recreate with full schema
CREATE TABLE public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        text UNIQUE NOT NULL,
  display_name    text,
  interests_intro text,
  skills_intro    text,
  interests       text[]  NOT NULL DEFAULT '{}',
  skills          text[]  NOT NULL DEFAULT '{}',
  location_label  text,
  is_discoverable boolean NOT NULL DEFAULT false,
  lat             numeric,
  lng             numeric,
  avatar_url      text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Re-enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: users can insert their own profile
CREATE POLICY insert_own_profile ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Policy 2: anyone can read discoverable profiles (for /explore)
CREATE POLICY read_discoverable_profiles ON public.profiles
  FOR SELECT TO anon, authenticated
  USING (is_discoverable = true);

-- Policy 3: authenticated users can always read their own profile
CREATE POLICY read_own_profile ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Policy 4: users can only update their own profile
CREATE POLICY update_own_profile ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Auto-update updated_at on every change
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
