import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signIn } from './actions';

interface LoginPageProps {
  searchParams: { error?: string; redirectTo?: string };
}

const tools = [
  { value: '9', label: 'AI Writing Tools' },
  { value: '67', label: 'Curriculum Lessons' },
  { value: 'Live', label: 'Pupil Feedback' },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(searchParams.redirectTo ?? '/dashboard');
  }

  const error = searchParams.error;
  const redirectTo = searchParams.redirectTo ?? '/dashboard';

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — brand ── */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
        style={{ backgroundColor: 'var(--wrife-green)' }}
      >
        {/* Background decorations */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none bg-white" />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: 'var(--wrife-yellow)' }}
        />

        {/* Logo */}
        <Link href="https://wrife.co.uk" className="flex items-center gap-3 relative z-10">
          <span
            className="font-extrabold text-2xl text-white font-display"
            style={{ fontFamily: 'Baloo 2, cursive' }}
          >
            WriFe
          </span>
          <span className="text-white/70 text-sm font-medium">Resources</span>
        </Link>

        {/* Centre content */}
        <div className="relative z-10 flex flex-col items-start">
          {/* Mascot */}
          <div className="mb-8 mascot-float">
            <Image
              src="/mascots/pencil-waving.png"
              alt="WriFe mascot"
              width={130}
              height={156}
              className="drop-shadow-xl"
            />
          </div>

          <h2
            className="text-3xl xl:text-4xl font-extrabold text-white mb-4 leading-tight"
            style={{ fontFamily: 'Baloo 2, cursive' }}
          >
            Nine AI tools.<br />Every lesson.
          </h2>
          <p className="text-white/75 text-base leading-relaxed max-w-xs">
            Real-time, curriculum-aligned writing feedback — built for every pupil in your class.
          </p>

          {/* Trust stats */}
          <div className="mt-8 flex gap-6">
            {tools.map((item) => (
              <div key={item.label}>
                <div
                  className="text-2xl font-extrabold text-white"
                  style={{ fontFamily: 'Baloo 2, cursive', letterSpacing: '-0.02em' }}
                >
                  {item.value}
                </div>
                <div className="text-xs text-white/60 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/40 text-xs relative z-10">
          © {new Date().getFullYear()} WriFe Education Ltd
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div
        className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24"
        style={{ backgroundColor: 'var(--wrife-surface)' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex justify-center">
          <Link href="https://wrife.co.uk" className="flex items-center gap-2">
            <span
              className="font-extrabold text-2xl"
              style={{ fontFamily: 'Baloo 2, cursive', color: 'var(--wrife-green)' }}
            >
              WriFe
            </span>
            <span style={{ color: 'var(--wrife-text-muted)' }} className="text-sm">Resources</span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1
              className="text-2xl sm:text-3xl font-extrabold mb-2"
              style={{ fontFamily: 'Baloo 2, cursive', color: 'var(--wrife-text-main)' }}
            >
              Welcome back
            </h1>
            <p style={{ color: 'var(--wrife-text-muted)' }} className="text-sm">
              Sign in to access your AI writing tools
            </p>
          </div>

          {error && (
            <div
              className="mb-6 p-4 rounded-xl text-sm"
              style={{
                backgroundColor: 'var(--wrife-coral-soft)',
                color: 'var(--wrife-danger)',
                border: '1px solid var(--wrife-coral)',
              }}
            >
              {error}
            </div>
          )}

          <form action={signIn} className="space-y-5">
            <input type="hidden" name="redirectTo" value={redirectTo} />

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
                style={{ color: 'var(--wrife-text-main)' }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="your.email@school.com"
                className="login-input w-full px-4 py-3 rounded-xl transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
                style={{ color: 'var(--wrife-text-main)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="login-input w-full px-4 py-3 rounded-xl transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: 'var(--wrife-green)' }}
            >
              Sign in
            </button>
          </form>

          {/* Links */}
          <div
            className="mt-8 pt-6 text-center text-sm"
            style={{
              borderTop: '1px solid var(--wrife-border)',
              color: 'var(--wrife-text-muted)',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="https://wrife.co.uk/signup?role=teacher"
              className="font-semibold hover:underline"
              style={{ color: 'var(--wrife-green)' }}
            >
              Get access →
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="https://wrife.co.uk/login"
              className="text-xs hover:underline"
              style={{ color: 'var(--wrife-text-muted)' }}
            >
              Sign in to WriFe main platform instead
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
