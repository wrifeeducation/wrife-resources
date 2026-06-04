import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/types';
import { authCookieOptions } from '@/lib/supabase/cookieOptions';

/**
 * Browser-side Supabase client.
 *
 * Passes the shared `authCookieOptions` (domain/sameSite/secure/path) so that
 * cookies written client-side match exactly what the server and middleware
 * write — preventing duplicate same-named cookies at different scopes.
 *
 * NOTE: we deliberately do NOT set `cookieOptions.name`; leaving the default
 * cookie name keeps the existing session and the Route A hash-token SSO intact.
 */
export function createClient() {
  const host = typeof window !== 'undefined' ? window.location.host : null;

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions: authCookieOptions(host) }
  );
}
