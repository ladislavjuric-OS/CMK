-- Run this in Supabase Dashboard → SQL Editor (New query) → Run

-- Audit intake requests (from our intake form; later: Tally webhook or manual Notion)
create table if not exists public.audit_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  payload jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'processing', 'review_ready', 'sent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists audit_requests_created_at on public.audit_requests (created_at desc);
create index if not exists audit_requests_status on public.audit_requests (status);

-- Optional: purchases (for later Payhip/Systeme.io webhook)
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product_id text,
  product_name text,
  amount_cents integer,
  external_id text unique,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists purchases_email on public.purchases (email);
create index if not exists purchases_created_at on public.purchases (created_at desc);

-- Readiness results (free tool output; later unlocks upsell/audit modules)
create table if not exists public.readiness_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete cascade,
  email text not null,
  score integer not null check (score >= 0 and score <= 100),
  verdict text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists readiness_results_user_id on public.readiness_results (user_id);
create index if not exists readiness_results_email on public.readiness_results (email);
create index if not exists readiness_results_created_at on public.readiness_results (created_at desc);

-- User profile (for admin flagging)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Entitlements (what the user unlocked: blueprint/audit/etc.)
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  product_key text not null, -- e.g. 'blueprint', 'audit', 'ladislav'
  status text not null default 'locked' check (status in ('locked', 'unlocked', 'manual_unlocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists entitlements_user_id on public.entitlements (user_id);
create index if not exists entitlements_product on public.entitlements (product_key);
create unique index if not exists entitlements_user_product_unique on public.entitlements (user_id, product_key);

-- One-time magic tokens for "View your history" link in Resend email (no Supabase email sent).
create table if not exists public.magic_tokens (
  id uuid primary key default gen_random_uuid(),
  token uuid not null unique default gen_random_uuid(),
  email text not null,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now()
);

create index if not exists magic_tokens_token on public.magic_tokens (token);
create index if not exists magic_tokens_expires_at on public.magic_tokens (expires_at);

-- RLS: no direct client access; only server (service role) uses this table.
alter table public.magic_tokens enable row level security;
-- No policies: anon/authenticated cannot read/write; server uses service role.

-- RLS: enabled so anon key has no access. Policies below allow authenticated users to read their own rows.
alter table public.audit_requests enable row level security;
alter table public.purchases enable row level security;
alter table public.readiness_results enable row level security;
alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;

-- Authenticated users can read their readiness results.
create policy "read_own_readiness_results"
  on public.readiness_results
  for select
  using (user_id = auth.uid());

-- Users can read their profile.
create policy "read_own_profile"
  on public.profiles
  for select
  using (user_id = auth.uid());

-- Users can read their entitlements.
create policy "read_own_entitlements"
  on public.entitlements
  for select
  using (user_id = auth.uid());
