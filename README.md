# CoreLab

Office and lab web app for a construction-materials testing / geotechnical firm
(**Northline Geotechnical**): dispatch, field testing, boring logs, LIMS, report
review and delivery, timesheets and invoicing.

Live: **https://arashkhajooei.github.io/CoreLab**

Implemented from the Claude Design project `ui_kits/corelab-app/index.html`, ported
from the design's in-browser Babel setup to a Vite build.

## Screens

| Section | Screen | What it does |
|---|---|---|
| Operations | Dashboard | KPIs, today's dispatch, alerts, lab queue, reports awaiting review |
| Operations | Scheduling & dispatch | Technician × day board, unassigned queue, assign/dispatch/unassign |
| Operations | Field tests | Placement + fresh-concrete entry with live spec pass/fail, cylinders cast |
| Operations | Boring logs | Depth-scaled strata column, SPT samples, per-stratum editor |
| Lab | Samples | Sample queue by state; records a break and computes psi from load ÷ area |
| Lab | Review & deliver | Report queue, paper proof, return or approve-and-deliver |
| Finance | Timesheets & invoicing | Time entries, selection totals, invoice drafting |
| Management | Projects | Portfolio list/board, budget burn, project detail |
| Management | Equipment & certifications | Calibration schedule and staff certification expiry |

## Design system

`src/ds/` is the design project's component library, copied verbatim — 23 components
(core, forms, data, navigation, feedback) plus the token CSS. Nothing in `src/ds/`
should be hand-edited; re-sync it from the design project instead. Two deliberate
local additions live alongside it: `lucide-global.ts` (icon registry) and
`icon-motion.css`. The only edit to a copied file is one line in `core/Icon.jsx`,
which stamps `data-icon={name}` on the `<svg>` so motion can target each icon —
re-apply it if you re-sync that file.

- Tokens: `src/ds/tokens/{colors,typography,spacing,effects,base}.css`
- Type: Archivo (heading/body) + JetBrains Mono (numerals, IDs, measurements)
- Dark theme by default; `data-theme="light"` on `<html>` switches it, and the report
  proof nests a light-themed subtree inside the dark UI.

**Icon motion.** `src/ds/icon-motion.css` gives each icon its own gesture — the flask
sways, the wrench turns, the bell rings, `plus` quarter-turns, chevrons nudge — played
on hover of the containing control, so a dense table stays calm at rest. Selecting a
nav section pops its icon once; only danger alerts and the login mark move on their
own. It all keys off `data-icon="<name>"`, uses the `--duration-*`/`--ease-*` tokens,
and is fully disabled under `prefers-reduced-motion: reduce`. To give a new icon a
gesture, add a selector there.

**Icons.** `ds/core/Icon.jsx` resolves icons from the global `window.lucide.icons`,
converting kebab-case to PascalCase. `src/ds/lucide-global.ts` registers only the ~60
icons this app uses — importing lucide's full set costs ~700 kB. If an icon ever
renders as a dashed placeholder square, add its PascalCase name to that file.

## Auth

The whole app sits behind Supabase Auth (email + password). `src/screens/Login.jsx` is
the sign-in screen; `App.jsx` holds the session and renders it until a session exists,
with sign-out in the sidebar footer. There is deliberately **no public sign-up** — this
is an internal tool, so accounts are provisioned by an admin:

```bash
curl -X POST "https://<ref>.supabase.co/auth/v1/admin/users" \
  -H "apikey: $SUPABASE_SECRET_KEY" -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"someone@northline.com","password":"…","email_confirm":true,
       "user_metadata":{"full_name":"Full Name","role":"Lab manager"}}'
```

`user_metadata.full_name` and `role` drive the sidebar footer. The frontend only ever
uses the publishable key; the secret key is for admin calls like the one above.

## Stack

React 19 + Vite + TypeScript. Screens and the design system are `.jsx` (kept as-is
from the design, so `allowJs` is on and they are not type-checked); the entry point is
TypeScript. Routing is the design's own hash routing, plus a `hashchange` listener so
back/forward and pasted deep links work. Deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## Local development

```bash
bun install
bun run dev
```

`bun run build` type-checks and builds; `bun run preview` serves the build at
`/CoreLab/`, the same base path Pages uses.

## Data

The app runs on Supabase. `supabase/migrations/0002_lab_schema.sql` defines nine
tables — `staff`, `projects`, `work_orders`, `samples`, `reports`, `time_entries`,
`invoices`, `equipment`, `certifications` — with RLS restricted to `authenticated`,
so signing out leaves the data unreadable.

`src/data/corelab.js` loads all nine in one pass and shapes them into `D`, which keeps
the field names the screens were written against (the design's `window.CLData`).
`App.jsx` awaits that load before mounting any screen, so each screen's
`useState(D.x)` initialiser sees populated data. Column names that collide with
Postgres keywords are mapped there (`set_label`→`set`, `cast_date`→`cast`,
`start_time`→`start`, `last_cal`→`last`, `next_due`→`next`, `work_date`→`date`).

Dashboard stat tiles, the "Needs attention" panel and the sidebar counts are all
derived from the loaded data rather than hardcoded, so they can't drift from the
tables.

**Writes.** These actions update local state optimistically and persist through
`persist()` in `src/app/shell.jsx`, which surfaces a danger toast if the write fails:
dispatch/unassign a work order, record a sample break, approve or return a report, and
create an invoice (which also flips the billed time entries to `Invoiced`).

**Still fixture-driven:** `FieldTest` and `BoringLog` are single-record detail forms
that the design ships with their own inline data (spec limits, strata, cylinders);
they have no list behind them yet.

Seed a database with realistic volume:

```bash
SUPABASE_URL=… SUPABASE_SECRET_KEY=… bun scripts/seed-lab.mjs
```

Every row upserts on its id, so re-running is safe. Dates are display strings
("Sep 14", "07:30") because the design renders them directly; moving to real
date/time types is a worthwhile follow-up.

An earlier metafields prototype also lives in this project's history —
`supabase/migrations/0001_init.sql` and `scripts/seed.mjs` — and its tables are
unused by this app. The prototype's UI is at commit `8984e98`.
