'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronDown, Menu, X, LogOut, User, LayoutDashboard, Home, GraduationCap, ClipboardList, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Tier } from '@/lib/subscription/gate';
import { tierLabel } from '@/lib/subscription/gate';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  user: SupabaseUser;
  tier: Tier;
  role?: string;
}

const tierBadgeClass: Record<Tier, string> = {
  free:     'tier-badge-free',
  standard: 'tier-badge-standard',
  full:     'tier-badge-full',
  school:   'tier-badge-school',
};

export function Header({ user, tier, role = 'teacher' }: HeaderProps) {
  const router = useRouter();
  const email = user.email ?? '';
  const displayName = (user.user_metadata?.display_name as string | undefined)
    ?? (user.user_metadata?.first_name as string | undefined)
    ?? email;
  const initials = displayName.slice(0, 2).toUpperCase();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-wrife-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-wrife-green flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-wrife-text text-lg">
            WriFe <span className="text-wrife-green font-normal text-sm">Resources</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {role === 'pupil' ? (
            <>
              <Link href="/my-tasks" className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
                My Tasks
              </Link>
              <Link href="/dashboard" className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
                All Tools
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
                All Tools
              </Link>
              <Link href="/daily/pwp" className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
                Daily Practice
              </Link>
              <Link href="/resources" className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
                Resources
              </Link>
              {['teacher', 'school_admin'].includes(role) && (
                <Link href="/teacher" className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
                  My Classes
                </Link>
              )}
              {['admin', 'wrife_admin'].includes(role) && (
                <Link href="/admin" className="text-sm text-wrife-muted hover:text-wrife-text transition-colors font-semibold text-wrife-green">
                  Admin
                </Link>
              )}
              <Link href="https://wrife.co.uk" className="text-sm text-wrife-muted hover:text-wrife-text transition-colors">
                ← WriFe App
              </Link>
            </>
          )}
        </nav>

        {/* Right-side controls */}
        <div className="flex items-center gap-3">
          <span className={`${tierBadgeClass[tier]} hidden sm:inline-flex`}>{tierLabel(tier)}</span>

          {(tier === 'free' || tier === 'standard') && (
            <a
              href="https://wrife.co.uk/pricing"
              className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex"
            >
              Upgrade
            </a>
          )}

          {/* Avatar dropdown */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-wrife-green focus:ring-offset-2"
              aria-label="Account menu"
            >
              <div className="w-8 h-8 rounded-full bg-wrife-green text-white text-sm font-semibold flex items-center justify-center">
                {initials}
              </div>
              <ChevronDown className={`w-4 h-4 text-wrife-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-wrife-cream-dark py-2 z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-wrife-cream-dark">
                  <p className="text-sm font-semibold text-wrife-text truncate">{displayName}</p>
                  <p className="text-xs text-wrife-muted truncate">{email}</p>
                  <span className={`${tierBadgeClass[tier]} mt-1.5 inline-flex`}>{tierLabel(tier)}</span>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {role === 'pupil' ? (
                    <>
                      <Link href="/my-tasks" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-wrife-text hover:bg-wrife-cream transition-colors">
                        <ClipboardList className="w-4 h-4 text-wrife-muted" />My Tasks
                      </Link>
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-wrife-text hover:bg-wrife-cream transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-wrife-muted" />All Tools
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-wrife-text hover:bg-wrife-cream transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-wrife-muted" />All Tools
                      </Link>
                      <Link href="/resources" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-wrife-text hover:bg-wrife-cream transition-colors">
                        <User className="w-4 h-4 text-wrife-muted" />Lesson Resources
                      </Link>
                      {['teacher', 'school_admin'].includes(role) && (
                        <Link href="/teacher" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-wrife-text hover:bg-wrife-cream transition-colors">
                          <GraduationCap className="w-4 h-4 text-wrife-muted" />My Classes
                        </Link>
                      )}
                      {['admin', 'wrife_admin'].includes(role) && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-wrife-green hover:bg-wrife-cream transition-colors font-semibold">
                          <ShieldCheck className="w-4 h-4 text-wrife-green" />Admin Dashboard
                        </Link>
                      )}
                      <Link href="/" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-wrife-text hover:bg-wrife-cream transition-colors">
                        <Home className="w-4 h-4 text-wrife-muted" />Home page
                      </Link>
                      <Link href="https://wrife.co.uk" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-wrife-text hover:bg-wrife-cream transition-colors">
                        <BookOpen className="w-4 h-4 text-wrife-muted" />WriFe App
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-t border-wrife-cream-dark pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-1.5 rounded-lg text-wrife-muted hover:text-wrife-text hover:bg-wrife-cream transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-wrife-cream-dark bg-white">
          {/* User info strip */}
          <div className="px-4 py-3 bg-wrife-cream border-b border-wrife-cream-dark">
            <p className="text-sm font-semibold text-wrife-text">{displayName}</p>
            <p className="text-xs text-wrife-muted">{email}</p>
            <span className={`${tierBadgeClass[tier]} mt-1.5 inline-flex`}>{tierLabel(tier)}</span>
          </div>

          <nav className="py-2">
            {(role === 'pupil'
              ? [
                  { href: '/my-tasks', label: 'My Tasks' },
                  { href: '/dashboard', label: 'All Tools' },
                ]
              : [
                  { href: '/dashboard', label: 'All Tools' },
                  { href: '/daily/pwp', label: 'Daily Practice' },
                  { href: '/resources', label: 'Lesson Resources' },
                  ...(['teacher','school_admin'].includes(role) ? [{ href: '/teacher', label: 'My Classes' }] : []),
                  ...(['admin','wrife_admin'].includes(role) ? [{ href: '/admin', label: 'Admin Dashboard' }] : []),
                  { href: 'https://wrife.co.uk', label: '← WriFe App' },
                  { href: '/', label: 'Home page' },
                ]
            ).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-wrife-text hover:bg-wrife-cream transition-colors border-b border-wrife-cream/50"
              >
                {label}
              </Link>
            ))}

            {(tier === 'free' || tier === 'standard') && (
              <a
                href="https://wrife.co.uk/pricing"
                className="block px-4 py-3 text-sm font-semibold text-wrife-green"
              >
                Upgrade plan →
              </a>
            )}

            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
