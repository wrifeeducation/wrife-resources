'use client';

import { useEffect } from 'react';
import { detectHubEntry } from '@/lib/auth/hubEntry';

/**
 * Detects Route A (wrife.co.uk hub SSO) hash tokens on mount.
 * Must run client-side before the Supabase SDK has a chance to
 * clear the hash from the URL.
 *
 * Place this in (app)/layout.tsx so it runs on every authenticated page.
 */
export function HubEntryDetector() {
  useEffect(() => {
    detectHubEntry();
  }, []);

  return null;
}
