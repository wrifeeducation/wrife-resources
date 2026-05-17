'use client';

/**
 * /auth/hub — Route A SSO entry point for school pupils arriving from wrife.co.uk.
 *
 * wrife.co.uk passes the Supabase session as URL hash params:
 *   /auth/hub#access_token=...&refresh_token=...&token_type=bearer&expires_in=...
 *
 * This page:
 *   1. Reads the hash fragment client-side (server middleware can't see it)
 *   2. Calls supabase.auth.setSession() to establish the session in cookies
 *   3. Sets sessionStorage.entryViaHub = '1' so the Header shows ← WriFe
 *   4. Removes the hash from the URL (clean address bar)
 *   5. Redirects to /my-tasks
 *
 * If no valid tokens are found, redirects to /join (pupil login fallback).
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen } from 'lucide-react';

export default function AuthHubPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleSSOEntry() {
      const hash = window.location.hash.slice(1); // strip leading '#'
      const params = new URLSearchParams(hash);
      const accessToken  = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      // No tokens — this page was accessed directly, send to pupil login
      if (!accessToken || !refreshToken) {
        router.replace('/join');
        return;
      }

      // Clean the hash from the address bar immediately
      window.history.replaceState(null, '', window.location.pathname);

      // Mark this session as arriving from the WriFe hub so the Header shows ← WriFe
      sessionStorage.setItem('entryViaHub', '1');

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.setSession({
          access_token:  accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('[auth/hub] setSession failed:', error.message);
          router.replace('/join');
          return;
        }

        // Session established — go to the pupil tasks page
        router.replace('/my-tasks');
      } catch (err) {
        console.error('[auth/hub] unexpected error:', err);
        router.replace('/join');
      }
    }

    handleSSOEntry();
  }, [router]);

  // Minimal loading state while we process the tokens
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
