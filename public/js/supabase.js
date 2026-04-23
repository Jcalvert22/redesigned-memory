import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Rejects unreplaced deploy-time placeholders like "{{SUPABASE_URL}}"
const isReal = (v) => typeof v === 'string' && v.length > 0 && !v.startsWith('{{');

let cfg = {};

try {
  const r = await fetch('/api/config');
  if (r.ok) cfg = await r.json();
} catch { /* network error — fall through to fallback */ }

if (!isReal(cfg.SUPABASE_URL)) {
  const fallback = window.__AAA_CONFIG__ ?? {};
  cfg = isReal(fallback.SUPABASE_URL) ? fallback : {};
}

if (!isReal(cfg.SUPABASE_URL) || !isReal(cfg.SUPABASE_ANON_KEY)) {
  console.error('[AAA] Supabase config unavailable. Set SUPABASE_URL and SUPABASE_ANON_KEY as env vars on the server.');
}

export const supabase = createClient(cfg.SUPABASE_URL ?? '', cfg.SUPABASE_ANON_KEY ?? '');
