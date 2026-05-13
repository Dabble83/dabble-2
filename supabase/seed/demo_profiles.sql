-- Demo seed profiles for Dabble
-- Principle: names and interests are deliberately scrambled — no name signals
-- a particular ethnicity, and no interest is paired to match a perceived
-- background. The goal is to model what Dabble actually is: people who
-- contain multitudes and defy easy categorisation.
--
-- Run in Supabase SQL Editor:
--   https://supabase.com/dashboard/project/yqnfdgwwgaehxfvjunfj/sql/new
--
-- Safe to re-run — deletes existing demo accounts first, then recreates them.

DO $$
DECLARE
  uid uuid;
BEGIN

  -- Helper: create auth user + profile in one go
  -- We delete by email first so re-runs are safe

  -- 1. Margaret Osei
  DELETE FROM auth.users WHERE email = 'margaret_osei@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'margaret_osei@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'margaret_osei', 'Margaret Osei', 'Retired civil engineer who got serious about sourdough during a long winter. Still reads blueprints for fun.',
    ARRAY['sourdough baking','structural drawing','woodworking']::text[],
    ARRAY['wheel-thrown pottery','beekeeping']::text[],
    'East Austin, TX', true, 30.2672, -97.7151, 6, true, 15, 2);

  -- 2. Theo Nakamura
  DELETE FROM auth.users WHERE email = 'theo_nakamura@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'theo_nakamura@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'theo_nakamura', 'Theo Nakamura', 'High school history teacher and obsessive birder. I can identify 200+ species by call alone.',
    ARRAY['birdwatching','essay writing','map reading']::text[],
    ARRAY['leatherworking','upright bass']::text[],
    'South Congress, Austin TX', true, 30.2500, -97.7500, 6, true, 15, 2);

  -- 3. Priya O'Connell
  DELETE FROM auth.users WHERE email = 'priya_oconnell@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'priya_oconnell@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'priya_oconnell', 'Priya O''Connell', 'Software engineer by day, competitive fencer by evening. I teach beginner épée and want to learn to sail.',
    ARRAY['fencing (épée)','Python','technical writing']::text[],
    ARRAY['sailing','oil painting']::text[],
    'Hyde Park, Austin TX', true, 30.3100, -97.7300, 6, true, 15, 2);

  -- 4. Darnell Kowalski
  DELETE FROM auth.users WHERE email = 'darnell_kowalski@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'darnell_kowalski@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'darnell_kowalski', 'Darnell Kowalski', 'Plumber by trade. Spends weekends doing botanical illustration — mostly native Texas plants.',
    ARRAY['plumbing','botanical illustration','plant ID']::text[],
    ARRAY['natural dyeing','bookbinding']::text[],
    'North Loop, Austin TX', true, 30.3200, -97.7100, 6, true, 15, 2);

  -- 5. Claire Abara
  DELETE FROM auth.users WHERE email = 'claire_abara@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'claire_abara@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'claire_abara', 'Claire Abara', 'Pastry chef at a small restaurant. Outside of work I restore vintage bicycles and argue about jazz.',
    ARRAY['pastry & laminated doughs','bicycle repair','jazz history']::text[],
    ARRAY['screen printing','canning & preserves']::text[],
    'Bouldin Creek, Austin TX', true, 30.2450, -97.7600, 6, true, 15, 2);

  -- 6. Felix Santos
  DELETE FROM auth.users WHERE email = 'felix_santos@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'felix_santos@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'felix_santos', 'Felix Santos', 'Landscape architect who moonlights as a stand-up comedian. Neither career is going as planned but both are fun.',
    ARRAY['landscape design','stand-up comedy','native plant gardening']::text[],
    ARRAY['fermentation','furniture making']::text[],
    'Clarksville, Austin TX', true, 30.2800, -97.7600, 6, true, 15, 2);

  -- 7. Ruth Bergström
  DELETE FROM auth.users WHERE email = 'ruth_bergstrom@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'ruth_bergstrom@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'ruth_bergstrom', 'Ruth Bergström', 'Nurse practitioner and amateur radio operator. I talk to strangers on shortwave from my back porch most nights.',
    ARRAY['ham radio (shortwave)','wilderness first aid','sourdough baking']::text[],
    ARRAY['astrophotography','stone carving']::text[],
    'Travis Heights, Austin TX', true, 30.2380, -97.7420, 6, true, 15, 2);

  -- 8. Oscar Pham
  DELETE FROM auth.users WHERE email = 'oscar_pham@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'oscar_pham@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'oscar_pham', 'Oscar Pham', 'Accountant who builds custom mechanical keyboards. I also teach beginner rock climbing on weekends.',
    ARRAY['mechanical keyboard building','rock climbing (beginner instruction)','tax prep basics']::text[],
    ARRAY['glassblowing','urban sketching']::text[],
    'Cherrywood, Austin TX', true, 30.2700, -97.7050, 6, true, 15, 2);

  -- 9. Ingrid Mensah
  DELETE FROM auth.users WHERE email = 'ingrid_mensah@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'ingrid_mensah@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'ingrid_mensah', 'Ingrid Mensah', 'Elementary school art teacher. I weld sculptures in my garage on weekends and have no idea how those two things go together.',
    ARRAY['welding','children''s art instruction','printmaking']::text[],
    ARRAY['beekeeping','amateur mycology']::text[],
    'Allandale, Austin TX', true, 30.3350, -97.7450, 6, true, 15, 2);

  -- 10. James Oduya
  DELETE FROM auth.users WHERE email = 'james_oduya@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'james_oduya@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'james_oduya', 'James Oduya', 'Urban planner and avid home brewer. Currently obsessed with lagers, which nobody respects, but they''re hard to make well.',
    ARRAY['home brewing (lagers)','urban planning basics','cycling navigation']::text[],
    ARRAY['film photography','hand lettering']::text[],
    'Mueller, Austin TX', true, 30.2950, -97.6950, 6, true, 15, 2);

  -- 11. Anna Delgado
  DELETE FROM auth.users WHERE email = 'anna_delgado@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'anna_delgado@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'anna_delgado', 'Anna Delgado', 'Veterinarian who plays old-time fiddle in a string band. I can teach basic animal care and very fast bowing technique.',
    ARRAY['fiddle (old-time)','animal husbandry basics','foraging']::text[],
    ARRAY['natural plaster','rowing']::text[],
    'St. Elmo, Austin TX', true, 30.2250, -97.7700, 6, true, 15, 2);

  -- 12. Ben Okonkwo
  DELETE FROM auth.users WHERE email = 'ben_okonkwo@dabble.demo';
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
  VALUES (gen_random_uuid(), 'ben_okonkwo@dabble.demo', '', now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false, 'authenticated')
  RETURNING id INTO uid;
  INSERT INTO public.profiles (id, username, display_name, bio, skills_offered, skills_curious, location_label, is_discoverable, lat, lng, credit_balance, show_exact_location, travel_radius_km, safety_tier_consent)
  VALUES (uid, 'ben_okonkwo', 'Ben Okonkwo', 'Freelance translator (French/English) and competitive chess player. I teach chess to kids at the library on Saturdays.',
    ARRAY['chess instruction','French language','translation']::text[],
    ARRAY['ceramics','long-distance running coaching']::text[],
    'Downtown Austin, TX', true, 30.2672, -97.7431, 6, true, 15, 2);

END $$;
