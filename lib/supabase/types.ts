/**
 * Database type definitions for resource.wrife.co.uk
 * Mirrors the Supabase schema defined in supabase/migrations/001_init.sql
 * Regenerate with: npx supabase gen types typescript --project-id gzmgjkbtsvezfclmreru
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Tier = 'free' | 'standard' | 'full' | 'school';
export type UserRole = 'teacher' | 'pupil' | 'admin' | 'school_admin' | 'parent';
export type ToolSlug =
  | 'pwp'
  | 'dwp'
  | 'connect-grid'
  | 'sentence-coach'
  | 'story-types'
  | 'composition'
  | 'editing-doctor'
  | 'genre-coach'
  | 'project-mentor';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          role: UserRole;
          display_name: string | null;
          first_name: string | null;
          school_id: string | null;
          school_name: string | null;
          membership_tier: Tier;  // source of truth for subscription tier
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          class_id: string | null;
          year_group: number | null;
          avatar_colour: string | null;
          selected_avatar: string | null;
          is_active: boolean | null;
          pin_code: string | null;
          coins: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      schools: {
        Row: {
          id: string;
          name: string;
          postcode: string | null;
          contact_email: string | null;
          subscription_tier: string | null;
          status: string | null;
          active: boolean | null;
          admin_user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['schools']['Insert']>;
      };
      subscriptions: {
        // id = Stripe subscription ID (text), not a UUID
        Row: {
          id: string;
          user_id: string;
          status: string;
          price_id: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      ai_sessions: {
        Row: {
          id: string;
          user_id: string;
          tool_slug: ToolSlug;
          lesson_number: number | null;
          mode: string | null;
          started_at: string;
          ended_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['ai_sessions']['Row'], 'id' | 'started_at'>;
        Update: Partial<Database['public']['Tables']['ai_sessions']['Insert']>;
      };
      ai_attempts: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          tool_slug: ToolSlug;
          input: Json;
          output: Json | null;
          prompt_tokens: number | null;
          completion_tokens: number | null;
          cost_pence: number | null;
          duration_ms: number | null;
          success: boolean;
          error_message: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_attempts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_attempts']['Insert']>;
      };
      daily_streaks: {
        Row: {
          id: string;
          user_id: string;
          tool_slug: 'pwp' | 'dwp';
          current_streak: number;
          longest_streak: number;
          last_practice_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['daily_streaks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['daily_streaks']['Insert']>;
      };
      usage_quotas: {
        Row: {
          id: string;
          user_id: string;
          tool_slug: ToolSlug | null;
          period: 'daily' | 'monthly';
          max_calls: number;
          current_calls: number;
          period_starts_at: string;
          period_ends_at: string;
        };
        Insert: Omit<Database['public']['Tables']['usage_quotas']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['usage_quotas']['Insert']>;
      };
      ai_tool_assignments: {
        Row: {
          id: string;
          class_id: string;
          teacher_id: string;
          tool_slug: ToolSlug;
          lesson_number: number | null;
          title: string;
          instructions: string | null;
          due_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['ai_tool_assignments']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['ai_tool_assignments']['Insert']>;
      };
      classes: {
        Row: {
          id: string;
          teacher_id: string | null;
          school_id: string | null;
          name: string;
          year_group: number | null;
          class_code: string;   // platform uses class_code, not invitation_code
          school_name: string | null;
          account_type: string | null;
          home_account_id: string | null;
          w_level: number;
          active_genre: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['classes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['classes']['Insert']>;
      };
      class_members: {
        // platform uses class_members, not class_enrolments
        Row: {
          id: string;
          class_id: string | null;
          pupil_id: string | null;
          joined_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['class_members']['Row'], 'id' | 'joined_at'>;
        Update: Partial<Database['public']['Tables']['class_members']['Insert']>;
      };
    };
    Functions: {
      get_user_tier: {
        Args: { uid: string };
        Returns: Tier;
      };
    };
  };
}
