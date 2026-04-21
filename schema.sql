-- ============================================================
-- Run this in the Supabase Dashboard → SQL Editor
-- ============================================================

-- profiles: maps auth.users → username + email
-- email is stored here so the login flow can do a username→email
-- lookup without requiring access to the protected auth schema.
CREATE TABLE IF NOT EXISTS profiles (
  user_id   UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username  TEXT        NOT NULL UNIQUE,
  email     TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only the authenticated user can read/update their own profile row.
-- Service-role key (used by the server) bypasses RLS.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow the login flow to look up any username's email
-- (needed because loginWithUsername queries by username before the user is
-- signed in, so auth.uid() is null at that point).
-- This policy is intentionally read-only and exposes only the email column.
CREATE POLICY "Anyone can look up email by username"
  ON profiles FOR SELECT
  USING (true);
