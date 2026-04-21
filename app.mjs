import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();

// Serve Supabase public config to the browser.
// The anon key is designed to be public — RLS is the security layer.
// Route must be registered before express.static so it is not shadowed.
app.get('/api/config', (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return res.status(503).json({ error: 'SUPABASE_URL / SUPABASE_ANON_KEY not set on server.' });
  }
  res.json({ SUPABASE_URL: url, SUPABASE_ANON_KEY: key });
});

app.use(express.static(join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
