import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Primary: fetch config from server environment (no deploy-time injection needed).
// Fallback: window.__AAA_CONFIG__ if present (deploy-time injection path).
let cfg = {};

try {
  const r = await fetch('/api/config');
  if (r.ok) cfg = await r.json();
} catch { /* network error — fall through to fallback */ }

if (!cfg.SUPABASE_URL) {
  cfg = window.__AAA_CONFIG__ ?? {};
}

if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
  console.error('[AAA] Supabase config unavailable. Set SUPABASE_URL and SUPABASE_ANON_KEY on the server.');
}

export const supabase = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
