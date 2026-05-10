-- ============================================================
-- WriFe Resource App — Row Level Security Policies
-- Run AFTER 001_init.sql
-- ============================================================

-- profiles
alter table public.profiles enable row level security;

create policy "Users see own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Teachers see their enrolled pupils"
  on public.profiles for select
  using (
    exists (
      select 1
      from class_enrolments ce
      join classes c on c.id = ce.class_id
      where ce.pupil_id = profiles.id
        and c.teacher_id = auth.uid()
    )
  );

-- subscriptions
alter table public.subscriptions enable row level security;

create policy "Users see own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ai_sessions
alter table public.ai_sessions enable row level security;

create policy "Users see own sessions"
  on public.ai_sessions for select
  using (auth.uid() = user_id);

create policy "Users insert own sessions"
  on public.ai_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users update own sessions"
  on public.ai_sessions for update
  using (auth.uid() = user_id);

-- ai_attempts — select only; INSERT is server-side via service_role
alter table public.ai_attempts enable row level security;

create policy "Users see own attempts"
  on public.ai_attempts for select
  using (auth.uid() = user_id);

create policy "Teachers see pupil attempts"
  on public.ai_attempts for select
  using (
    exists (
      select 1
      from class_enrolments ce
      join classes c on c.id = ce.class_id
      where ce.pupil_id = ai_attempts.user_id
        and c.teacher_id = auth.uid()
    )
  );

-- daily_streaks
alter table public.daily_streaks enable row level security;

create policy "Users see own streaks"
  on public.daily_streaks for select
  using (auth.uid() = user_id);

create policy "Users upsert own streaks"
  on public.daily_streaks for insert
  with check (auth.uid() = user_id);

create policy "Users update own streaks"
  on public.daily_streaks for update
  using (auth.uid() = user_id);

-- usage_quotas
alter table public.usage_quotas enable row level security;

create policy "Users see own quotas"
  on public.usage_quotas for select
  using (auth.uid() = user_id);

-- classes
alter table public.classes enable row level security;

create policy "Teachers see own classes"
  on public.classes for select
  using (auth.uid() = teacher_id);

create policy "Teachers manage own classes"
  on public.classes for all
  using (auth.uid() = teacher_id);

-- class_enrolments
alter table public.class_enrolments enable row level security;

create policy "Teachers see enrolments in their classes"
  on public.class_enrolments for select
  using (
    exists (
      select 1 from classes c
      where c.id = class_enrolments.class_id
        and c.teacher_id = auth.uid()
    )
  );

create policy "Pupils see own enrolments"
  on public.class_enrolments for select
  using (auth.uid() = pupil_id);
