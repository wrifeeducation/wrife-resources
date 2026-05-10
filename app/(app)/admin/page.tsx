import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = { title: 'Admin Dashboard — WriFe Resources' };

async function getStats() {
  const admin = createAdminClient();

  const [
    { data: profiles },
    { data: subs },
    { data: recentUsers },
    { data: toolUsage },
  ] = await Promise.all([
    admin.from('profiles').select('role, membership_tier, is_active, created_at'),
    admin.from('subscriptions').select('tier, status'),
    admin.from('profiles').select('email, display_name, first_name, role, membership_tier, created_at')
      .order('created_at', { ascending: false }).limit(10),
    admin.from('ai_attempts').select('tool_slug, success').limit(10000),
  ]);

  const roleCount: Record<string, number> = {};
  const tierCount: Record<string, number> = {};
  profiles?.forEach((p) => {
    roleCount[p.role] = (roleCount[p.role] ?? 0) + 1;
    tierCount[p.membership_tier] = (tierCount[p.membership_tier] ?? 0) + 1;
  });

  const toolCount: Record<string, number> = {};
  toolUsage?.forEach((a) => {
    if (a.success) toolCount[a.tool_slug] = (toolCount[a.tool_slug] ?? 0) + 1;
  });

  const activeSubs = subs?.filter((s) => s.status === 'active').length ?? 0;

  return {
    totalUsers: profiles?.length ?? 0,
    activeUsers: profiles?.filter((p) => p.is_active).length ?? 0,
    roleCount,
    tierCount,
    activeSubs,
    toolCount,
    recentUsers: recentUsers ?? [],
  };
}

const ROLE_LABELS: Record<string, string> = {
  teacher: 'Teachers', pupil: 'Pupils', school_admin: 'School Admins',
  admin: 'Admins', wrife_admin: 'WriFe Admins', parent: 'Parents',
};
const TIER_COLOURS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700', standard: 'bg-blue-100 text-blue-700',
  full: 'bg-green-100 text-green-700', school: 'bg-purple-100 text-purple-700',
};
const TOOL_ICONS: Record<string, string> = {
  pwp: '✍️', dwp: '📖', 'connect-grid': '🔲', 'sentence-coach': '⭐',
  'story-types': '🔍', composition: '📝', 'editing-doctor': '🩺',
  'genre-coach': '🎭', 'project-mentor': '🎓',
};

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Check admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'wrife_admin'].includes(profile.role)) {
    redirect('/dashboard');
  }

  const stats = await getStats();
  const topTools = Object.entries(stats.toolCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 9);
  const totalAttempts = Object.values(stats.toolCount).reduce((s, n) => s + n, 0);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-wrife-text mb-1">WriFe Resources — Admin</h1>
        <p className="text-wrife-muted text-sm">Platform overview · read-only · data refreshes on each visit</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total users',   value: stats.totalUsers,  sub: `${stats.activeUsers} active` },
          { label: 'Active subs',   value: stats.activeSubs,  sub: 'paid subscriptions' },
          { label: 'AI calls',      value: totalAttempts,     sub: 'successful attempts' },
          { label: 'Paid teachers', value: stats.tierCount['full'] ?? 0, sub: 'Full Teacher tier' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="wrife-card text-center py-5">
            <p className="text-3xl font-bold text-wrife-green">{value.toLocaleString()}</p>
            <p className="text-sm font-semibold text-wrife-text mt-1">{label}</p>
            <p className="text-xs text-wrife-muted mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* Users by role */}
        <div className="wrife-card">
          <h2 className="text-base font-semibold text-wrife-text mb-4">Users by role</h2>
          <div className="space-y-2">
            {Object.entries(stats.roleCount).sort(([, a], [, b]) => b - a).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm text-wrife-text">{ROLE_LABELS[role] ?? role}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-wrife-cream rounded-full overflow-hidden">
                    <div className="h-full bg-wrife-green rounded-full"
                      style={{ width: `${Math.round((count / stats.totalUsers) * 100)}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-wrife-text w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users by tier */}
        <div className="wrife-card">
          <h2 className="text-base font-semibold text-wrife-text mb-4">Users by subscription tier</h2>
          <div className="space-y-2">
            {Object.entries(stats.tierCount).sort(([, a], [, b]) => b - a).map(([tier, count]) => (
              <div key={tier} className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TIER_COLOURS[tier] ?? 'bg-gray-100 text-gray-700'}`}>
                  {tier}
                </span>
                <span className="text-sm font-semibold text-wrife-text">{count} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool usage */}
      <div className="wrife-card mb-8">
        <h2 className="text-base font-semibold text-wrife-text mb-4">AI tool usage (successful calls)</h2>
        {topTools.length === 0 ? (
          <p className="text-sm text-wrife-muted">No usage recorded yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {topTools.map(([slug, count]) => (
              <div key={slug} className="bg-wrife-cream rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{TOOL_ICONS[slug] ?? '🔧'}</span>
                <div>
                  <p className="text-xs font-semibold text-wrife-text capitalize">{slug.replace(/-/g, ' ')}</p>
                  <p className="text-lg font-bold text-wrife-green">{count.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent signups */}
      <div className="wrife-card">
        <h2 className="text-base font-semibold text-wrife-text mb-4">Recent signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-wrife-cream-dark">
                {['Name / Email', 'Role', 'Tier', 'Joined'].map((h) => (
                  <th key={h} className="text-left pb-2 text-xs font-semibold text-wrife-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-wrife-cream">
              {stats.recentUsers.map((u, i) => (
                <tr key={i}>
                  <td className="py-2.5 pr-4">
                    <p className="font-medium text-wrife-text truncate max-w-[180px]">
                      {u.display_name ?? u.first_name ?? '—'}
                    </p>
                    <p className="text-xs text-wrife-muted truncate max-w-[180px]">{u.email}</p>
                  </td>
                  <td className="py-2.5 pr-4 text-wrife-muted capitalize">{u.role}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIER_COLOURS[u.membership_tier] ?? ''}`}>
                      {u.membership_tier}
                    </span>
                  </td>
                  <td className="py-2.5 text-wrife-muted text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-wrife-muted mt-4">
          Full user management: <a href={`https://supabase.com/dashboard/project/gzmgjkbtsvezfclmreru/auth/users`}
            target="_blank" rel="noreferrer" className="text-wrife-green hover:underline">
            Supabase dashboard →
          </a>
        </p>
      </div>
    </div>
  );
}
