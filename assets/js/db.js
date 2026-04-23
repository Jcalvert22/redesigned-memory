// db.js — exercise CRUD using localStorage as the database
// On first load, seeds data from exercises.json (requires a local server like
// VS Code Live Server). If that fails, falls back to hardcoded seed data.

const DB = {
  _key: 'aa_exercises',

  // Seeds localStorage on the very first visit only.
  // Skips if data already exists so user-created exercises are never overwritten.
  async init() {
    if (localStorage.getItem(this._key)) return;

    try {
      const res  = await fetch('https://raw.githubusercontent.com/Jcalvert22/congenial-train-app-server/main/public/data/exercises.json');
      const raw  = await res.json();
      const flat = [];

      if (raw.exercises && typeof raw.exercises === 'object') {
        for (const group in raw.exercises) {
          const list = raw.exercises[group];
          if (Array.isArray(list)) {
            list.forEach((ex, i) => flat.push({
              id:          i + '_' + group,
              name:        ex.name,
              muscleGroup: ex.primary_muscle,
              description: ex.description
            }));
          }
        }
      }

      if (!flat.length) throw new Error('Empty exercise data');
      localStorage.setItem(this._key, JSON.stringify(flat));
    } catch {
      const seed = [
        { id: 1, name: 'Bodyweight Squat', muscleGroup: 'Legs',   description: 'A simple squat using only bodyweight.' },
        { id: 2, name: 'Glute Bridge',     muscleGroup: 'Glutes', description: 'Lift hips upward while lying on your back.' },
        { id: 3, name: 'Push-Up (Knee)',   muscleGroup: 'Chest',  description: 'Beginner push-up variation using knees for support.' },
        { id: 4, name: 'Dead Bug',         muscleGroup: 'Core',   description: 'Opposite arm/leg extension while stabilizing core.' },
        { id: 5, name: 'Reverse Lunge',    muscleGroup: 'Legs',   description: 'Step backward into a lunge, alternating legs.' }
      ];
      localStorage.setItem(this._key, JSON.stringify(seed));
    }
  },

  getAll() {
    return JSON.parse(localStorage.getItem(this._key) || '[]');
  },

  getById(id) {
    // id coming from URL params is a string; stored ids may be numbers — compare loosely
    return this.getAll().find(r => String(r.id) === String(id)) || null;
  },

  create({ name, muscleGroup, description }) {
    const records = this.getAll();
    const record  = { id: Date.now(), name, muscleGroup, description };
    records.push(record);
    localStorage.setItem(this._key, JSON.stringify(records));
    return record;
  },

  update(id, { name, muscleGroup, description }) {
    const records = this.getAll();
    const index   = records.findIndex(r => String(r.id) === String(id));
    if (index === -1) return null;
    records[index] = { ...records[index], name, muscleGroup, description };
    localStorage.setItem(this._key, JSON.stringify(records));
    return records[index];
  },

  delete(id) {
    const remaining = this.getAll().filter(r => String(r.id) !== String(id));
    localStorage.setItem(this._key, JSON.stringify(remaining));
  }
};
