// feedback.js — feedback CRUD using localStorage

const FeedbackDB = {
  _key: 'aa_feedback',

  getAll() {
    return JSON.parse(localStorage.getItem(this._key) || '[]');
  },

  add({ name, rating, message }) {
    const entries = this.getAll();
    const entry = {
      id:        Date.now(),
      name:      name.trim(),
      rating:    parseInt(rating, 10),
      message:   message.trim(),
      timestamp: new Date().toISOString()
    };
    entries.push(entry);
    localStorage.setItem(this._key, JSON.stringify(entries));
    return entry;
  },

  delete(id) {
    const remaining = this.getAll().filter(e => String(e.id) !== String(id));
    localStorage.setItem(this._key, JSON.stringify(remaining));
  },

  clearAll() {
    localStorage.removeItem(this._key);
  },

  // Returns a sorted copy — does not modify stored data
  getSorted(by) {
    const all = this.getAll();
    if (by === 'oldest')  return [...all].sort((a, b) => a.id - b.id);
    if (by === 'highest') return [...all].sort((a, b) => b.rating - a.rating);
    if (by === 'lowest')  return [...all].sort((a, b) => a.rating - b.rating);
    return [...all].sort((a, b) => b.id - a.id); // default: newest first
  },

  // Returns only entries matching a specific star rating (0 = all)
  filterByRating(rating, entries) {
    const r = parseInt(rating, 10);
    if (!r) return entries;
    return entries.filter(e => e.rating === r);
  },

  getAverageRating() {
    const all = this.getAll();
    if (!all.length) return 0;
    return (all.reduce((sum, e) => sum + e.rating, 0) / all.length).toFixed(1);
  }
};

// Shared helpers used by all feedback pages

function stars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
