import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canUseTool } from '@/lib/subscription/gate';
import type { Tier, ToolSlug } from '@/lib/subscription/gate';

type AccessGranted = { userId: string; tier: Tier; error: null };
type AccessDenied  = { userId: null;   tier: null;  error: NextResponse };

/**
 * Server-side access check for API route handlers.
 *
 * Validates that:
 *   1. The request has a valid Supabase session (user is logged in).
 *   2. The user's membership_tier satisfies the tool's requirement.
 *
 * Usage:
 *   const access = await checkApiAccess('pwp');
 *   if (access.error) return access.error;
 *   const { userId } = access;  // safe to use
 */
export async function checkApiAccess(toolSlug: ToolSlug): Promise<AccessGranted | AccessDenied> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      userId: null,
      tier: null,
      error: NextResponse.json({ error: 'Unauthorised — please sign in.' }, { status: 401 }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tierData } = await (supabase as any).rpc('get_user_tier', { uid: user.id });
  const tier: Tier = (tierData as Tier | null) ?? 'free';

  if (!canUseTool(tier, toolSlug)) {
    return {
      userId: null,
      tier: null,
      error: NextResponse.json(
        { error: 'This tool requires a Full Teacher subscription.' },
        { status: 403 }
      ),
    };
  }

  return { userId: user.id, tier, error: null };
}
