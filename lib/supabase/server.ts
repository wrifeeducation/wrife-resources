import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/types';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              // Critical: shared across all wrife.co.uk subdomains
              domain: process.env.NODE_ENV === 'production' ? '.wrife.co.uk' : undefined,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          } catch {
            // Server Component — cookie writes are allowed from Route Handlers only
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              domain: process.env.NODE_ENV === 'production' ? '.wrife.co.uk' : undefined,
              maxAge: 0,
            });
          } catch {
            // Server Component
          }
        },
      },
    }
  );
}
