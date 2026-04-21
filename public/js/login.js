// login.js — username-based login via Supabase
//
// Supabase auth requires an email address, not a username.
// This module performs a two-step process:
//   1. Look up the email stored in the `profiles` table for the given username.
//   2. Sign in with that email + the supplied password.
//
// Usage:
//   import { loginWithUsername } from '/public/js/login.js';
//   const { ok, msg, session } = await loginWithUsername('jace', 'hunter2');

import { supabase } from '/public/js/supabase.js';

/**
 * Sign in a user by username + password.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ ok: boolean, msg?: string, session?: object, user?: object }>}
 */
export async function loginWithUsername(username, password) {
  if (!username || !password) {
    return { ok: false, msg: 'Username and password are required.' };
  }

  // ── Step 1: look up the email for this username ──────────────────────────
  const { data: profile, error: lookupError } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username.trim())
    .single();

  if (lookupError || !profile) {
    // Return a generic message — don't reveal whether the username exists
    return { ok: false, msg: 'Invalid username or password.' };
  }

  // ── Step 2: sign in with the resolved email ──────────────────────────────
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email:    profile.email,
    password
  });

  if (signInError) {
    return { ok: false, msg: 'Invalid username or password.' };
  }

  return { ok: true, session: data.session, user: data.user };
}
