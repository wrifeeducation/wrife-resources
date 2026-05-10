'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ALL_TOOLS } from '@/lib/data/tools';
import type { ToolSlug } from '@/lib/supabase/types';
import {
  Users, BookOpen, Plus, Trash2, ChevronDown, ChevronUp,
  CalendarDays, ClipboardList, CheckCircle, AlertCircle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Pupil {
  id: string;
  display_name: string | null;
  first_name: string | null;
  year_group: number | null;
}

interface Assignment {
  id: string;
  tool_slug: ToolSlug;
  title: string;
  lesson_number: number | null;
  instructions: string | null;
  due_date: string | null;
  is_active: boolean;
  created_at: string;
}

interface ClassData {
  id: string;
  name: string;
  class_code: string;
  year_group: number | null;
  pupils: Pupil[];
  assignments: Assignment[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TOOL_SLUGS: ToolSlug[] = ALL_TOOLS.map((t) => t.slug);

function toolLabel(slug: ToolSlug) {
  return ALL_TOOLS.find((t) => t.slug === slug)?.label ?? slug;
}
function toolIcon(slug: ToolSlug) {
  return ALL_TOOLS.find((t) => t.slug === slug)?.icon ?? '🔧';
}

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
}

// ── New assignment form ────────────────────────────────────────────────────────

interface NewAssignmentFormProps {
  classId: string;
  onCreated: () => void;
  onCancel: () => void;
}

function NewAssignmentForm({ classId, onCreated, onCancel }: NewAssignmentFormProps) {
  const [toolSlug, setToolSlug] = useState<ToolSlug>('pwp');
  const [title, setTitle] = useState('');
  const [lessonNumber, setLessonNumber] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError('Please enter a title.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/teacher/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          tool_slug: toolSlug,
          title: title.trim(),
          lesson_number: lessonNumber ? parseInt(lessonNumber, 10) : null,
          instructions: instructions.trim() || null,
          due_date: dueDate || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? 'Something went wrong.'); return; }
      onCreated();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-wrife-cream rounded-xl p-4 space-y-3">
      <h4 className="text-sm font-semibold text-wrife-text">New assignment</h4>

      {/* Tool picker */}
      <div>
        <label className="block text-xs font-medium text-wrife-muted mb-1">AI Tool *</label>
        <div className="grid grid-cols-3 gap-2">
          {ALL_TOOLS.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setToolSlug(t.slug)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors
                ${toolSlug === t.slug
                  ? 'bg-wrife-green text-white border-wrife-green'
                  : 'bg-white text-wrife-text border-wrife-cream-dark hover:border-wrife-green'}`}
            >
              <span>{t.icon}</span>
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-wrife-muted mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`e.g. "Practice ${toolLabel(toolSlug)} this week"`}
          className="w-full px-3 py-2 text-sm border border-wrife-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-wrife-green bg-white"
        />
      </div>

      {/* Lesson number + due date row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-wrife-muted mb-1">Lesson number</label>
          <input
            type="number"
            min={1}
            max={67}
            value={lessonNumber}
            onChange={(e) => setLessonNumber(e.target.value)}
            placeholder="e.g. 27"
            className="w-full px-3 py-2 text-sm border border-wrife-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-wrife-green bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-wrife-muted mb-1">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-wrife-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-wrife-green bg-white"
          />
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-xs font-medium text-wrife-muted mb-1">Instructions for pupils</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={2}
          placeholder="Optional extra guidance shown to pupils…"
          className="w-full px-3 py-2 text-sm border border-wrife-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-wrife-green bg-white resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
        >
          {loading ? 'Saving…' : <><CheckCircle className="w-3.5 h-3.5" /> Assign</>}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-wrife-muted hover:text-wrife-text transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Class card ────────────────────────────────────────────────────────────────

function ClassCard({ cls, onRefresh }: { cls: ClassData; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/teacher/assignments?id=${id}`, { method: 'DELETE' });
      onRefresh();
    } finally {
      setDeletingId(null);
    }
  }

  const activeAssignments = cls.assignments.filter((a) => a.is_active);

  return (
    <div className="wrife-card">
      {/* Class header */}
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-wrife-green/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-wrife-green" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-wrife-text">{cls.name}</h3>
            <p className="text-xs text-wrife-muted">
              {cls.year_group ? `Year ${cls.year_group} · ` : ''}
              {cls.pupils.length} pupil{cls.pupils.length !== 1 ? 's' : ''} · Class code:{' '}
              <span className="font-mono font-semibold tracking-wider">{cls.class_code}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs bg-wrife-cream px-2 py-0.5 rounded-full text-wrife-muted">
            {activeAssignments.length} active task{activeAssignments.length !== 1 ? 's' : ''}
          </span>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-wrife-muted" />
            : <ChevronDown className="w-4 h-4 text-wrife-muted" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-5 space-y-5">
          {/* Pupils list */}
          {cls.pupils.length > 0 ? (
            <div>
              <h4 className="text-xs font-semibold text-wrife-muted uppercase tracking-wide mb-2">Pupils</h4>
              <div className="flex flex-wrap gap-2">
                {cls.pupils.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-wrife-cream text-xs text-wrife-text"
                  >
                    <span className="w-4 h-4 rounded-full bg-wrife-green text-white text-[10px] flex items-center justify-center font-semibold">
                      {(p.display_name ?? p.first_name ?? '?')[0].toUpperCase()}
                    </span>
                    {p.display_name ?? p.first_name ?? 'Pupil'}
                    {p.year_group ? <span className="text-wrife-muted">Y{p.year_group}</span> : null}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-wrife-muted italic">No pupils in this class yet.</p>
          )}

          {/* Active assignments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-wrife-muted uppercase tracking-wide">
                <ClipboardList className="w-3.5 h-3.5 inline mr-1" />Assigned tasks
              </h4>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1 text-xs text-wrife-green hover:underline font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add task
                </button>
              )}
            </div>

            {activeAssignments.length === 0 && !showForm ? (
              <p className="text-sm text-wrife-muted italic">No tasks assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {activeAssignments.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-3 bg-wrife-cream rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg flex-shrink-0">{toolIcon(a.tool_slug)}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-wrife-text truncate">{a.title}</p>
                        <p className="text-xs text-wrife-muted">
                          {toolLabel(a.tool_slug)}
                          {a.lesson_number ? ` · L${String(a.lesson_number).padStart(2, '0')}` : ''}
                          {a.due_date ? (
                            <span className="ml-2 inline-flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />Due {fmt(a.due_date)}
                            </span>
                          ) : null}
                        </p>
                        {a.instructions && (
                          <p className="text-xs text-wrife-muted mt-0.5 italic line-clamp-1">{a.instructions}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deletingId === a.id}
                      className="flex-shrink-0 p-1.5 rounded-lg text-wrife-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showForm && (
              <NewAssignmentForm
                classId={cls.id}
                onCreated={() => { setShowForm(false); onRefresh(); }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TeacherPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['teacher', 'school_admin', 'admin', 'wrife_admin'].includes(profile.role)) {
      router.push('/dashboard');
      return;
    }

    // Load teacher's classes
    const { data: rawClasses, error: classErr } = await supabase
      .from('classes')
      .select('id, name, class_code, year_group')
      .eq('teacher_id', user.id)
      .order('name');

    if (classErr) { setError('Could not load your classes.'); setLoading(false); return; }
    if (!rawClasses?.length) { setClasses([]); setLoading(false); return; }

    const classIds = rawClasses.map((c) => c.id);

    // Parallel: pupils + assignments per class
    const [{ data: memberRows }, { data: assignmentRows }] = await Promise.all([
      supabase
        .from('class_members')
        .select('class_id, pupil_id, profiles!class_members_pupil_id_fkey(display_name, first_name, year_group)')
        .in('class_id', classIds),
      supabase
        .from('ai_tool_assignments')
        .select('id, class_id, tool_slug, title, lesson_number, instructions, due_date, is_active, created_at')
        .in('class_id', classIds)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false }),
    ]);

    const classMap: Record<string, ClassData> = {};
    for (const c of rawClasses) {
      classMap[c.id] = { ...c, pupils: [], assignments: [] };
    }

    for (const row of memberRows ?? []) {
      if (!row.class_id || !row.pupil_id) continue;
      const p = row.profiles as { display_name: string | null; first_name: string | null; year_group: number | null } | null;
      if (classMap[row.class_id]) {
        classMap[row.class_id].pupils.push({
          id: row.pupil_id,
          display_name: p?.display_name ?? null,
          first_name: p?.first_name ?? null,
          year_group: p?.year_group ?? null,
        });
      }
    }

    for (const a of assignmentRows ?? []) {
      if (classMap[a.class_id]) {
        classMap[a.class_id].assignments.push(a as Assignment);
      }
    }

    setClasses(Object.values(classMap));
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wrife-text mb-1">Teacher Dashboard</h1>
          <p className="text-wrife-muted text-sm">
            Manage your classes and assign AI writing tools to pupils.
          </p>
        </div>
        <a
          href="https://wrife.co.uk/dashboard"
          className="text-sm text-wrife-muted hover:text-wrife-text flex items-center gap-1 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          <BookOpen className="w-4 h-4" /> Manage classes on WriFe
        </a>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-wrife-muted text-sm">
          Loading your classes…
        </div>
      )}

      {error && (
        <div className="wrife-card border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {!loading && !error && classes.length === 0 && (
        <div className="wrife-card text-center py-12">
          <Users className="w-10 h-10 text-wrife-muted mx-auto mb-3" />
          <h3 className="font-semibold text-wrife-text mb-2">No classes found</h3>
          <p className="text-sm text-wrife-muted mb-4">
            Create a class on the WriFe platform, then come back here to assign tools.
          </p>
          <a
            href="https://wrife.co.uk/dashboard"
            className="btn-primary text-sm"
            target="_blank"
            rel="noreferrer"
          >
            Go to WriFe App →
          </a>
        </div>
      )}

      {!loading && classes.length > 0 && (
        <div className="space-y-6">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} onRefresh={loadData} />
          ))}
        </div>
      )}

      {/* Tip */}
      {!loading && classes.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
          <strong>Tip:</strong> Pupils log in using their username and class PIN at{' '}
          <a href="/join" className="underline font-medium">/join</a>.
          Once in, they&apos;ll see the tasks you&apos;ve assigned here.
        </div>
      )}
    </div>
  );
}
