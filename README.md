# CoreLab

A Shopify-style **metafields** system for internal company data. Define custom
fields (with types, namespaces and validation) for any resource, then attach
values to individual records.

Live: **https://arashkhajooei.github.io/CoreLab**

## What it does

- **Definitions** — the schema. Each definition has a namespace, key, name,
  type, validation rules, and the resource it applies to. Referenced as
  `namespace.key` (e.g. `custom.warranty_months`).
- **Field types** — single-line text (with choices), multi-line text, integer,
  decimal, money, rating, boolean, date, date-time, URL, color, JSON and
  references. Every type can be a single value or a **list**.
- **Records** — instances of a resource (Employee, Product, Order, Project — or
  your own), each with type-aware editors for its metafield values.
- **Validation** — min/max, length, choices, regex, currency, required, and more,
  enforced in the editor.

## Stack

- React 19 + Vite + TypeScript + Tailwind
- Supabase (Postgres) via `@supabase/supabase-js`, using the **publishable** key
- Static SPA deployed to GitHub Pages via GitHub Actions

## Database

The schema lives in [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
Run it once in the Supabase SQL editor for your project. Tables:

| table | purpose |
|-------|---------|
| `owner_types` | the kinds of resources you attach fields to |
| `records` | individual instances of an owner type |
| `metafield_definitions` | the custom-field schema |
| `metafield_values` | a value for a (definition, record) pair |

## Local development

```bash
bun install
cp .env.example .env.local   # fill in your Supabase URL + publishable key
bun run dev
```

## Configuration

The frontend needs two env vars (safe to expose — protected by RLS):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

For the GitHub Pages build they are read from repo **secrets** of the same name.
The **secret/service key is never used in the frontend.**

## Security note (MVP)

RLS is enabled, and the `anon` role has full CRUD so the app works with no login.
That means anyone with the site URL can read and write. Before storing real data,
switch the RLS policies in the migration from `anon` to `authenticated` and add
Supabase Auth.
