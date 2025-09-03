-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  color text not null default '#6b7280',
  position double precision not null default 0,
  created_at timestamptz not null default now()
);

-- Lanes per project
create table if not exists public.lanes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  color text not null default '#e5e7eb',
  position double precision not null default 0,
  created_at timestamptz not null default now()
);

-- Extend notes with project / lane / position
alter table if exists public.notes
  add column if not exists project_id uuid references public.projects(id) on delete set null,
  add column if not exists lane_id uuid references public.lanes(id) on delete set null,
  add column if not exists position double precision default 0;

