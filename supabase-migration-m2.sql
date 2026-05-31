-- ============================================================
-- Migration M2 — Live Boardroom (Kahoot-style multiplayer)
-- ============================================================
-- Cole no SQL Editor do Supabase (Read-only OFF) e clique Run.
-- Idempotente: pode rodar mais de uma vez sem efeito colateral.
-- ============================================================

-- ─── 1. TABLES ─────────────────────────────────────────────

create table if not exists rooms (
  id                   uuid primary key default gen_random_uuid(),
  code                 text unique not null check (code ~ '^[A-Z0-9]{6}$'),
  host_user_id         uuid not null references users(id) on delete cascade,
  status               text not null default 'lobby'
                          check (status in ('lobby','playing','intermission','ended','aborted')),
  current_q            int  not null default -1,
  question_set         jsonb not null,
  question_ends_at     timestamptz,
  created_at           timestamptz not null default now(),
  started_at           timestamptz,
  ended_at             timestamptz,
  language             text not null default 'en' check (language in ('en','pt'))
);
create index if not exists idx_rooms_code   on rooms(code);
create index if not exists idx_rooms_status on rooms(status);

create table if not exists room_players (
  room_id       uuid not null references rooms(id) on delete cascade,
  user_id       uuid not null references users(id) on delete cascade,
  display_name  text not null,
  course        text,
  joined_at     timestamptz not null default now(),
  is_host       boolean not null default false,
  profile       jsonb not null default '{"steward":0,"agent":0,"stakeholder":0,"monitor":0,"connector":0}'::jsonb,
  total_answers int  not null default 0,
  primary key (room_id, user_id)
);
create index if not exists idx_room_players_room on room_players(room_id);

create table if not exists room_answers (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references rooms(id) on delete cascade,
  user_id      uuid not null references users(id) on delete cascade,
  question_idx int  not null,
  option_k     text not null check (option_k in ('A','B','C','D','d1','d2','d3','d4')),
  answered_at  timestamptz not null default now(),
  unique (room_id, user_id, question_idx)
);

alter table rooms        enable row level security;
alter table room_players enable row level security;
alter table room_answers enable row level security;
-- (sem policies — acesso só via RPCs security definer)

-- ─── 2. HELPER: room code generator ─────────────────────────

create or replace function _gen_room_code()
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_code  text;
  v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- 32 chars, no 0/O/1/I/L
  i       int;
  attempt int;
begin
  for attempt in 1..6 loop
    v_code := '';
    for i in 1..6 loop
      v_code := v_code || substr(v_chars, 1 + floor(random()*32)::int, 1);
    end loop;
    if not exists (select 1 from rooms where code = v_code) then
      return v_code;
    end if;
  end loop;
  raise exception 'room_code_collision';
end $$;

-- ─── 3. CREATE ROOM ─────────────────────────────────────────

create or replace function create_room(
  p_token        uuid,
  p_lang         text,
  p_question_set jsonb
)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user      users%rowtype;
  v_session   sessions%rowtype;
  v_room_id   uuid;
  v_code      text;
begin
  select s.* into v_session from sessions s where s.token = p_token and s.expires_at > now();
  if not found then return json_build_object('error', 'invalid_session'); end if;
  select * into v_user from users where id = v_session.user_id;

  if p_question_set is null or jsonb_array_length(p_question_set) = 0 then
    return json_build_object('error', 'empty_question_set');
  end if;

  v_code := _gen_room_code();

  insert into rooms (code, host_user_id, question_set, language)
  values (v_code, v_user.id, p_question_set, coalesce(p_lang, 'en'))
  returning id into v_room_id;

  insert into room_players (room_id, user_id, display_name, course, is_host)
  values (v_room_id, v_user.id, v_user.full_name, v_user.course, true);

  return json_build_object(
    'ok', true,
    'room_id', v_room_id,
    'code',    v_code,
    'is_host', true,
    'players', (select coalesce(jsonb_agg(jsonb_build_object(
                  'user_id', rp.user_id, 'display_name', rp.display_name,
                  'course', rp.course, 'is_host', rp.is_host
                ) order by rp.joined_at), '[]'::jsonb)
                from room_players rp where rp.room_id = v_room_id),
    'status', 'lobby',
    'current_q', -1,
    'question_set', p_question_set,
    'language', coalesce(p_lang, 'en')
  );
end $$;

-- ─── 4. JOIN ROOM ───────────────────────────────────────────

create or replace function join_room(
  p_token uuid,
  p_code  text
)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user    users%rowtype;
  v_session sessions%rowtype;
  v_room    rooms%rowtype;
  v_norm    text := upper(trim(p_code));
begin
  select s.* into v_session from sessions s where s.token = p_token and s.expires_at > now();
  if not found then return json_build_object('error', 'invalid_session'); end if;
  select * into v_user from users where id = v_session.user_id;

  select * into v_room from rooms where code = v_norm;
  if not found then return json_build_object('error', 'room_not_found'); end if;

  if v_room.status in ('ended','aborted') then
    return json_build_object('error', 'room_closed');
  end if;

  -- Idempotent: re-join if already in
  insert into room_players (room_id, user_id, display_name, course, is_host)
  values (v_room.id, v_user.id, v_user.full_name, v_user.course, v_user.id = v_room.host_user_id)
  on conflict (room_id, user_id) do nothing;

  return json_build_object(
    'ok', true,
    'room_id', v_room.id,
    'code',    v_room.code,
    'is_host', (v_user.id = v_room.host_user_id),
    'players', (select coalesce(jsonb_agg(jsonb_build_object(
                  'user_id', rp.user_id, 'display_name', rp.display_name,
                  'course', rp.course, 'is_host', rp.is_host,
                  'total_answers', rp.total_answers, 'profile', rp.profile
                ) order by rp.joined_at), '[]'::jsonb)
                from room_players rp where rp.room_id = v_room.id),
    'status', v_room.status,
    'current_q', v_room.current_q,
    'question_set', v_room.question_set,
    'question_ends_at', v_room.question_ends_at,
    'language', v_room.language,
    'my_answers', (select coalesce(jsonb_object_agg(question_idx::text, option_k), '{}'::jsonb)
                    from room_answers where room_id = v_room.id and user_id = v_user.id)
  );
end $$;

-- ─── 5. START ROOM ──────────────────────────────────────────

create or replace function start_room(
  p_token   uuid,
  p_room_id uuid
)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session sessions%rowtype;
  v_room    rooms%rowtype;
  v_dur     int;
begin
  select s.* into v_session from sessions s where s.token = p_token and s.expires_at > now();
  if not found then return json_build_object('error', 'invalid_session'); end if;

  select * into v_room from rooms where id = p_room_id for update;
  if not found then return json_build_object('error', 'room_not_found'); end if;
  if v_room.host_user_id <> v_session.user_id then
    return json_build_object('error', 'not_host');
  end if;
  if v_room.status <> 'lobby' then
    return json_build_object('error', 'already_started');
  end if;

  v_dur := coalesce((v_room.question_set->0->>'duration_s')::int, 25);

  update rooms
    set status = 'playing',
        current_q = 0,
        started_at = now(),
        question_ends_at = now() + (v_dur || ' seconds')::interval
    where id = p_room_id;

  return json_build_object(
    'ok', true,
    'status', 'playing',
    'current_q', 0,
    'question_ends_at', (select question_ends_at from rooms where id = p_room_id)
  );
end $$;

-- ─── 6. SUBMIT ANSWER ───────────────────────────────────────

create or replace function submit_answer(
  p_token        uuid,
  p_room_id      uuid,
  p_question_idx int,
  p_option_k     text,
  p_weights      jsonb
)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session    sessions%rowtype;
  v_room       rooms%rowtype;
  v_answered   int;
  v_total      int;
  v_new_prof   jsonb;
begin
  select s.* into v_session from sessions s where s.token = p_token and s.expires_at > now();
  if not found then return json_build_object('error', 'invalid_session'); end if;

  select * into v_room from rooms where id = p_room_id;
  if not found then return json_build_object('error', 'room_not_found'); end if;
  if v_room.status <> 'playing' then
    return json_build_object('error', 'room_not_playing');
  end if;
  if p_question_idx <> v_room.current_q then
    return json_build_object('error', 'wrong_question');
  end if;
  if v_room.question_ends_at is not null and now() > v_room.question_ends_at + interval '2 seconds' then
    return json_build_object('error', 'time_up');
  end if;

  -- First-answer-wins (ON CONFLICT DO NOTHING). If already answered, treat as ok-no-op.
  insert into room_answers (room_id, user_id, question_idx, option_k)
  values (p_room_id, v_session.user_id, p_question_idx, p_option_k)
  on conflict (room_id, user_id, question_idx) do nothing;

  if found then
    -- Sum the weights into the player's profile and bump total_answers
    update room_players
      set profile = jsonb_build_object(
            'steward',     coalesce((profile->>'steward')::int,0)     + coalesce((p_weights->>'steward')::int,0),
            'agent',       coalesce((profile->>'agent')::int,0)       + coalesce((p_weights->>'agent')::int,0),
            'stakeholder', coalesce((profile->>'stakeholder')::int,0) + coalesce((p_weights->>'stakeholder')::int,0),
            'monitor',     coalesce((profile->>'monitor')::int,0)     + coalesce((p_weights->>'monitor')::int,0),
            'connector',   coalesce((profile->>'connector')::int,0)   + coalesce((p_weights->>'connector')::int,0)
          ),
          total_answers = total_answers + 1
      where room_id = p_room_id and user_id = v_session.user_id;
  end if;

  select count(*) into v_answered from room_answers where room_id = p_room_id and question_idx = p_question_idx;
  select count(*) into v_total    from room_players where room_id = p_room_id;

  return json_build_object('ok', true, 'answered_count', v_answered, 'total_players', v_total);
end $$;

-- ─── 7. ADVANCE QUESTION ────────────────────────────────────

create or replace function advance_question(
  p_token   uuid,
  p_room_id uuid
)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session    sessions%rowtype;
  v_room       rooms%rowtype;
  v_next       int;
  v_total_q    int;
  v_dur        int;
  v_arch_key   text;
  v_top_val    int;
begin
  select s.* into v_session from sessions s where s.token = p_token and s.expires_at > now();
  if not found then return json_build_object('error', 'invalid_session'); end if;

  select * into v_room from rooms where id = p_room_id for update;
  if not found then return json_build_object('error', 'room_not_found'); end if;
  if v_room.host_user_id <> v_session.user_id then
    return json_build_object('error', 'not_host');
  end if;

  v_total_q := jsonb_array_length(v_room.question_set);
  v_next := v_room.current_q + 1;

  if v_next >= v_total_q then
    -- End the game: write a row to runs for each player so they appear in the leaderboard
    update rooms set status = 'ended', ended_at = now() where id = p_room_id;

    insert into runs (
      user_id, composite, esg, reputation, transparency, risk, influence,
      archetype, tier, lang, profile
    )
    select
      rp.user_id,
      -- composite: 50 + 3 * max archetype weight, clamped to [0,100]
      greatest(0, least(100,
        50 + 3 * greatest(
          coalesce((rp.profile->>'steward')::int,0),
          coalesce((rp.profile->>'agent')::int,0),
          coalesce((rp.profile->>'stakeholder')::int,0),
          coalesce((rp.profile->>'monitor')::int,0),
          coalesce((rp.profile->>'connector')::int,0)
        )
      )),
      50, 50, 50, 50,                   -- placeholder per-pillar scores (live mode doesn't track)
      rp.total_answers,
      -- archetype label
      (select case
        when greatest(s,a,st,m,c) <= 0 then 'Balanced Director'
        when greatest(s,a,st,m,c) - (case
              when s = greatest(s,a,st,m,c) then array[a,st,m,c]
              when a = greatest(s,a,st,m,c) then array[s,st,m,c]
              when st = greatest(s,a,st,m,c) then array[s,a,m,c]
              when m = greatest(s,a,st,m,c) then array[s,a,st,c]
              else array[s,a,st,m] end)[1] < 0 then 'Balanced Director'
        when s = greatest(s,a,st,m,c)  then 'Steward'
        when a = greatest(s,a,st,m,c)  then 'Opportunistic Agent'
        when st = greatest(s,a,st,m,c) then 'Stakeholder Champion'
        when m = greatest(s,a,st,m,c)  then 'Independent Monitor'
        when c = greatest(s,a,st,m,c)  then 'Strategic Connector'
        else 'Balanced Director'
      end),
      -- tier from composite
      (case
        when (50 + 3 * greatest(s,a,st,m,c)) >= 88 then 'Distinguished'
        when (50 + 3 * greatest(s,a,st,m,c)) >= 75 then 'Independent'
        when (50 + 3 * greatest(s,a,st,m,c)) >= 60 then 'Qualified'
        when (50 + 3 * greatest(s,a,st,m,c)) >= 45 then 'Provisional'
        else 'Censured'
      end),
      v_room.language,
      rp.profile
    from (
      select rp.*,
             coalesce((rp.profile->>'steward')::int,0)     as s,
             coalesce((rp.profile->>'agent')::int,0)       as a,
             coalesce((rp.profile->>'stakeholder')::int,0) as st,
             coalesce((rp.profile->>'monitor')::int,0)     as m,
             coalesce((rp.profile->>'connector')::int,0)   as c
      from room_players rp where rp.room_id = p_room_id
    ) rp;

    return json_build_object(
      'ok', true,
      'status', 'ended',
      'current_q', v_next,
      'final_ranking', (
        select coalesce(jsonb_agg(row_to_json(x) order by x.magnitude desc), '[]'::jsonb) from (
          select
            rp.user_id, rp.display_name, rp.course, rp.total_answers, rp.profile,
            abs(coalesce((rp.profile->>'steward')::int,0))     +
            abs(coalesce((rp.profile->>'agent')::int,0))       +
            abs(coalesce((rp.profile->>'stakeholder')::int,0)) +
            abs(coalesce((rp.profile->>'monitor')::int,0))     +
            abs(coalesce((rp.profile->>'connector')::int,0))   as magnitude
          from room_players rp where rp.room_id = p_room_id
        ) x
      )
    );
  end if;

  -- Advance to next question
  v_dur := coalesce((v_room.question_set->v_next->>'duration_s')::int, 25);
  update rooms
    set current_q = v_next,
        question_ends_at = now() + (v_dur || ' seconds')::interval,
        status = 'playing'
    where id = p_room_id;

  return json_build_object(
    'ok', true,
    'status', 'playing',
    'current_q', v_next,
    'question_ends_at', (select question_ends_at from rooms where id = p_room_id)
  );
end $$;

-- ─── 8. GET ROOM STATE (catch-up for refresh / reconnect) ──

create or replace function get_room_state(
  p_token uuid,
  p_code  text
)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session sessions%rowtype;
  v_room    rooms%rowtype;
  v_norm    text := upper(trim(p_code));
begin
  select s.* into v_session from sessions s where s.token = p_token and s.expires_at > now();
  if not found then return json_build_object('error', 'invalid_session'); end if;

  select * into v_room from rooms where code = v_norm;
  if not found then return json_build_object('error', 'room_not_found'); end if;

  return json_build_object(
    'ok', true,
    'room_id', v_room.id,
    'code',    v_room.code,
    'is_host', (v_session.user_id = v_room.host_user_id),
    'players', (select coalesce(jsonb_agg(jsonb_build_object(
                  'user_id', rp.user_id, 'display_name', rp.display_name,
                  'course', rp.course, 'is_host', rp.is_host,
                  'total_answers', rp.total_answers, 'profile', rp.profile
                ) order by rp.joined_at), '[]'::jsonb)
                from room_players rp where rp.room_id = v_room.id),
    'status', v_room.status,
    'current_q', v_room.current_q,
    'question_set', v_room.question_set,
    'question_ends_at', v_room.question_ends_at,
    'language', v_room.language,
    'my_answers', (select coalesce(jsonb_object_agg(question_idx::text, option_k), '{}'::jsonb)
                    from room_answers where room_id = v_room.id and user_id = v_session.user_id)
  );
end $$;

-- ─── 9. END ROOM (host abort) ───────────────────────────────

create or replace function end_room(
  p_token   uuid,
  p_room_id uuid
)
returns json
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session sessions%rowtype;
  v_room    rooms%rowtype;
begin
  select s.* into v_session from sessions s where s.token = p_token and s.expires_at > now();
  if not found then return json_build_object('error', 'invalid_session'); end if;

  select * into v_room from rooms where id = p_room_id;
  if not found then return json_build_object('error', 'room_not_found'); end if;
  if v_room.host_user_id <> v_session.user_id then
    return json_build_object('error', 'not_host');
  end if;

  update rooms set status = 'aborted', ended_at = now() where id = p_room_id;
  return json_build_object('ok', true);
end $$;

-- ─── 10. PERMISSIONS ────────────────────────────────────────

revoke all on function _gen_room_code()                                   from public;
revoke all on function create_room(uuid, text, jsonb)                     from public;
revoke all on function join_room(uuid, text)                              from public;
revoke all on function start_room(uuid, uuid)                             from public;
revoke all on function submit_answer(uuid, uuid, int, text, jsonb)        from public;
revoke all on function advance_question(uuid, uuid)                       from public;
revoke all on function get_room_state(uuid, text)                         from public;
revoke all on function end_room(uuid, uuid)                               from public;

grant execute on function create_room(uuid, text, jsonb)                  to anon, authenticated;
grant execute on function join_room(uuid, text)                           to anon, authenticated;
grant execute on function start_room(uuid, uuid)                          to anon, authenticated;
grant execute on function submit_answer(uuid, uuid, int, text, jsonb)     to anon, authenticated;
grant execute on function advance_question(uuid, uuid)                    to anon, authenticated;
grant execute on function get_room_state(uuid, text)                      to anon, authenticated;
grant execute on function end_room(uuid, uuid)                            to anon, authenticated;
-- _gen_room_code is internal and not exposed to clients

-- ─── 11. Refresh PostgREST schema cache ────────────────────

notify pgrst, 'reload schema';
