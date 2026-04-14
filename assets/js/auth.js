// auth.js — user accounts stored in localStorage, session in sessionStorage
// NOTE: Passwords are stored in plain text in localStorage for this educational
// project. In a real application you would never do this without hashing.

const Auth = {
  _usersKey:   'aa_users',
  _sessionKey: 'aa_session',

  _getUsers() {
    return JSON.parse(localStorage.getItem(this._usersKey) || '[]');
  },

  register(username, password) {
    if (!username || !password)        return { ok: false, msg: 'All fields are required.' };
    if (password.length < 6)           return { ok: false, msg: 'Password must be at least 6 characters.' };

    const users = this._getUsers();
    if (users.find(u => u.username === username)) {
      return { ok: false, msg: 'Username already taken.' };
    }

    users.push({ id: Date.now(), username, password });
    localStorage.setItem(this._usersKey, JSON.stringify(users));
    return { ok: true };
  },

  login(username, password) {
    const user = this._getUsers().find(
      u => u.username === username && u.password === password
    );
    if (!user) return { ok: false, msg: 'Invalid username or password.' };

    sessionStorage.setItem(
      this._sessionKey,
      JSON.stringify({ id: user.id, username: user.username })
    );
    return { ok: true };
  },

  logout() {
    sessionStorage.removeItem(this._sessionKey);
    window.location.href = 'login.html?msg=' + encodeURIComponent('You have been logged out.');
  },

  getSession() {
    return JSON.parse(sessionStorage.getItem(this._sessionKey) || 'null');
  },

  isLoggedIn() {
    return this.getSession() !== null;
  }
};
