// guard.js — include this script on every protected page BEFORE other scripts.
// If the user has no active session they are immediately redirected to login.

(function () {
  const session = JSON.parse(sessionStorage.getItem('aa_session') || 'null');
  if (!session) {
    const msg = encodeURIComponent('You must login before making changes.');
    window.location.href = 'login.html?msg=' + msg;
  }
})();
