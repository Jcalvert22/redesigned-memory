import { supabase } from '/public/js/supabase.js';

export async function loginWithUsername(username, password) {
  if (!username || !password) {
    return { ok: false, msg: 'Username and password are required.' };
  }

  // Step 1: resolve the email for this username.
  // The "Anyone can look up email by username" RLS policy allows this pre-auth query.
  const { data: profile, error: lookupError } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username.trim())
    .single();

  if (lookupError || !profile) {
    return { ok: false, msg: 'Invalid username or password.' };
  }

  // Step 2: sign in with the resolved email.
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password
  });

  if (signInError) {
    if (signInError.message.toLowerCase().includes('email not confirmed')) {
      return { ok: false, msg: 'Please confirm your email address before logging in.' };
    }
    return { ok: false, msg: 'Invalid username or password.' };
  }

  return { ok: true, session: data.session, user: data.user };
}
