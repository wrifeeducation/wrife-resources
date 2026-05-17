'use client';

/**
 * Hub entry detection — Route A SSO from wrife.co.uk
 *
 * When a pupil arrives from the wrife.co.uk pupil dashboard via a hash-token URL,
 * we set a sessionStorage flag so the Header can show the "← WriFe" back button.
 *
 * Uses sessionStorage (not localStorage) so the flag clears on tab close —
 * a direct load never incorrectly shows the back button.
 */

const HUB_ENTRY_KEY = 'entryViaHub';

/** Call once on app load — before the Supabase SDK clears the hash. */
export function detectHubEntry(): void {
  if (typeof window === 'undefined') return;
  if (window.location.hash.includes('access_token=')) {
    sessionStorage.setItem(HUB_ENTRY_KEY, '1');
    // Strip the hash so tokens don't sit in the address bar
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

export function isHubEntry(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(HUB_ENTRY_KEY) === '1';
}

export function clearHubEntry(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(HUB_ENTRY_KEY);
}
