import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SubscriptionProvider } from '@/lib/subscription/context';
import { Header } from '@/components/Header';
import type { Tier } from '@/lib/subscription/gate';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const returnTo = encodeURIComponent('/dashboard');
    redirect(`/login?redirectTo=${returnTo}`);
  }

  // Resolve subscription tier server-side so it's available to all child pages instantly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tierData } = await (supabase as any).rpc('get_user_tier', { uid: user.id });
  const tier: Tier = (tierData as Tier | null) ?? 'free';

  return (
    <SubscriptionProvider tier={tier}>
      <Header user={user} tier={tier} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </SubscriptionProvider>
  );
}
