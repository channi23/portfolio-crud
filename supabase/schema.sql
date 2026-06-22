create table if not exists public.projects (
	id uuid primary key,
	title text not null,
	description text not null,
	tech_stack text not null default '',
	github_url text not null default '',
	live_url text not null default '',
	created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Anyone can view projects" on public.projects;
create policy "Anyone can view projects"
on public.projects for select
to anon
using (true);

-- These write policies fit an unauthenticated CRUD demo. Add Supabase Auth and
-- restrict writes to authenticated administrators before using real content.
drop policy if exists "Anyone can create projects" on public.projects;
create policy "Anyone can create projects"
on public.projects for insert
to anon
with check (true);

drop policy if exists "Anyone can update projects" on public.projects;
create policy "Anyone can update projects"
on public.projects for update
to anon
using (true)
with check (true);

drop policy if exists "Anyone can delete projects" on public.projects;
create policy "Anyone can delete projects"
on public.projects for delete
to anon
using (true);
