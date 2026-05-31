-- ============================================================
-- Migration M1 — add profile jsonb column + extend save_run RPC
-- ============================================================
-- Cole no SQL Editor do Supabase (Read-only OFF) e clique Run.
-- Idempotente: pode rodar mais de uma vez sem efeito colateral.
-- ============================================================

-- 1. Add profile column to runs (idempotent)
alter table runs add column if not exists profile jsonb;

-- 2. Drop old save_run signature (the one without p_profile)
drop function if exists save_run(uuid, int, int, int, int, int, int, int, text, text, text);

-- 3. Create new save_run signature with p_profile jsonb
create or replace function save_run(
  p_token         uuid,
  p_composite     int,
  p_esg           int,
  p_reputation    int,
  p_transparency  int,
  p_risk          int,
  p_influence     int,
  p_accuracy_pct  int,
  p_archetype     text,
  p_tier          text,
  p_lang          text,
  p_profile       jsonb default null
)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_user_id uuid;
  v_run_id  uuid;
begin
  select user_id into v_user_id
  from sessions
  where token = p_token and expires_at > now();

  if v_user_id is null then
    return json_build_object('error', 'invalid_session');
  end if;

  insert into runs (
    user_id, composite, esg, reputation, transparency, risk,
    influence, accuracy_pct, archetype, tier, lang, profile
  ) values (
    v_user_id, p_composite, p_esg, p_reputation, p_transparency, p_risk,
    p_influence, p_accuracy_pct, p_archetype, p_tier, coalesce(p_lang, 'en'), p_profile
  )
  returning id into v_run_id;

  return json_build_object('ok', true, 'run_id', v_run_id);
end $$;

-- 4. Re-grant execute permission for the new signature
revoke all on function save_run(uuid, int, int, int, int, int, int, int, text, text, text, jsonb) from public;
grant execute on function save_run(uuid, int, int, int, int, int, int, int, text, text, text, jsonb) to anon, authenticated;

-- 5. Force PostgREST to refresh schema cache
notify pgrst, 'reload schema';
