import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import type { Database } from '@/lib/supabase/types';

/**
 * Returns `.wrife.co.uk` only when the request is actually coming from that
 * domain. On Vercel preview URLs (*.vercel.app) we leave domain unset so the
 * session cookie is scoped to whatever host the browser sees — otherwise the
 * cookie is set with the wrong domain and is immediately unreadable, producing
 * an infinite login ↔ dashboard redirect loop.
 */
function cookieDomain(): string | undefined {
  if (process.env.NODE_ENV !== 'production') return undefined;
  // NEXT_PUBLIC_SITE_DOMAIN can be set in Vercel env vars to 'wrife.co.uk'
  // once the custom domain is live. Until then leave it unset.
  const configured = process.env.NEXT_PUBLIC_SITE_DOMAIN;
  if (configured) return `.${configured}`;
  try {
    const host = headers().get('host') ?? '';
    if (host.endsWith('.wrife.co.uk') || host === 'wrife.co.uk') {
      return '.wrife.co.uk';
    }
  } catch {
    // headers() not available in some contexts
  }
  return undefined;
}

export function createClient() {
  const cookieStore = cookies();
  const domain = cookieDomain();
  const isProduction = process.env.NODE_ENV === 'production';

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // @supabase/ssr ≥ 0.4 requires getAll/setAll; the old get/set/remove
        // API was removed in 0.5.x. Using the new API ensures cookies are read
        // and written correctly, which fixes the login → dashboard redirect loop.
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                ...(domain ? { domain } : {}),
                sameSite: isProduction ? 'none' : 'lax',
                secure: isProduction,
              })
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
