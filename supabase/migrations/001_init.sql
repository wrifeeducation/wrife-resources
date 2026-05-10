-- ============================================================
-- WriFe Resource App — Initial Schema
-- Target: Supabase project gzmgjkbtsvezfclmreru (WriFe Platform)
-- Run via: Supabase Dashboard > SQL Editor, or supabase db push
-- ============================================================

-- ============================================================
-- Schools (for School License tier)
-- ============================================================
create table if not exists public.schools (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  postcode              text,
  contact_email         text not null,
  subscription_tier     text not null default 'free'
    check (subscription_tier in ('free', 'standard', 'full', 'school')),
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  subscription_status   text not null default 'inactive'
    check (subscription_status in ('inactive', 'active', 'trialing', 'past_due', 'canceled')),
  current_period_end    timestamptz,
  created_at            timestamptz default now() not null
);

-- ============================================================
-- Profiles (extends Supabase auth.users — one row per user)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null check (role in ('teacher', 'pupil', 'school_admin', 'wrife_admin')),
  school_id   uuid references public.schools(id),
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'teacher')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Subscriptions (individual teacher subscriptions via Stripe)
-- ============================================================
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id      text,
  stripe_subscription_id  text unique,
  tier                    text not null default 'free'
    check (tier in ('free', 'standard', 'full', 'school')),
  billing_period          text check (billing_period in ('monthly', 'yearly', 'school')),
  status                  text not null default 'inactive'
    check (status in ('inactive', 'active', 'trialing', 'past_due', 'canceled')),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean default false,
  created_at              timestamptz default now() not null,
  updated_at              timestamptz default now() not null
);

create unique index if not exists idx_subscriptions_active_per_user
  on public.subscriptions(user_id)
  where status = 'active';

-- ============================================================
-- AI Tool Sessions (one per tool open)
-- ============================================================
create table if not exists public.ai_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  tool_slug       text not null
    check (tool_slug in ('pwp','dwp','connect-grid','sentence-coach','story-types',
                         'composition','editing-doctor','genre-coach','project-mentor')),
  lesson_number   integer,
  mode            text,
  started_at      timestamptz default now() not null,
  ended_at        timestamptz
);

create index if not exists idx_ai_sessions_user on public.ai_sessions(user_id);
create index if not exists idx_ai_sessions_tool on public.ai_sessions(tool_slug);

-- ============================================================
-- AI Attempts (one row per AI call)
-- ============================================================
create table if not exists public.ai_attempts (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references public.ai_sessions(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  tool_slug           text not null,
  input               jsonb not null,
  output              jsonb,
  prompt_tokens       integer,
  completion_tokens   integer,
  cost_pence          integer,
  duration_ms         integer,
  success             boolean default true,
  error_message       text,
  created_at          timestamptz default now() not null
);

create index if not exists idx_ai_attempts_user    on public.ai_attempts(user_id);
create index if not exists idx_ai_attempts_session on public.ai_attempts(session_id);
create index if not exists idx_ai_attempts_created on public.ai_attempts(created_at);

-- ============================================================
-- Daily Practice Streaks
-- ============================================================
create table if not exists public.daily_streaks (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  tool_slug             text not null check (tool_slug in ('pwp', 'dwp')),
  current_streak        integer not null default 0,
  longest_streak        integer not null default 0,
  last_practice_date    date,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null,
  unique(user_id, tool_slug)
);

-- ============================================================
-- Usage Quotas (rate-limiting and cost control)
-- ============================================================
create table if not exists public.usage_quotas (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  tool_slug         text,
  period            text not null check (period in ('daily', 'monthly')),
  max_calls         integer not null,
  current_calls     integer not null default 0,
  period_starts_at  timestamptz not null,
  period_ends_at    timestamptz not null,
  unique(user_id, tool_slug, period)
);

-- ============================================================
-- Classes and Enrolments
-- ============================================================
create table if not exists public.classes (
  id               uuid primary key default gen_random_uuid(),
  teacher_id       uuid not null references public.profiles(id),
  school_id        uuid references public.schools(id),
  name             text not null,
  year_group       integer check (year_group between 2 and 9),
  invitation_code  text unique not null,
  created_at       timestamptz default now() not null
);

create table if not exists public.class_enrolments (
  id           uuid primary key default gen_random_uuid(),
  class_id     uuid not null references public.classes(id) on delete cascade,
  pupil_id     uuid not null references public.profiles(id) on delete cascade,
  enrolled_at  timestamptz default now() not null,
  unique(class_id, pupil_id)
);
