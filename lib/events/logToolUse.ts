import { createClient } from '@/lib/supabase/server';

export type ResourceEventType =
  | 'pwp_session'
  | 'dwp_session'
  | 'connect_grid_session'
  | 'sentence_coach_session'
  | 'story_types_session'
  | 'composition_session'
  | 'editing_doctor_session'
  | 'genre_coach_session'
  | 'project_mentor_session';

interface LogToolUseParams {
  /** The Supabase auth user ID of the teacher or pupil using the tool. */
  userId: string;
  eventType: ResourceEventType;
  /** Optional free-form payload — keep lightweight (no full text). */
  eventData?: Record<string, unknown>;
}

/**
 * Inserts a `learning_events` row with app = 'resources'.
 *
 * Runs fire-and-forget: errors are caught and logged but never thrown,
 * so a logging failure never blocks the API response.
 *
 * The RLS `learning_events_pupil_insert` policy requires `pupil_id = auth.uid()`,
 * which is satisfied when called from a server-side route handler with the
 * user's session cookie present.
 */
export async function logToolUse({
  userId,
  eventType,
  eventData = {},
}: LogToolUseParams): Promise<void> {
  try {
    const supabase = await createClient();
    // learning_events is owned by wrife-website; cast to any for cross-app insert.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('learning_events').insert({
      pupil_id: userId,
      app: 'resources',
      event_type: eventType,
      event_data: eventData,
    });

    if (error) {
      console.error('[logToolUse] Supabase insert error:', error.message);
    }
  } catch (err) {
    // Never propagate — logging must not block the response.
    console.error('[logToolUse] Unexpected error:', err);
  }
}
