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

Screens read `src/data/corelab.js` — the design's fixture data — and mutate local
React state, so dispatching a work order or recording a break updates the UI but does
not persist. Wiring this to a real backend is the next step.

A Supabase project is already provisioned for this repo (`supabase/migrations/`,
seeded by `scripts/seed.mjs`) from an earlier metafields prototype. Those tables model
custom field definitions, not lab operations, so they are unused by this app; the
prototype's UI is in git history at commit `8984e98`.
