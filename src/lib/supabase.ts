import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  // Don't crash at import time — the app should still render the fallback UI.
  // Pages that require Supabase will show a config error instead.
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(url ?? 'https://missing.supabase.co', anon ?? 'missing', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const SUPABASE_CONFIGURED = Boolean(url && anon);
