import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import type { Database } from '@/lib/supabase/types';
import { authCookieOptions } from '@/lib/supabase/cookieOptions';

/**
 * Server-side Supabase client (Server Components, Server Actions, Route Handlers).
 *
 * Cookie scope (domain/sameSite/secure/path) comes from the shared
 * `authCookieOptions` helper so it is byte-for-byte identical to what the
 * middleware and browser client write — see lib/supabase/cookieOptions.ts.
 */
export function createClient() {
  const cookieStore = cookies();

  let host: string | null = null;
  try {
    host = headers().get('host');
  } catch {
    // headers() not available in some contexts (e.g. static generation)
  }
  const options = authCookieOptions(host);

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options: cookieOpts }) =>
              cookieStore.set(name, value, { ...cookieOpts, ...options })
            );
          } catch {
            // Silently ignored when called from a Server Component (read-only
            // context). Cookie writes succeed in Server Actions and Route Handlers.
          }
        },
      },
    }
  );
}
