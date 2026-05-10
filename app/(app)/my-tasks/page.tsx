'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ALL_TOOLS } from '@/lib/data/tools';
import type { ToolSlug } from '@/lib/supabase/types';
import { ArrowRight, CalendarDays, BookOpen, Sparkles, Star } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  tool_slug: ToolSlug;
  title: string;
  lesson_number: number | null;
  instructions: string | null;
  due_date: string | null;
  class_name: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toolInfo(slug: ToolSlug) {
  return ALL_TOOLS.find((t) => t.slug === slug);
}

function fmt(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
}

function isDueSoon(due: string | null) {
  if (!due) return false;
  const diff = new Date(due).getTime() - Date.now();
  return diff >= 0 && diff < 3 * 24 * 60 * 60 * 1000; // within 3 days
}

function isOverdue(due: string | null) {
  if (!due) return false;
  return new Date(due).getTime() < Date.now();
}

// ── Task card ─────────────────────────────────────────────────────────────────

function TaskCard({ task }: { task: Task }) {
  const tool = toolInfo(task.tool_slug);
  const dueSoon  = isDueSoon(task.due_date);
  const overdue  = isOverdue(task.due_date);
  const dueLabel = fmt(task.due_date);

  return (
    <Link href={tool?.href ?? '/dashboard'} className="block group">
      <div className="bg-white rounded-2xl border-2 border-wrife-cream-dark
                      group-hover:border-wrife-green group-hover:shadow-md
                      transition-all duration-200 p-5">
        <div className="flex items-start gap-4">
          {/* Big icon */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
               style={{ backgroundColor: `${tool?.colour ?? '#27AE60'}22` }}>
            {tool?.icon ?? '🔧'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-wrife-muted mb-0.5 uppercase tracking-wide">
              {task.class_name}
              {task.lesson_number ? ` · Lesson ${String(task.lesson_number).padStart(2, '0')}` : ''}
            </p>
            <h3 className="font-bold text-wrife-text text-base leading-snug mb-1 group-hover:text-wrife-green transition-colors">
              {task.title}
            </h3>
            <p className="text-sm text-wrife-muted">{tool?.label ?? task.tool_slug}</p>

            {task.instructions && (
              <p className="mt-2 text-sm text-wrife-text bg-wrife-cream rounded-xl px-3 py-2 leading-relaxed">
                {task.instructions}
              </p>
            )}

            {dueLabel && (
              <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
                ${overdue ? 'bg-red-100 text-red-700'
                  : dueSoon ? 'bg-amber-100 text-amber-700'
                  : 'bg-blue-50 text-blue-700'}`}>
                <CalendarDays className="w-3 h-3" />
                {overdue ? 'Overdue — ' : dueSoon ? 'Due soon — ' : 'Due '}
                {dueLabel}
              </div>
            )}
          </div>

          {/* Arrow */}
          <ArrowRight className="w-5 h-5 text-wrife-muted group-hover:text-wrife-green
                                  group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
        </div>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MyTasksPage() {
  const router = useRouter();
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/join'); return; }

      // Get pupil profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, display_name, first_name, class_id')
        .eq('id', user.id)
        .single();

      if (!profile) { router.push('/join'); return; }

      // Non-pupils go to normal dashboard
      if (!['pupil'].includes(profile.role)) {
        router.push('/dashboard');
        return;
      }

      setDisplayName(profile.display_name ?? profile.first_name ?? 'there');

      // Find the pupil's class via class_members
      const { data: memberRow } = await supabase
        .from('class_members')
        .select('class_id')
        .eq('pupil_id', user.id)
        .single();

      const classId = memberRow?.class_id ?? profile.class_id;

      if (!classId) {
        setTasks([]);
        setLoading(false);
        return;
      }

      // Load active assignments for this class
      const { data: assignments, error: assignErr } = await supabase
        .from('ai_tool_assignments')
        .select('id, tool_slug, title, lesson_number, instructions, due_date, classes(name)')
        .eq('class_id', classId)
        .eq('is_active', true)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (assignErr) {
        setError('Could not load your tasks. Please try again.');
        setLoading(false);
        return;
      }

      const mapped: Task[] = (assignments ?? []).map((a) => ({
        id: a.id,
        tool_slug: a.tool_slug as ToolSlug,
        title: a.title,
        lesson_number: a.lesson_number,
        instructions: a.instructions,
        due_date: a.due_date,
        class_name: (a.classes as { name: string } | null)?.name ?? 'Your class',
      }));

      setTasks(mapped);
      setLoading(false);
    }

    load();
  }, [router]);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-wrife-muted text-sm">
        Loading your tasks…
      </div>
    );
  }

  // ── No tasks ───────────────────────────────────────────────────────────────

  if (!loading && tasks.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-4">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-wrife-text mb-2">
          All caught up, {displayName}!
        </h2>
        <p className="text-wrife-muted text-sm mb-6">
          Your teacher hasn&apos;t set any tasks yet. Come back later — or explore a tool yourself!
        </p>
        <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Explore tools
        </Link>
      </div>
    );
  }

  // ── Task list ──────────────────────────────────────────────────────────────

  const overdueTasks = tasks.filter((t) => isOverdue(t.due_date));
  const upcomingTasks = tasks.filter((t) => !isOverdue(t.due_date));

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <h1 className="text-2xl font-bold text-wrife-text">
            Hello, {displayName}! 👋
          </h1>
        </div>
        <p className="text-wrife-muted text-sm">
          {tasks.length === 1
            ? 'You have 1 task from your teacher.'
            : `You have ${tasks.length} tasks from your teacher.`}
          {' '}Tap a task to start!
        </p>
      </div>

      {error && (
        <div className="wrife-card border border-red-200 bg-red-50 text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Overdue */}
      {overdueTasks.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span>⚠️</span> Overdue
          </h2>
          <div className="space-y-3">
            {overdueTasks.map((t) => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}

      {/* Upcoming / no-due-date */}
      {upcomingTasks.length > 0 && (
        <section className="mb-6">
          {overdueTasks.length > 0 && (
            <h2 className="text-xs font-semibold text-wrife-muted uppercase tracking-wide mb-3">
              To do
            </h2>
          )}
          <div className="space-y-3">
            {upcomingTasks.map((t) => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}

      {/* Explore more */}
      <div className="mt-8 bg-wrife-cream rounded-2xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-wrife-text">Want to do more?</p>
          <p className="text-xs text-wrife-muted">Explore all the WriFe writing tools</p>
        </div>
        <Link href="/dashboard" className="btn-primary text-sm flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> All tools
        </Link>
      </div>
    </div>
  );
}
