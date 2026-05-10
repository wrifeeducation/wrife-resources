import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signIn } from './actions';

interface LoginPageProps {
  searchParams: { error?: string; redirectTo?: string };
}

// If already authenticated, skip straight to the dashboard
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(searchParams.redirectTo ?? '/dashboard');
  }

  const error = searchParams.error;
  const redirectTo = searchParams.redirectTo ?? '/dashboard';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FBF8F1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: '#27AE60',
              borderRadius: 8,
              width: 36,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg viewBox="0 0 16 14" fill="none" width="18" height="16">
                <rect x="0.5" y="0.5" width="7" height="13" rx="1" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
                <rect x="8.5" y="0.5" width="7" height="13" rx="1" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
                <line x1="8" y1="1" x2="8" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#2C3E50', letterSpacing: '-0.3px' }}>WriFe</span>
          </Link>
          <div style={{ marginTop: 8, fontSize: 13, color: '#7F8C8D' }}>AI Writing Tools — Teacher Access</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '32px 28px',
          border: '1px solid #E0D8CC',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#2C3E50', marginBottom: 6, margin: '0 0 6px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#7F8C8D', margin: '0 0 24px' }}>
            Sign in to access your WriFe writing tools
          </p>

          {error && (
            <div style={{
              background: '#FFF1F2',
              border: '1px solid #FECDD3',
              color: '#BE123C',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form action={signIn}>
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2C3E50', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="your.email@school.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1.5px solid #E0D8CC',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#2C3E50',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#FAFAF8',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2C3E50', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1.5px solid #E0D8CC',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#2C3E50',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#FAFAF8',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#27AE60',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.1px',
              }}
            >
              Sign in
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#7F8C8D' }}>
          Don&apos;t have an account?{' '}
          <Link href="https://wrife.co.uk/signup?role=teacher" style={{ color: '#27AE60', fontWeight: 600, textDecoration: 'none' }}>
            Get access →
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#ABA89E' }}>
          <Link href="https://wrife.co.uk/login" style={{ color: '#ABA89E', textDecoration: 'none' }}>
            Sign in to WriFe main platform instead
          </Link>
        </div>
      </div>
    </div>
  );
}
