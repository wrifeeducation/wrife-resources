import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/teacher/assignment-results?assignment_id=<uuid>
// Returns per-pupil completion status for a single assignment.
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const assignmentId = req.nextUrl.searchParams.get('assignment_id');
    if (!assignmentId) return NextResponse.json({ error: 'assignment_id required' }, { status: 400 });

    const admin = createAdminClient();

    // 1. Load the assignment (verify teacher owns it)
    const { data: assignment } = await admin
      .from('ai_tool_assignments')
      .select('id, class_id, teacher_id, tool_slug, created_at')
      .eq('id', assignmentId)
      .single();

    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    if (assignment.teacher_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Get all pupils in the class
    const { data: members } = await admin
      .from('class_members')
      .select('pupil_id, profiles!class_members_pupil_id_fkey(display_name, first_name)')
      .eq('class_id', assignment.class_id);

    if (!members?.length) {
      return NextResponse.json({ results: [] });
    }

    const pupilIds = members.map((m) => m.pupil_id).filter(Boolean) as string[];

    // 3. Get ai_attempts for this tool from these pupils since the assignment was created
    const { data: attempts } = await admin
      .from('ai_attempts')
      .select('user_id, success, created_at, output')
      .eq('tool_slug', assignment.tool_slug)
      .in('user_id', pupilIds)
      .gte('created_at', assignment.created_at)
      .order('created_at', { ascending: false });

    // 4. Group by pupil
    const attemptsByPupil: Record<string, typeof attempts> = {};
    for (const a of attempts ?? []) {
      if (!attemptsByPupil[a.user_id]) attemptsByPupil[a.user_id] = [];
      attemptsByPupil[a.user_id]!.push(a);
    }

    // 5. Build result rows
    const results = members.map((m) => {
      const profile = m.profiles as { display_name: string | null; first_name: string | null } | null;
      const pupilAttempts = attemptsByPupil[m.pupil_id ?? ''] ?? [];
      const latest = pupilAttempts[0] ?? null;
      const successCount = pupilAttempts.filter((a) => a.success).length;

      return {
        pupil_id: m.pupil_id,
        pupil_name: profile?.display_name ?? profile?.first_name ?? 'Pupil',
        completed: pupilAttempts.length > 0,
        attempt_count: pupilAttempts.length,
        success_count: successCount,
        last_attempt_at: latest?.created_at ?? null,
        last_success: latest?.success ?? null,
      };
    });

    // Sort: completed first, then alphabetical
    results.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? -1 : 1;
      return a.pupil_name.localeCompare(b.pupil_name);
    });

    return NextResponse.json({ results });
  } catch (err) {
    console.error('[assignment-results]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
