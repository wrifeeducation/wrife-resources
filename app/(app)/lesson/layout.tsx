import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isActiveSubscriber } from '@/lib/subscription/gate';
import type { Tier } from '@/lib/subscription/gate';

/**
 * Server-side gate for all lesson tools:
 *   /lesson/connect-grid, /lesson/sentence-coach, /lesson/story-types,
 *   /lesson/composition, /lesson/editing-doctor, /lesson/genre-coach,
 *   /lesson/project-mentor
 *
 * All lesson tools require an active subscription (full or school).
 * Free-tier users are redirected to the dashboard.
 */
export default async function LessonToolLayout({
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
    redirect('/dashboard?locked=1');
  }

  return <>{children}</>;
}
