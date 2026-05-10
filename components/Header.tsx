import Link from 'next/link';
import { BookOpen, ChevronDown } from 'lucide-react';
import type { Tier } from '@/lib/subscription/gate';
import { tierLabel } from '@/lib/subscription/gate';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User;
  tier: Tier;
}

const tierBadgeClass: Record<Tier, string> = {
  free:     'tier-badge-free',
  standard: 'tier-badge-standard',
  full:     'tier-badge-full',
  school:   'tier-badge-school',
};

export function Header({ user, tier }: HeaderProps) {
  const email = user.email ?? '';
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-wrife-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-wrife-green flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-wrife-text text-lg">
            WriFe <span className="text-wrife-green font-normal text-sm">Resources</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard"
            className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
            All Tools
          </Link>
          <Link href="/daily/pwp"
            className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
            Daily Practice
          </Link>
          <Link href="https://wrife.co.uk"
            className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
            ← WriFe App
          </Link>
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <span className={tierBadgeClass[tier]}>{tierLabel(tier)}</span>

          {tier === 'free' || tier === 'standard' ? (
            <a
              href="https://wrife.co.uk/pricing"
              className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex"
            >
              Upgrade
            </a>
          ) : null}

          {/* Avatar */}
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-wrife-green text-white text-sm
                            font-semibold flex items-center justify-center">
              {initials}
            </div>
            <ChevronDown className="w-4 h-4 text-wrife-muted group-hover:text-wrife-text
                                    transition-colors hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
