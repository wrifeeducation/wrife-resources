import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isActiveSubscriber } from '@/lib/subscription/gate';
import type { Tier } from '@/lib/subscription/gate';

/**
 * Server-side gate for all daily tools (/daily/pwp, /daily/dwp).
 *
 * All daily tools require an active subscription (full or school).
 * Free-tier users are redirected to the dashboard where the paywall
 * modal can be triggered from the locked ToolCard.
 *
 * Auth is already checked by the parent (app) layout, but we re-read
 * the tier here so this layout is self-contained and can be reasoned
 * about independently.
 */
export default async function DailyToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/dashboard');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tierData } = await (supabase as any).rpc('get_user_tier', { uid: user.id });
  const tier: Tier = (tierData as Tier | null) ?? 'free';

  if (!isActiveSubscriber(tier)) {
    // Redirect back to the tool catalogue — the ToolCard lock will explain
    redirect('/dashboard?locked=1');
  }

  return <>{children}</>;
}
