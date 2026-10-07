-- TripPilot accounts: run this once in your Supabase project (SQL Editor > New query > Run).
-- Each person can only ever read and change their own profile and trips (row level security).

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null default '' check (char_length(name) <= 60),
  home       text not null default '' check (char_length(home) <= 60),
  budget     integer not null default 1500 check (budget >= 0),
  styles     text[] not null default '{}',
  prefs      jsonb not null default '{}'::jsonb check (pg_column_size(prefs) < 4096),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per trip. The whole trip (stops, stays, experiences, notes) is kept as JSON,
-- the same shape the site already stores in the browser.
create table if not exists public.trips (
  user_id    uuid not null references auth.users (id) on delete cascade,
  id         text not null check (char_length(id) <= 40),
  data       jsonb not null check (pg_column_size(data) < 262144),
  created    bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- Added October 2026 for settings that follow you between devices (currency, appearance).
-- Safe to run again on a project created with an older copy of this file.
alter table public.profiles add column if not exists prefs jsonb not null default '{}'::jsonb;

alter table public.profiles enable row level security;
alter table public.trips    enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "own trips" on public.trips;
create policy "own trips" on public.trips
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
drop trigger if exists trips_touch on public.trips;
create trigger trips_touch before update on public.trips
  for each row execute function public.touch_updated_at();
