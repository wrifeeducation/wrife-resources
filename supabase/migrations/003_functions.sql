-- ============================================================
-- WriFe Resource App — Database Functions
-- Run AFTER 002_rls.sql
-- ============================================================

-- ============================================================
-- get_user_tier: resolve the effective subscription tier for a user
-- Checks school license first, then individual subscription, defaults to 'free'
-- ============================================================
create or replace function public.get_user_tier(uid uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce(
    -- School license takes precedence over individual subscription
    (
      select 'school'::text
      from schools s
      join profiles p on p.school_id = s.id
      where p.id = uid
        and s.subscription_status = 'active'
      limit 1
    ),
    -- Individual subscription
    (
      select tier::text
      from subscriptions
      where user_id = uid
        and status = 'active'
      order by current_period_end desc
      limit 1
    ),
    'free'::text
  );
$$;

-- Grant execute to authenticated users (read own tier via RPC)
grant execute on function public.get_user_tier(uuid) to authenticated;

-- ============================================================
-- increment_usage: safely increment usage counter (atomic)
-- Returns the new current_calls value
-- ============================================================
create or replace function public.increment_usage(
  p_user_id   uuid,
  p_tool_slug text,
  p_period    text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update usage_quotas
  set current_calls = current_calls + 1,
      updated_at = now()
  where user_id  = p_user_id
    and tool_slug = p_tool_slug
    and period    = p_period
    and period_ends_at > now()
  returning current_calls into v_count;

  return coalesce(v_count, 0);
end;
$$;

-- Only service_role can call increment_usage (called from API routes)
revoke execute on function public.increment_usage(uuid, text, text) from authenticated;
grant  execute on function public.increment_usage(uuid, text, text) to service_role;
