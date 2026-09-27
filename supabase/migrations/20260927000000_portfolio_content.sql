create table if not exists public.portfolio_content (
  id text primary key check (id = 'default'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;
revoke all on public.portfolio_content from anon, authenticated;
grant all on public.portfolio_content to service_role;
