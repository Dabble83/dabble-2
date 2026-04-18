-- Run in Supabase SQL Editor for project ref: yqnfdgwwgaehxfvjunfj
-- Canonical profiles reset (matches app expectations + Task A schema).

-- Drop existing table and all dependent objects
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Recreate with correct schema
CREATE TABLE public.profiles (
  id                uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username          text        UNIQUE NOT NULL,
  display_name      text,
  bio               text,
  interests         text[]      DEFAULT '{}',
  skills            text[]      DEFAULT '{}',
  interests_intro   text,
  skills_intro      text,
  location_label    text,
  is_discoverable   boolean     DEFAULT false,
  lat               numeric,
  lng               numeric,
  avatar_url        text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
