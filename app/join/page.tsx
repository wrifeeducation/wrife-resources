'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

// ── Step types ─────────────────────────────────────────────────────────────────

type Step = 'code' | 'login' | 'loading';

export default function JoinPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('code');

  // Step 1: class code
  const [classCode, setClassCode]   = useState('');
  const [className, setClassName]   = useState('');
  const [classId, setClassId]       = useState('');
  const [codeError, setCodeError]   = useState('');
  const [codeLoading, setCodeLoading] = useState(false);

  // Step 2: username + PIN
  const [username, setUsername]   = useState('');
  const [pin, setPin]             = useState('');
  const [pinChars, setPinChars]   = useState<string[]>(['', '', '', '']);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Step 1: look up class code ────────────────────────────────────────────

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!classCode.trim()) { setCodeError('Enter your class code.'); return; }
    setCodeLoading(true);
    setCodeError('');
    try {
      const res = await fetch('/api/pupil/lookup-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_code: classCode.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setCodeError(json.error ?? 'Code not found.'); return; }
      setClassId(json.class_id);
      setClassName(json.class_name);
      setStep('login');
    } catch {
      setCodeError('Network error — please try again.');
    } finally {
      setCodeLoading(false);
    }
  }

  // ── PIN digit input helpers ────────────────────────────────────────────────

  function handlePinChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...pinChars];
    next[index] = digit;
    setPinChars(next);
    setPin(next.join(''));
    // Auto-advance focus
    if (digit && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      (nextInput as HTMLInputElement | null)?.focus();
    }
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !pinChars[index] && index > 0) {
      const prev = document.getElementById(`pin-${index - 1}`);
      (prev as HTMLInputElement | null)?.focus();
    }
  }

  // ── Step 2: verify & sign in ──────────────────────────────────────────────

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) { setLoginError('Enter your name.'); return; }
    if (pin.length < 4) { setLoginError('Enter your 4-digit PIN.'); return; }
    setLoginLoading(true);
    setLoginError('');
    setStep('loading');

    try {
      const res = await fetch('/api/pupil/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_code: classCode.trim(), username: username.trim(), pin }),
      });
      const json = await res.json();

      if (!res.ok) {
        setLoginError(json.error ?? 'Could not log in.');
        setStep('login');
        setLoginLoading(false);
        return;
      }

      // Exchange magic-link token for a Supabase session
      const supabase = createClient();
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: json.email,
        token: json.token,
        type: 'magiclink',
      });

      if (verifyErr) {
        setLoginError('Sign-in failed. Please try again.');
        setStep('login');
        setLoginLoading(false);
        return;
      }

      router.push('/my-tasks');
    } catch {
      setLoginError('Network error — please try again.');
      setStep('login');
      setLoginLoading(false);
    }
  }

  // ── Loading screen ─────────────────────────────────────────────────────────

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-wrife-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-wrife-green flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-wrife-text font-semibold text-lg">Signing you in…</p>
          <p className="text-wrife-muted text-sm mt-1">Just a moment!</p>
        </div>
      </div>
    );
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-wrife-cream flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-wrife-green flex items-center justify-center shadow-sm">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-wrife-text text-xl">
          WriFe <span className="text-wrife-green font-normal text-base">Resources</span>
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-wrife-cream-dark w-full max-w-sm overflow-hidden">

        {/* Step 1: Class code ------------------------------------------------ */}
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="p-8">
            <h1 className="text-2xl font-bold text-wrife-text text-center mb-1">
              Join your class 👋
            </h1>
            <p className="text-sm text-wrife-muted text-center mb-8">
              Your teacher will give you a class code.
            </p>

            <label className="block text-sm font-semibold text-wrife-text mb-2">
              Class code
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABC123"
              maxLength={10}
              autoFocus
              className="w-full px-4 py-3 text-center text-2xl font-mono font-bold tracking-widest
                         border-2 border-wrife-cream-dark rounded-xl focus:outline-none
                         focus:border-wrife-green bg-wrife-cream uppercase"
            />

            {codeError && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {codeError}
              </div>
            )}

            <button
              type="submit"
              disabled={codeLoading}
              className="mt-6 w-full btn-primary py-3 text-base flex items-center justify-center gap-2"
            >
              {codeLoading ? 'Checking…' : <><span>Next</span><ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="mt-6 text-center text-xs text-wrife-muted">
              Are you a teacher?{' '}
              <a href="/login" className="text-wrife-green hover:underline font-medium">
                Log in here
              </a>
            </p>
          </form>
        )}

        {/* Step 2: Username + PIN -------------------------------------------- */}
        {step === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-8">
            {/* Class banner */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-6">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">{className}</p>
            </div>

            <h2 className="text-xl font-bold text-wrife-text text-center mb-1">
              Who are you? 😊
            </h2>
            <p className="text-sm text-wrife-muted text-center mb-6">
              Type your name and enter your PIN.
            </p>

            {/* Username */}
            <label className="block text-sm font-semibold text-wrife-text mb-2">
              Your name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Alex"
              autoFocus
              autoComplete="off"
              className="w-full px-4 py-3 text-lg border-2 border-wrife-cream-dark rounded-xl
                         focus:outline-none focus:border-wrife-green bg-wrife-cream mb-5"
            />

            {/* PIN */}
            <label className="block text-sm font-semibold text-wrife-text mb-3">
              Your 4-digit PIN
            </label>
            <div className="flex justify-center gap-3 mb-2">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  id={`pin-${i}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d"
                  maxLength={1}
                  value={pinChars[i]}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  className="w-14 h-16 text-center text-2xl font-bold border-2 border-wrife-cream-dark
                             rounded-xl focus:outline-none focus:border-wrife-green bg-wrife-cream
                             caret-transparent"
                  aria-label={`PIN digit ${i + 1}`}
                />
              ))}
            </div>

            {loginError && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-6 w-full btn-primary py-3 text-base flex items-center justify-center gap-2"
            >
              {loginLoading ? 'Signing in…' : <><span>Let&apos;s go! 🚀</span></>}
            </button>

            <button
              type="button"
              onClick={() => { setStep('code'); setLoginError(''); }}
              className="mt-4 w-full text-sm text-wrife-muted hover:text-wrife-text text-center py-1 transition-colors"
            >
              ← Wrong class? Go back
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-xs text-wrife-muted">
        Need help? Ask your teacher.
      </p>
    </div>
  );
}
