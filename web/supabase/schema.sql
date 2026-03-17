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

-- RLS: enabled so anon key has no access. Only service role (API) can read/write.
alter table public.audit_requests enable row level security;
alter table public.purchases enable row level security;
