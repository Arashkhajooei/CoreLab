-- CoreLab — lab operations schema (the nine screens).
-- Idempotent: safe to run more than once.
--
-- Date-ish columns are TEXT on purpose: the design renders display strings
-- ("Sep 14", "Mar 02, 2027", "07:30") straight into the UI. Converting them to
-- real date/time types is a worthwhile follow-up but would change the rendering.
-- Some field names are Postgres keywords, so they are suffixed here and mapped
-- back to the design's names in src/data/corelab.js:
--   set_label->set  cast_date->cast  start_time->start
--   last_cal->last  next_due->next   work_date->date

create table if not exists public.staff (
  id          text primary key,          -- t1, t2, ...
  name        text not null,
  role        text not null,
  certs       text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id        text primary key,            -- 24-0187
  name      text not null,
  client    text not null,
  pm        text not null,
  phase     text not null,
  budget    numeric not null default 0,
  used      numeric not null default 0,  -- 0..1 burn fraction
  open_wo   integer not null default 0,
  status    text not null
);

create table if not exists public.work_orders (
  id          text primary key,          -- WO-3182
  project_id  text not null references public.projects(id) on delete cascade,
  test        text not null,
  tech_id     text references public.staff(id) on delete set null,
  day         integer not null default 0,-- 0..4 = Mon..Fri of the shown week
  start_time  text,
  hours       numeric not null default 0,
  status      text not null
);
create index if not exists wo_project_idx on public.work_orders(project_id);
create index if not exists wo_tech_idx on public.work_orders(tech_id);

create table if not exists public.samples (
  id          text primary key,          -- S-0412
  project_id  text not null references public.projects(id) on delete cascade,
  material    text not null,
  test        text not null,
  set_label   text,
  cast_date   text,
  due         text,
  age         integer not null default 0,
  tech_id     text references public.staff(id) on delete set null,
  status      text not null,
  result      jsonb                      -- { strength, pass } or null
);
create index if not exists samples_project_idx on public.samples(project_id);

create table if not exists public.reports (
  id          text primary key,          -- 24-0187-R04
  project_id  text not null references public.projects(id) on delete cascade,
  title       text not null,
  type        text not null,             -- Lab | Field | Geotech
  author_id   text references public.staff(id) on delete set null,
  submitted   text,
  status      text not null,             -- Pending review | Approved | Delivered | Rejected
  pages       integer not null default 1
);
create index if not exists reports_project_idx on public.reports(project_id);

create table if not exists public.time_entries (
  id          text primary key,          -- TE-9021
  tech_id     text references public.staff(id) on delete set null,
  work_date   text,
  project_id  text not null references public.projects(id) on delete cascade,
  task        text not null,
  hours       numeric not null default 0,
  rate        numeric not null default 0,
  status      text not null              -- Unbilled | Approved | Invoiced
);
create index if not exists te_project_idx on public.time_entries(project_id);

create table if not exists public.invoices (
  id          text primary key,          -- INV-2044
  project_id  text not null references public.projects(id) on delete cascade,
  client      text not null,
  issued      text,
  due         text,
  amount      numeric not null default 0,
  status      text not null              -- Draft | Sent | Paid | Overdue | Void
);

create table if not exists public.equipment (
  id        text primary key,            -- CM-02
  type      text not null,
  model     text not null,
  serial    text,
  last_cal  text,
  next_due  text,
  status    text not null                -- Current | Due in N days | Overdue
);

create table if not exists public.certifications (
  id       text primary key,             -- c1
  tech_id  text not null references public.staff(id) on delete cascade,
  cert     text not null,
  issuer   text not null,
  expires  text,
  status   text not null                 -- Current | Expiring soon | Expired
);
create index if not exists certs_tech_idx on public.certifications(tech_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — signed-in staff only.
-- The app is behind Supabase Auth, so `authenticated` (not `anon`) gets access.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'staff','projects','work_orders','samples','reports',
    'time_entries','invoices','equipment','certifications'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t||'_auth_all', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      t||'_auth_all', t);
  end loop;
end $$;
