'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, type LucideIcon } from 'lucide-react';
import { PaywallModal } from '@/components/PaywallModal';
import { canUseTool } from '@/lib/subscription/gate';
import { useSubscription } from '@/lib/subscription/context';
import type { ToolSlug } from '@/lib/supabase/types';

export interface ToolCardProps {
  slug: ToolSlug;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Lesson numbers this tool is relevant to, e.g. [27, 29] */
  lessons?: number[];
  /** Badge text, e.g. 'Daily habit' */
  badge?: string;
  badgeColour?: 'green' | 'blue' | 'orange';
}

export function ToolCard({
  slug,
  name,
  description,
  href,
  icon: Icon,
  lessons,
  badge,
  badgeColour = 'green',
}: ToolCardProps) {
  const { tier } = useSubscription();
  const unlocked = canUseTool(tier, slug);
  const [showPaywall, setShowPaywall] = useState(false);

  const badgeClasses = {
    green:  'bg-green-100 text-green-700',
    blue:   'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
  }[badgeColour];

  const cardContent = (
    <div className={unlocked ? 'tool-card group' : 'tool-card-locked group'}>
      {/* Icon row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-wrife-cream flex items-center justify-center
                        group-hover:bg-wrife-green/10 transition-colors">
          <Icon className="w-6 h-6 text-wrife-green" />
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeClasses}`}>
              {badge}
            </span>
          )}
          {!unlocked && (
            <span className="w-6 h-6 rounded-full bg-wrife-cream-dark flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-wrife-muted" />
            </span>
          )}
        </div>
      </div>

      {/* Text */}
      <h3 className="font-semibold text-wrife-text mb-1 group-hover:text-wrife-green transition-colors">
        {name}
      </h3>
      <p className="text-sm text-wrife-muted leading-relaxed mb-4">{description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {lessons && lessons.length > 0 && (
          <p className="text-xs text-wrife-muted">
            Lesson{lessons.length > 1 ? 's' : ''} {lessons.join(', ')}
          </p>
        )}
        <div className="ml-auto flex items-center gap-1 text-sm font-medium text-wrife-green
                        group-hover:gap-2 transition-all">
          {unlocked ? 'Open' : 'Preview'}
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );

  if (!unlocked) {
    return (
      <>
        <button
          className="text-left w-full"
          onClick={() => setShowPaywall(true)}
        >
          {cardContent}
        </button>
        {showPaywall && (
          <PaywallModal
            toolName={name}
            toolDescription={description}
            onClose={() => setShowPaywall(false)}
          />
        )}
      </>
    );
  }

  return <Link href={href}>{cardContent}</Link>;
}
