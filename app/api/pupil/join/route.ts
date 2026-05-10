import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// POST /api/pupil/join
// Body: { class_code: string; username: string; pin: string }
// Returns: { access_token, refresh_token, user_id } or error
//
// Strategy:
//   1. Look up class by class_code
//   2. Find pupil in class_members whose profile has matching
//      display_name/first_name (case-insensitive) AND pin_code
//   3. Generate a magic-link session via admin.auth.admin.generateLink()
//      so the pupil gets a real Supabase session without knowing their email/password

export async function POST(req: NextRequest) {
  try {
    const { class_code, username, pin } = await req.json();

    if (!class_code?.trim() || !username?.trim() || !pin?.trim()) {
      return NextResponse.json({ error: 'Class code, username and PIN are required.' }, { status: 400 });
    }

    const admin = createAdminClient();

    // 1. Resolve class
    const { data: cls } = await admin
      .from('classes')
      .select('id')
      .eq('class_code', class_code.trim().toUpperCase())
      .single();

    if (!cls) {
      return NextResponse.json({ error: 'Class code not found.' }, { status: 404 });
    }

    // 2. Find matching pupil in this class
    //    Join class_members → profiles, match name + PIN
    const { data: members } = await admin
      .from('class_members')
      .select('pupil_id, profiles!class_members_pupil_id_fkey(id, email, display_name, first_name, pin_code, is_active)')
      .eq('class_id', cls.id);

    if (!members?.length) {
      return NextResponse.json({ error: 'No pupils found in this class.' }, { status: 404 });
    }

    const candidate = members.find((m) => {
      const p = m.profiles as {
        id: string; email: string | null;
        display_name: string | null; first_name: string | null;
        pin_code: string | null; is_active: boolean | null;
      } | null;
      if (!p) return false;
      const nameLower = username.trim().toLowerCase();
      const nameMatch =
        (p.display_name?.toLowerCase() === nameLower) ||
        (p.first_name?.toLowerCase() === nameLower);
      const pinMatch = p.pin_code === pin.trim();
      return nameMatch && pinMatch;
    });

    if (!candidate) {
      // Deliberately vague to prevent enumeration
      return NextResponse.json({ error: 'Username or PIN not recognised. Ask your teacher for help.' }, { status: 401 });
    }

    const pupilProfile = candidate.profiles as {
      id: string; email: string | null;
      display_name: string | null; first_name: string | null;
      pin_code: string | null; is_active: boolean | null;
    };

    if (pupilProfile.is_active === false) {
      return NextResponse.json({ error: 'This account is inactive. Ask your teacher.' }, { status: 403 });
    }

    if (!pupilProfile.email) {
      return NextResponse.json({ error: 'No email on this account. Ask your teacher to check your profile.' }, { status: 422 });
    }

    // 3. Generate a magic-link token so we can exchange it for a session
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: pupilProfile.email,
    });

    if (linkErr || !linkData) {
      console.error('[pupil/join] generateLink error', linkErr);
      return NextResponse.json({ error: 'Could not create session. Please try again.' }, { status: 500 });
    }

    // The hashed_token is embedded in the action_link; extract it
    const url = new URL(linkData.properties.action_link);
    const token = url.searchParams.get('token');
    const type  = url.searchParams.get('type') ?? 'magiclink';

    return NextResponse.json({ token, type, email: pupilProfile.email });
  } catch (err) {
    console.error('[pupil/join]', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
