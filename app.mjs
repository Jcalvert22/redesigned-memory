import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

// Load .env file if present (development / VM without systemd env injection)
const envPath = new URL('.env', import.meta.url).pathname;
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
}

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
