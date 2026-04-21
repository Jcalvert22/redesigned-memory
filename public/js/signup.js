// signup.js — new user registration via Supabase
//
// Two-step process:
//   1. supabase.auth.signUp() — creates the auth.users row (requires email).
//   2. INSERT into profiles  — stores the username alongside the new user_id.
//
// Usage:
//   import { signup } from '/public/js/signup.js';
//   const { ok, msg } = await signup('jace', 'jace@example.com', 'hunter2');

import { supabase } from '/public/js/supabase.js';

/**
 * Register a new user.
 *
 * @param {string} username  Desired display name (must be unique).
 * @param {string} email     Email used internally by Supabase auth.
 * @param {string} password  Min 6 characters (enforced by Supabase).
 * @returns {Promise<{ ok: boolean, msg?: string, user?: object }>}
 */
export async function signup(username, email, password) {
  if (!username || !email || !password) {
    return { ok: false, msg: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { ok: false, msg: 'Password must be at least 6 characters.' };
  }

  // ── Step 1: create the Supabase auth account ─────────────────────────────
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

  if (signUpError) {
    return { ok: false, msg: signUpError.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { ok: false, msg: 'Sign-up succeeded but no user ID was returned.' };
  }

  // ── Step 2: store the username in the profiles table ─────────────────────
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ user_id: userId, username: username.trim(), email });

  if (profileError) {
    // Most likely cause: duplicate username
    const msg = profileError.message.includes('unique')
      ? 'That username is already taken.'
      : profileError.message;
    return { ok: false, msg };
  }

  return { ok: true, user: data.user };
}
