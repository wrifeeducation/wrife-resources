import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { authCookieOptions } from '@/lib/supabase/cookieOptions';

/**
 * Thin middleware that refreshes the Supabase session token on every request.
 * Without this, the JWT expires after 1 hour and the user is silently logged out.
 * The middleware does NOT do auth gating — that stays in each (app) layout.
 *
 * Cookie scope comes from the shared `authCookieOptions` helper so the refreshed
 * token is written with the SAME domain (`.wrife.co.uk` in prod) as the server
 * and browser clients. Previously this omitted `domain`, creating a duplicate
 * host-only cookie that desynced the server session from the page.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const cookieOpts = authCookieOptions(request.headers.get('host'));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, { ...options, ...cookieOpts })
          );
        },
      },
    }
  );

  // Refreshes the session if it's expired — do NOT remove this call.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except: static files, Next.js internals, and the auth
     * callback route (which handles its own session exchange).
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
