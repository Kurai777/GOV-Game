-- ============================================================
-- Governance Challenge — Supabase schema
-- ============================================================
-- HOW TO USE:
--   1. Create a free project at https://supabase.com (region: any)
--   2. Open the SQL Editor in the left sidebar
--   3. Paste this entire file and click "Run"
--   4. Go to Settings → API
--      • Copy "Project URL"          → paste into config.js as SUPABASE_URL
--      • Copy "anon / public" key    → paste into config.js as SUPABASE_ANON_KEY
--   5. Reload the game. Done.
--
-- DESIGN NOTES:
--   • Tables (users, sessions, runs) are NOT directly accessible to the
--     browser. RLS is on but no policies are defined for anon/authenticated,
--     so all writes/reads go through SECURITY DEFINER functions below.
--   • Passwords are hashed with bcrypt (pgcrypto extension) inside Postgres.
--     The plaintext password reaches the DB once over HTTPS, is hashed, and
--     never returns. The hash is never exposed via any RPC.
--   • Session tokens are random UUIDs returned at register/login. The browser
--     stores the token in localStorage and presents it to save_run().
--   • Leaderboard returns only public-safe columns — no hashes, no emails.
-- ============================================================

-- pgcrypto is enabled by default on Supabase; uncomment only if you're on a
-- self-hosted Postgres without it. Requires a writable, superuser-capable
-- connection (will fail in the SQL Editor's "Read only" mode).
-- create extension if not exists pgcrypto;

-- ─── TABLES ─────────────────────────────────────────────────

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  username      text unique not null
                  check (username = lower(username)
                         and length(username) between 3 and 32
                         and username ~ '^[a-z0-9_.-]+$'),
  password_hash text not null,
  full_name     text not null check (length(full_name) between 2 and 120),
  course        text not null check (length(course)    between 2 and 80),
  created_at    timestamptz not null default now()
);

create table if not exists sessions (
  token       uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default (now() + interval '30 days')
);

create table if not exists runs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  composite     int  not null check (composite     between 0 and 100),
  esg           int  not null check (esg           between 0 and 100),
  reputation    int  not null check (reputation    between 0 and 100),
  transparency  int  not null check (transparency  between 0 and 100),
  risk          int  not null check (risk          between 0 and 100),
  influence     int  not null check (influence >= 0),
  accuracy_pct  int           check (accuracy_pct  between 0 and 100),
  archetype     text,
  tier          text,
  lang          text not null default 'en' check (lang in ('en','pt')),
  profile       jsonb,                            -- archetype weight vector { steward, agent, stakeholder, monitor, connector }
  played_at     timestamptz not null default now()
);

-- Idempotent migration for existing installations (added in M1)
alter table runs add column if not exists profile jsonb;

create index if not exists idx_runs_user_score on runs(user_id, composite desc);
create index if not exists idx_sessions_user   on sessions(user_id);
create index if not exists idx_sessions_expiry on sessions(expires_at);

-- ─── RLS — lock tables; access only via RPCs ───────────────

alter table users    enable row level security;
alter table sessions enable row level security;
alter table runs     enable row level security;
-- (no policies = no direct access for anon/authenticated)

-- ─── REGISTER ───────────────────────────────────────────────

create or replace function register_user(
  p_username  text,
  p_password  text,
  p_full_name text,
  p_course    text
)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_user_id uuid;
  v_token   uuid;
  v_uname   text := lower(trim(p_username));
begin
  if length(coalesce(p_password,'')) < 4 then
    return json_build_object('error', 'password_too_short');
  end if;
  if v_uname !~ '^[a-z0-9_.-]{3,32}$' then
    return json_build_object('error', 'invalid_username');
  end if;
  if length(coalesce(p_full_name,'')) < 2 then
    return json_build_object('error', 'invalid_full_name');
  end if;
  if length(coalesce(p_course,'')) < 2 then
    return json_build_object('error', 'invalid_course');
  end if;
  if exists (select 1 from users where username = v_uname) then
    return json_build_object('error', 'username_taken');
  end if;

  insert into users (username, password_hash, full_name, course)
  values (v_uname, extensions.crypt(p_password, extensions.gen_salt('bf', 10)), trim(p_full_name), trim(p_course))
  returning id into v_user_id;

  insert into sessions (user_id) values (v_user_id) returning token into v_token;

  return json_build_object(
    'token', v_token,
    'user',  json_build_object(
      'id',        v_user_id,
      'username',  v_uname,
      'full_name', trim(p_full_name),
      'course',    trim(p_course)
    )
  );
end $$;

-- ─── LOGIN ──────────────────────────────────────────────────

create or replace function login_user(
  p_username text,
  p_password text
)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_user  users%rowtype;
  v_token uuid;
  v_uname text := lower(trim(p_username));
begin
  select * into v_user from users where username = v_uname;
  if not found or v_user.password_hash <> extensions.crypt(p_password, v_user.password_hash) then
    -- intentionally generic message — don't leak whether the username exists
    return json_build_object('error', 'invalid_credentials');
  end if;

  insert into sessions (user_id) values (v_user.id) returning token into v_token;

  return json_build_object(
    'token', v_token,
    'user',  json_build_object(
      'id',        v_user.id,
      'username',  v_user.username,
      'full_name', v_user.full_name,
      'course',    v_user.course
    )
  );
end $$;

-- ─── SAVE RUN ───────────────────────────────────────────────

-- Drop the previous overload (without p_profile) so PostgREST has a single
-- save_run signature to resolve. Safe to run multiple times.
drop function if exists save_run(uuid, int, int, int, int, int, int, int, text, text, text);

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

-- ─── LEADERBOARD ────────────────────────────────────────────
-- Returns one row per player with their *best* composite score.

create or replace function leaderboard(p_limit int default 100)
returns table (
  rank        bigint,
  username    text,
  full_name   text,
  course      text,
  best_score  int,
  runs_count  bigint,
  last_played timestamptz
)
language sql
security definer
stable
set search_path = public, extensions, pg_temp
as $$
  with agg as (
    select
      u.username,
      u.full_name,
      u.course,
      max(r.composite)  as best_score,
      count(r.id)       as runs_count,
      max(r.played_at)  as last_played
    from users u
    join runs  r on r.user_id = u.id
    group by u.id, u.username, u.full_name, u.course
  )
  select
    row_number() over (order by best_score desc, last_played asc) as rank,
    username, full_name, course, best_score, runs_count, last_played
  from agg
  order by rank
  limit greatest(1, least(p_limit, 500));
$$;

-- ─── PROFILE / MY RUNS ──────────────────────────────────────

create or replace function my_runs(p_token uuid, p_limit int default 20)
returns table (
  composite int, esg int, reputation int, transparency int,
  risk int, influence int, accuracy_pct int,
  archetype text, tier text, lang text, played_at timestamptz
)
language sql
security definer
stable
set search_path = public, extensions, pg_temp
as $$
  select r.composite, r.esg, r.reputation, r.transparency, r.risk,
         r.influence, r.accuracy_pct, r.archetype, r.tier, r.lang, r.played_at
  from runs r
  join sessions s on s.user_id = r.user_id
  where s.token = p_token and s.expires_at > now()
  order by r.played_at desc
  limit greatest(1, least(p_limit, 100));
$$;

-- ─── LOGOUT ─────────────────────────────────────────────────

create or replace function logout(p_token uuid)
returns json
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
begin
  delete from sessions where token = p_token;
  return json_build_object('ok', true);
end $$;

-- ─── PERMISSIONS ────────────────────────────────────────────
-- Allow the public anon role (used by the browser SDK) to call only the
-- whitelisted RPCs. Direct table access stays denied via RLS.

revoke all on function register_user(text, text, text, text)                                                from public;
revoke all on function login_user(text, text)                                                               from public;
revoke all on function save_run(uuid, int, int, int, int, int, int, int, text, text, text, jsonb)           from public;
revoke all on function leaderboard(int)                                                                     from public;
revoke all on function my_runs(uuid, int)                                                                   from public;
revoke all on function logout(uuid)                                                                         from public;

grant execute on function register_user(text, text, text, text)                                             to anon, authenticated;
grant execute on function login_user(text, text)                                                            to anon, authenticated;
grant execute on function save_run(uuid, int, int, int, int, int, int, int, text, text, text, jsonb)        to anon, authenticated;
grant execute on function leaderboard(int)                                                                  to anon, authenticated;
grant execute on function my_runs(uuid, int)                                                                to anon, authenticated;
grant execute on function logout(uuid)                                                                      to anon, authenticated;

-- ─── HOUSEKEEPING (optional) ────────────────────────────────
-- Run periodically to purge expired sessions. Hook this into Supabase's
-- scheduled functions / cron if desired, or call manually.

create or replace function cleanup_expired_sessions() returns void
language sql security definer
set search_path = public, extensions, pg_temp
as $$
  delete from sessions where expires_at < now();
$$;
