-- CoreLab — Metafields system (Shopify-style) for internal company data.
-- Idempotent: safe to run multiple times.
--
-- Model:
--   owner_types            the kinds of records you can attach metafields to (Employee, Product, ...)
--   records                individual instances of an owner_type
--   metafield_definitions  the schema: namespace + key + type + validation, scoped to an owner_type
--   metafield_values       an actual value for (definition, record)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- owner_types
-- ---------------------------------------------------------------------------
create table if not exists public.owner_types (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,          -- machine key, e.g. "employee"
  label       text not null,                 -- display, e.g. "Employee"
  icon        text not null default 'box',   -- lucide icon name
  description text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- records (instances)
-- ---------------------------------------------------------------------------
create table if not exists public.records (
  id            uuid primary key default gen_random_uuid(),
  owner_type_id uuid not null references public.owner_types(id) on delete cascade,
  title         text not null,               -- human label for the instance
  external_ref  text,                        -- optional link to a source system id
  created_at    timestamptz not null default now()
);
create index if not exists records_owner_type_idx on public.records(owner_type_id);

-- ---------------------------------------------------------------------------
-- metafield_definitions
-- ---------------------------------------------------------------------------
-- type is one of the CoreLab field types (see src/lib/fieldTypes.ts):
--   single_line_text, multi_line_text, integer, decimal, boolean, date,
--   date_time, url, json, color, rating, money, reference
-- is_list = true means the value holds a list of that type.
create table if not exists public.metafield_definitions (
  id            uuid primary key default gen_random_uuid(),
  owner_type_id uuid not null references public.owner_types(id) on delete cascade,
  namespace     text not null default 'custom',
  key           text not null,
  name          text not null,
  description   text,
  type          text not null,
  is_list       boolean not null default false,
  required      boolean not null default false,
  validation    jsonb not null default '{}'::jsonb,  -- {min,max,minLength,maxLength,options,regex,...}
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (owner_type_id, namespace, key)
);
create index if not exists mdef_owner_idx on public.metafield_definitions(owner_type_id);

-- ---------------------------------------------------------------------------
-- metafield_values
-- ---------------------------------------------------------------------------
-- value is stored as jsonb so every type (scalar, list, money object) fits one column.
create table if not exists public.metafield_values (
  id            uuid primary key default gen_random_uuid(),
  definition_id uuid not null references public.metafield_definitions(id) on delete cascade,
  record_id     uuid not null references public.records(id) on delete cascade,
  value         jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (definition_id, record_id)
);
create index if not exists mval_record_idx on public.metafield_values(record_id);
create index if not exists mval_def_idx on public.metafield_values(definition_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists mdef_touch on public.metafield_definitions;
create trigger mdef_touch before update on public.metafield_definitions
  for each row execute function public.touch_updated_at();

drop trigger if exists mval_touch on public.metafield_values;
create trigger mval_touch before update on public.metafield_values
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- MVP: this is an INTERNAL tool. RLS is ON, and the anon role (the publishable
-- key used by the frontend) is granted full CRUD so the app works with no login.
-- SECURITY NOTE: with these policies anyone who has the site URL + publishable
-- key can read and write. Before putting real data behind a public URL, switch
-- the policy target from `anon` to `authenticated` and add Supabase Auth.
alter table public.owner_types            enable row level security;
alter table public.records                enable row level security;
alter table public.metafield_definitions  enable row level security;
alter table public.metafield_values       enable row level security;

do $$
declare t text;
begin
  foreach t in array array['owner_types','records','metafield_definitions','metafield_values']
  loop
    execute format('drop policy if exists %I on public.%I', t||'_anon_all', t);
    execute format(
      'create policy %I on public.%I for all to anon using (true) with check (true)',
      t||'_anon_all', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Seed owner types (only if empty)
-- ---------------------------------------------------------------------------
insert into public.owner_types (key, label, icon, description)
select * from (values
  ('employee', 'Employee', 'user',        'People on the team'),
  ('product',  'Product',  'package',     'Items in the catalog'),
  ('order',    'Order',    'shopping-cart','Customer orders'),
  ('project',  'Project',  'folder-kanban','Internal initiatives')
) as v(key,label,icon,description)
where not exists (select 1 from public.owner_types);
