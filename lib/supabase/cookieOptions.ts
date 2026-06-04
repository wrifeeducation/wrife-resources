/**
 * Single source of truth for Supabase auth-cookie scope.
 *
 * The auth cookie (`sb-<ref>-auth-token`) MUST be written with identical
 * `domain` / `sameSite` / `secure` / `path` everywhere it is set — the server
 * client, the middleware, and the browser client. If the scopes disagree the
 * browser ends up holding two same-named cookies (one host-only, one on
 * `.wrife.co.uk`) and different server entry points read different sessions,
 * which produced the dashboard-shows-Full-Teacher / API-returns-403 bug.
 *
 * Do NOT set `name` here — leaving the cookie name at its default keeps the
 * existing session and the Route A hash-token SSO working unchanged.
 */

/**
 * Resolve the cookie domain.
 * - Production on a wrife.co.uk host  → `.wrife.co.uk` (shared across sub-apps for SSO)
 * - Anything else (localhost, *.vercel.app preview) → undefined (host-only)
 *
 * Leaving it host-only on preview URLs avoids the login ↔ dashboard redirect
 * loop caused by a cookie scoped to a domain the browser never sees.
 */
export function cookieDomain(host?: string | null): string | undefined {
  if (process.env.NODE_ENV !== 'production') return undefined;

  const configured = process.env.NEXT_PUBLIC_SITE_DOMAIN;
  if (configured) return `.${configured}`;

  if (host && (host === 'wrife.co.uk' || host.endsWith('.wrife.co.uk'))) {
    return '.wrife.co.uk';
  }
  return undefined;
}

export interface AuthCookieOptions {
  domain?: string;
  path: string;
  sameSite: 'none' | 'lax';
  secure: boolean;
}

/**
 * The cookie options to spread into every `cookies.set(...)` / `cookieOptions`.
 * Pass the request host where available (middleware, server client); the
 * browser client can pass `window.location.host`.
 */
export function authCookieOptions(host?: string | null): AuthCookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = cookieDomain(host);
  return {
    ...(domain ? { domain } : {}),
    path: '/',
    // `none` is required for the cookie to ride cross-sub-domain SSO navigations
    // in production; it mandates `secure`. Locally we relax to `lax`/insecure.
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  };
}
