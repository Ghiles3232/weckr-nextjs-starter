import { createClient } from '@supabase/supabase-js';

// Browser Supabase client. The login page and dashboard use it to sign in and
// read the current session. Only the public anon key is exposed here.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
