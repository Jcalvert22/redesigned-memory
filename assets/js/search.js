// search.js — real-time filter and highlight logic
// Used by search.html. Depends on db.js being loaded first.

const Search = {

  /**
   * Filter an array of exercise objects by a text query and/or muscle group.
   * Matching is case-insensitive and checks name, muscleGroup, and description.
   *
   * @param {Array}  exercises   - full array from DB.getAll()
   * @param {string} query       - text the user typed
   * @param {string} muscleGroup - selected filter pill, '' means all
   * @returns {Array} matching exercises
   */
  filter(exercises, query, muscleGroup) {
    let results = exercises;

    // 1. Narrow by muscle group first (cheap operation)
    if (muscleGroup) {
      results = results.filter(ex => ex.muscleGroup === muscleGroup);
    }

    // 2. Then narrow by text query across all three fields
    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter(ex =>
        ex.name.toLowerCase().includes(q)        ||
        ex.muscleGroup.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q)
      );
    }

    return results;
  },

  /**
   * Wrap every occurrence of `query` inside `text` with a <mark> tag.
   * HTML-escapes the text first so user data cannot inject markup.
   *
   * @param {string} text  - raw text to display
   * @param {string} query - search term to highlight
   * @returns {string} HTML-safe string with <mark> highlights
   */
  highlight(text, query) {
    // Escape HTML entities to prevent XSS
    const safe = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const q = query.trim();
    if (!q) return safe;

    // Escape special regex characters in the query
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp(escaped, 'gi'), match => `<mark>${match}</mark>`);
  },

  /**
   * Collect every unique muscleGroup value from an exercise array.
   * Returns a sorted array of strings.
   *
   * @param {Array} exercises
   * @returns {string[]}
   */
  getMuscleGroups(exercises) {
    const groups = new Set(exercises.map(ex => ex.muscleGroup));
    return [...groups].sort();
  }
};
