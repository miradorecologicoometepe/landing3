-- Run in Supabase SQL Editor after reviewing. Do not expose service_role credentials.
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.rooms (
  id text primary key,
  details jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.transport_schedules (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('bus', 'ferry', 'vehicle')),
  details jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  image_path text not null,
  details jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.site_content enable row level security;
alter table public.rooms enable row level security;
alter table public.transport_schedules enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.admin_users enable row level security;

-- Public read only. No anonymous insert/update/delete permissions.
create policy "Public site content read" on public.site_content for select to anon, authenticated using (true);
create policy "Public rooms read" on public.rooms for select to anon, authenticated using (true);
create policy "Public schedules read" on public.transport_schedules for select to anon, authenticated using (true);
create policy "Public gallery read" on public.gallery_photos for select to anon, authenticated using (true);
create policy "Admin self lookup" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));

create policy "Admin manages site content" on public.site_content for all to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin manages rooms" on public.rooms for all to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin manages schedules" on public.transport_schedules for all to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin manages gallery" on public.gallery_photos for all to authenticated using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Provision admin_users via the Supabase SQL editor after creating an Auth user.
-- Do not create public policies allowing visitors to add themselves as admins.
