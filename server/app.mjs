import express          from 'express';
import { createClient } from '@supabase/supabase-js';
import { join }         from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app       = express();

// ── Supabase server-side client ────────────────────────────────────────────
// Uses the SERVICE ROLE key — never expose this to the browser.
// Set on the GCP server:
//   SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=eyJ...
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json());

// Serve static files from the project root (one level up from server/)
app.use(express.static(join(__dirname, '..')));

// ── API routes ─────────────────────────────────────────────────────────────

/**
 * GET /auth/user
 *
 * Verifies a Supabase JWT and returns the decoded user object.
 * Client sends:  Authorization: Bearer <access_token>
 *
 * Returns:
 *   200 { user: { id, email, ... } }
 *   401 { error: "..." }
 */
app.get('/auth/user', async (req, res) => {
  const authHeader = req.headers.authorization ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed.' });
  }

  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  return res.json({ user });
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
