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
should be hand-edited; re-sync it from the design project instead.

- Tokens: `src/ds/tokens/{colors,typography,spacing,effects,base}.css`
- Type: Archivo (heading/body) + JetBrains Mono (numerals, IDs, measurements)
- Dark theme by default; `data-theme="light"` on `<html>` switches it, and the report
  proof nests a light-themed subtree inside the dark UI.

**Icons.** `ds/core/Icon.jsx` resolves icons from the global `window.lucide.icons`,
converting kebab-case to PascalCase. `src/ds/lucide-global.ts` registers only the ~60
icons this app uses — importing lucide's full set costs ~700 kB. If an icon ever
renders as a dashed placeholder square, add its PascalCase name to that file.

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
