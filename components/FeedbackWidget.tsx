'use client';

/**
 * FeedbackWidget — floating "Report a problem" button for WriFe Resources.
 * Appears on every authenticated page. Submits to the submit-feedback Edge Function.
 * Auto-fills app, page URL, user email and role from session.
 */
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const EDGE_URL = 'https://gzmgjkbtsvezfclmreru.supabase.co/functions/v1/submit-feedback';

export function FeedbackWidget() {
  const [open, setOpen]       = useState(false);
  const [text, setText]       = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleOpen  = useCallback(() => { setOpen(true); setSent(false); setError(''); setText(''); }, []);
  const handleClose = useCallback(() => setOpen(false), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

      // Determine user type from role in profile
      let userType = 'unknown';
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        const role = profile?.role as string | undefined;
        if (role === 'pupil') userType = 'pupil';
        else if (role && ['teacher', 'school_admin', 'admin', 'wrife_admin'].includes(role)) userType = 'teacher';
      }

      const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          app: 'resources',
          user_type: userType,
          username: session?.user?.user_metadata?.display_name
            ?? session?.user?.user_metadata?.first_name
            ?? session?.user?.email
            ?? undefined,
          page_url: window.location.href,
          description: text.trim(),
          device_info: navigator.userAgent.slice(0, 120),
        }),
      });

      if (!res.ok) throw new Error('submit failed');
      setSent(true);
      setText('');
    } catch {
      setError('Could not send — please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={handleOpen}
        data-testid="feedback-trigger"
        aria-label="Report a problem"
        className="fixed bottom-5 right-5 z-[9000] w-12 h-12 rounded-full bg-wrife-green text-white flex items-center justify-center text-xl shadow-lg hover:scale-110 transition-transform border-b-4 border-green-700"
      >
        💬
      </button>

      {/* Modal backdrop + panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Report a problem"
          className="fixed inset-0 z-[9100] bg-black/45 flex items-end justify-center px-4 pb-6"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
            {sent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-base font-bold text-wrife-text mb-1.5">Thanks! Message sent.</p>
                <p className="text-sm text-wrife-muted mb-5">We'll look into it as soon as possible.</p>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-semibold text-wrife-muted bg-wrife-cream border border-wrife-cream-dark rounded-full hover:bg-wrife-cream-dark transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-wrife-text">💬 Report a problem</h2>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close"
                    className="text-wrife-muted hover:text-wrife-text text-lg leading-none p-1"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-wrife-muted mb-3.5 leading-relaxed">
                  Tell us what's wrong — we'll fix it quickly!
                </p>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. The connect grid activity wouldn't load…"
                  rows={4}
                  maxLength={1000}
                  autoFocus
                  className="w-full p-3 text-sm border-2 border-wrife-cream-dark rounded-xl text-wrife-text bg-white resize-y outline-none focus:border-wrife-green leading-relaxed mb-1"
                />
                <p className="text-xs text-wrife-muted mb-3.5 text-right">{text.length}/1000</p>

                {error && (
                  <p className="text-xs text-red-600 mb-3">⚠️ {error}</p>
                )}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2.5 text-sm font-semibold text-wrife-muted bg-wrife-cream border border-wrife-cream-dark rounded-full hover:bg-wrife-cream-dark transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !text.trim()}
                    className="flex-[2] py-2.5 text-sm font-bold text-white bg-wrife-green border-b-4 border-green-700 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending…' : 'Send report'}
                  </button>
                </div>

                <p className="text-[11px] text-wrife-muted mt-3 text-center">
                  Auto-includes your role and current page.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
