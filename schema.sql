-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================

-- profiles: maps auth.users → username + email
CREATE TABLE IF NOT EXISTS profiles (
  user_id    UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username   TEXT        NOT NULL UNIQUE,
  email      TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Own-row read/write policies
CREATE POLICY IF NOT EXISTS "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Required for username→email lookup at login time (user is not yet authenticated).
CREATE POLICY IF NOT EXISTS "Anyone can look up email by username"
  ON profiles FOR SELECT
  USING (true);

-- ── Trigger: auto-create profile when a new auth user is created ──────────
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS.
-- This fixes the signup failure that occurs when email confirmation is enabled:
-- after signUp() there is no active session, so auth.uid() is null and a
-- direct client-side INSERT would fail the RLS check.
-- The username is passed via supabase.auth.signUp options.data.username and
-- lands in NEW.raw_user_meta_data->>'username'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
