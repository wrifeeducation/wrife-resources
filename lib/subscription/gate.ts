import type { Tier, ToolSlug } from '@/lib/supabase/types';

export type { Tier, ToolSlug };

export const TOOL_REQUIREMENTS: Record<ToolSlug, Tier> = {
  'pwp':              'full',
  'dwp':              'full',
  'connect-grid':     'full',
  'sentence-coach':   'full',
  'story-types':      'full',
  'composition':      'full',
  'editing-doctor':   'full',
  'genre-coach':      'full',
  'project-mentor':   'full',
};

const TIER_RANK: Record<Tier, number> = {
  free:     0,
  standard: 1,
  full:     2,
  school:   3,
};

export function canUseTool(userTier: Tier, toolSlug: ToolSlug): boolean {
  const required = TOOL_REQUIREMENTS[toolSlug];
  if (!required) return false;
  return TIER_RANK[userTier] >= TIER_RANK[required];
}

export function tierLabel(tier: Tier): string {
  const labels: Record<Tier, string> = {
    free:     'Free',
    standard: 'Standard',
    full:     'Full Teacher',
    school:   'School License',
  };
  return labels[tier];
}

export function isActiveSubscriber(tier: Tier): boolean {
  return tier === 'full' || tier === 'school';
}
