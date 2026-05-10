import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

/**
 * Service-role admin client — bypasses RLS.
 * NEVER import this in client components or expose it to the browser.
 * Use ONLY in Route Handlers (app/api/...) and server-side utilities.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
