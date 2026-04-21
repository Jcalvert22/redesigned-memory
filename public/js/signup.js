import { supabase } from '/public/js/supabase.js';

export async function signup(username, email, password) {
  if (!username || !email || !password) {
    return { ok: false, msg: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { ok: false, msg: 'Password must be at least 6 characters.' };
  }

  // Pre-flight: check username availability before creating the auth account.
  // Uses the public SELECT policy — no auth required.
  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.trim())
    .maybeSingle();

  if (existing) {
    return { ok: false, msg: 'That username is already taken.' };
  }

  // Create the Supabase auth account.
  // Username is passed in options.data so the database trigger can read it
  // from raw_user_meta_data and insert the profiles row automatically.
  // The trigger runs as SECURITY DEFINER and bypasses RLS, which means it
  // works correctly whether or not email confirmation is enabled.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username.trim() } }
  });

  if (error) return { ok: false, msg: error.message };
  if (!data.user) return { ok: false, msg: 'Sign-up failed. Please try again.' };

  return { ok: true, user: data.user };
}
