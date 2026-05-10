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

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              ...(domain ? { domain } : {}),
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          } catch {
            // Server Component — cookie writes are allowed from Route Handlers only
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              ...(domain ? { domain } : {}),
              maxAge: 0,
            });
          } catch {
            // Server Component
          }
        },
      },
    }
  );
}
