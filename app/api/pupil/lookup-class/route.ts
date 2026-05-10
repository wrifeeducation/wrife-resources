import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// POST /api/pupil/lookup-class
// Body: { class_code: string }
// Returns: { class_name, year_group } or error
export async function POST(req: NextRequest) {
  try {
    const { class_code } = await req.json();
    if (!class_code?.trim()) {
      return NextResponse.json({ error: 'Class code is required.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: cls } = await admin
      .from('classes')
      .select('id, name, year_group')
      .eq('class_code', class_code.trim().toUpperCase())
      .single();

    if (!cls) {
      return NextResponse.json({ error: 'Class code not found. Check with your teacher.' }, { status: 404 });
    }

    return NextResponse.json({ class_id: cls.id, class_name: cls.name, year_group: cls.year_group });
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
