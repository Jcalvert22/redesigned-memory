import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
app.use(express.json());

// Serve Supabase public config to the browser.
app.get('/api/config', (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return res.status(503).json({ error: 'SUPABASE_URL / SUPABASE_ANON_KEY not set on server.' });
  }
  res.json({ SUPABASE_URL: url, SUPABASE_ANON_KEY: key });
});

// JWT verification via Supabase REST API.
// Uses Node 18's built-in fetch — no npm package needed.
app.get('/auth/user', async (req, res) => {
  const auth = req.headers.authorization ?? '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(503).json({ error: 'Server not configured.' });
  }

  try {
    const r = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: auth, apikey: serviceKey }
    });
    if (!r.ok) return res.status(401).json({ error: 'Invalid or expired token.' });
    return res.json({ user: await r.json() });
  } catch {
    return res.status(500).json({ error: 'Auth check failed.' });
  }
});

// Serve static files from the project root (one level up from server/).
app.use(express.static(join(__dirname, '..')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
