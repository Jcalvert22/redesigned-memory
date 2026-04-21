// supabase.js — initialise the Supabase browser client
//
// Config is injected at deploy time into every HTML page:
//   window.__AAA_CONFIG__ = { SUPABASE_URL: "...", SUPABASE_ANON_KEY: "..." }
//
// Usage in other modules:
//   import { supabase } from '/public/js/supabase.js';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.__AAA_CONFIG__;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[AAA] Supabase config missing — did the deploy step inject __AAA_CONFIG__?');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
