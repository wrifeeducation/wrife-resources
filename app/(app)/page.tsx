'use client';

// Tool catalogue moved to /dashboard to avoid route conflict with the public landing page.
// This stub keeps the client-reference manifest intact for Next.js build traces.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppRootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return null;
}
