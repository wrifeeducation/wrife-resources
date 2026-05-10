import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ToolSlug } from '@/lib/supabase/types';

export interface CreateAssignmentBody {
  class_id: string;
  tool_slug: ToolSlug;
  title: string;
  lesson_number?: number | null;
  instructions?: string | null;
  due_date?: string | null;
}

// POST /api/teacher/assignments — create a new assignment
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['teacher', 'school_admin', 'admin', 'wrife_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: CreateAssignmentBody = await req.json();
    const { class_id, tool_slug, title, lesson_number, instructions, due_date } = body;

    if (!class_id || !tool_slug || !title?.trim()) {
      return NextResponse.json({ error: 'class_id, tool_slug and title are required' }, { status: 400 });
    }

    // Verify teacher owns the class (unless admin)
    if (!['admin', 'wrife_admin'].includes(profile.role)) {
      const { data: cls } = await supabase
        .from('classes')
        .select('id')
        .eq('id', class_id)
        .eq('teacher_id', user.id)
        .single();
      if (!cls) return NextResponse.json({ error: 'Class not found or not yours' }, { status: 403 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('ai_tool_assignments')
      .insert({
        class_id,
        teacher_id: user.id,
        tool_slug,
        title: title.trim(),
        lesson_number: lesson_number ?? null,
        instructions: instructions?.trim() ?? null,
        due_date: due_date ?? null,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ assignment: data }, { status: 201 });
  } catch (err) {
    console.error('[teacher/assignments POST]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/teacher/assignments?id=<uuid> — soft-delete (set is_active = false)
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['teacher', 'school_admin', 'admin', 'wrife_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const admin = createAdminClient();

    // Verify ownership (unless admin)
    if (!['admin', 'wrife_admin'].includes(profile.role)) {
      const { data: assignment } = await admin
        .from('ai_tool_assignments')
        .select('teacher_id')
        .eq('id', id)
        .single();
      if (!assignment || assignment.teacher_id !== user.id) {
        return NextResponse.json({ error: 'Not found or not yours' }, { status: 403 });
      }
    }

    const { error } = await admin
      .from('ai_tool_assignments')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[teacher/assignments DELETE]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
