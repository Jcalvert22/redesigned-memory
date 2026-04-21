// db.js — exercise CRUD using localStorage as the database
// On first load, seeds data from exercises.json (requires a local server like
// VS Code Live Server). If that fails, falls back to hardcoded seed data.

const DB = {
  _key: 'aa_exercises',

  // Call this once on any CRUD page before reading data
  async init() {
    try {
      const res  = await fetch('https://raw.githubusercontent.com/Jcalvert22/congenial-train-app-server/main/public/data/exercises.json');
      let data = await res.json();
      console.log('Raw GitHub data:', data);
      
      // Extract exercises from the nested structure and flatten
      if (data.exercises && typeof data.exercises === 'object') {
        const flatExercises = [];
        for (const muscleGroup in data.exercises) {
          const exercises = data.exercises[muscleGroup];
          if (Array.isArray(exercises)) {
            exercises.forEach((ex, index) => {
              // Map GitHub properties to our expected format
              flatExercises.push({
                id: index,
                name: ex.name,
                muscleGroup: ex.primary_muscle,
                description: ex.description
              });
            });
          }
        }
        data = flatExercises;
      }
      
      console.log('Processed data to store:', data);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Could not parse exercises data');
      }
      
      localStorage.setItem(this._key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch exercises from GitHub:', error);
      // Fallback: inline seed (works when opened directly as a file)
      const seed = [
        { id: 1, name: 'Bodyweight Squat',  muscleGroup: 'Legs',   description: 'A simple squat using only bodyweight.' },
        { id: 2, name: 'Glute Bridge',       muscleGroup: 'Glutes', description: 'Lift hips upward while lying on your back.' },
        { id: 3, name: 'Push-Up (Knee)',     muscleGroup: 'Chest',  description: 'Beginner push-up variation using knees for support.' },
        { id: 4, name: 'Dead Bug',           muscleGroup: 'Core',   description: 'Opposite arm/leg extension while stabilizing core.' },
        { id: 5, name: 'Reverse Lunge',      muscleGroup: 'Legs',   description: 'Step backward into a lunge, alternating legs.' }
      ];
      console.log('Using fallback seed data');
      localStorage.setItem(this._key, JSON.stringify(seed));
    }
  },

  getAll() {
    const data = JSON.parse(localStorage.getItem(this._key) || '[]');
    console.log('getAll() returning:', data);
    return data;
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
