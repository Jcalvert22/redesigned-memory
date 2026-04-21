// guard.js — Supabase session guard for protected pages.
//
// Load as the FIRST module script on any protected page:
//   <script type="module" src="assets/js/guard.js"></script>
//
// What it does:
//   1. Hides the page until auth check completes (prevents content flash).
//   2. Redirects to login if no active session.
//   3. Fetches the username from `profiles` and stores it in sessionStorage
//      so nav elements can display "Hi, username" synchronously.
//   4. Exposes window.logout() for use by nav onclick handlers.

document.documentElement.style.visibility = 'hidden';

import { supabase } from '/public/js/supabase.js';

const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href =
    'login.html?msg=' + encodeURIComponent('You must login before making changes.');
} else {
  // Cache the username for use by the nav (read synchronously on each page)
  if (!sessionStorage.getItem('aa_username')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.username) {
      sessionStorage.setItem('aa_username', profile.username);
    }
  }

  // Expose logout globally so inline onclick handlers work
  window.logout = async () => {
    sessionStorage.removeItem('aa_username');
    await supabase.auth.signOut();
    window.location.href =
      'login.html?msg=' + encodeURIComponent('You have been logged out.');
  };

  document.documentElement.style.visibility = '';
}
