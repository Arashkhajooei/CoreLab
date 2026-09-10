// Seed the CoreLab lab-operations tables with a realistic amount of demo data —
// enough that every tab, filter and status chip in the app has content.
//
// Usage: SUPABASE_URL=... SUPABASE_SECRET_KEY=... bun scripts/seed-lab.mjs
// The secret key bypasses RLS for the write; it is read from the environment and
// never stored in the repo. Re-running is safe: every row upserts on its id.
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY')
  process.exit(1)
}
const db = createClient(url, key, { auth: { persistSession: false } })

// Deterministic PRNG so re-seeding produces the same data.
let _s = 20260914
const rnd = () => {
  _s |= 0; _s = (_s + 0x6d2b79f5) | 0
  let t = Math.imul(_s ^ (_s >>> 15), 1 | _s)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const pick = (a) => a[Math.floor(rnd() * a.length)]
const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1))
const pad = (n, w = 4) => String(n).padStart(w, '0')

async function put(table, rows) {
  const { error } = await db.from(table).upsert(rows, { onConflict: 'id' })
  if (error) {
    console.error(`${table}:`, error.message)
    process.exit(1)
  }
  console.log(`${table}: ${rows.length}`)
}

// ---------------------------------------------------------------- staff
const staff = [
  { id: 't1', name: 'Tom Okafor', role: 'Field technician II', certs: ['ACI I', 'Nuclear gauge'] },
  { id: 't2', name: 'Priya Natarajan', role: 'Field technician III', certs: ['ACI I', 'ACI II', 'NICET II'] },
  { id: 't3', name: 'Luis Herrera', role: 'Field technician I', certs: ['ACI I'] },
  { id: 't4', name: 'Grace Lindqvist', role: 'Senior inspector', certs: ['ICC Soils', 'ICC Reinforced Concrete'] },
  { id: 't5', name: 'Sam Whitaker', role: 'Lab technician', certs: ['ACI Lab I'] },
  { id: 't6', name: 'Nadia Osei', role: 'Field technician II', certs: ['ACI I', 'Nuclear gauge'] },
  { id: 't7', name: 'Ben Tanaka', role: 'Lab technician II', certs: ['ACI Lab I', 'ACI Lab II'] },
  { id: 't8', name: 'Rosa Delgado', role: 'Field technician III', certs: ['ACI I', 'ICC Soils'] },
]
const fieldTechs = ['t1', 't2', 't3', 't4', 't6', 't8']
const labTechs = ['t5', 't7']

// ---------------------------------------------------------------- projects
const projects = [
  { id: '24-0187', name: 'Riverside Interchange', client: 'Meridian DOT', pm: 'Marcus Lee', phase: 'Construction', budget: 412000, used: 0.62, status: 'Active' },
  { id: '24-0203', name: 'Northgate Warehouse', client: 'Halden Logistics', pm: 'Dana Whitfield', phase: 'Construction', budget: 98000, used: 0.81, status: 'Active' },
  { id: '24-0166', name: 'Cedar Ridge Phase 2', client: 'Cedar Ridge Partners', pm: 'Marcus Lee', phase: 'Earthwork', budget: 156000, used: 0.34, status: 'Active' },
  { id: '24-0221', name: 'Lakeview Elementary', client: 'Unified School District 4', pm: 'Aisha Rahman', phase: 'Geotechnical investigation', budget: 64000, used: 0.12, status: 'Active' },
  { id: '24-0231', name: 'Mill Creek Bridge', client: 'Meridian DOT', pm: 'Marcus Lee', phase: 'Construction', budget: 288000, used: 0.21, status: 'Active' },
  { id: '24-0240', name: 'Sable Ridge Substation', client: 'Corvus Energy', pm: 'Aisha Rahman', phase: 'Earthwork', budget: 134000, used: 0.08, status: 'Active' },
  { id: '24-0119', name: 'Fairmont Transit Center', client: 'City of Fairmont', pm: 'Dana Whitfield', phase: 'Construction', budget: 505000, used: 0.74, status: 'Active' },
  { id: '24-0252', name: 'Halden Cold Storage', client: 'Halden Logistics', pm: 'Priya Natarajan', phase: 'Geotechnical investigation', budget: 78000, used: 0.05, status: 'Active' },
  { id: '23-0942', name: 'Harbor Street Parking', client: 'City of Fairmont', pm: 'Aisha Rahman', phase: 'Closeout', budget: 71000, used: 0.97, status: 'Closeout' },
  { id: '23-0898', name: 'Oakhurst Apartments', client: 'Oakhurst Development', pm: 'Marcus Lee', phase: 'Closeout', budget: 92000, used: 0.93, status: 'Closeout' },
  { id: '24-0148', name: 'Pinecrest Water Tower', client: 'Pinecrest Utilities', pm: 'Dana Whitfield', phase: 'On hold', budget: 120000, used: 0.45, status: 'On hold' },
]
const activeIds = projects.filter((p) => p.status === 'Active').map((p) => p.id)

// ---------------------------------------------------------------- work orders
const scopes = [
  'Concrete placement — C31/C143/C231', 'Soil compaction — D6938', 'Proctor sampling — D1557',
  'Asphalt density — D2950', 'Rebar inspection', 'Floor flatness — E1155', 'Masonry prism sampling',
  'Post-tension inspection', 'Boring log — B-07', 'Boring log — B-08', 'Subgrade proofroll',
  'Pier drilling observation', 'Mortar sampling — C780', 'Fireproofing thickness',
]
const starts = ['06:30', '07:00', '07:30', '08:00', '09:00', '10:00', '13:00']
const workOrders = []
let woN = 3182
// Monday (day 0) — what the dashboard shows.
const mondaySeed = [
  { tech: 't1', status: 'In progress', scope: 'Concrete placement — C31/C143/C231', project: '24-0187', start: '07:30', hours: 4 },
  { tech: 't2', status: 'Dispatched', scope: 'Soil compaction — D6938', project: '24-0203', start: '08:00', hours: 3 },
  { tech: 't3', status: 'Dispatched', scope: 'Proctor sampling — D1557', project: '24-0166', start: '09:00', hours: 2 },
  { tech: 't4', status: 'In progress', scope: 'Boring log — B-07', project: '24-0221', start: '07:00', hours: 8 },
  { tech: 't6', status: 'Complete', scope: 'Rebar inspection', project: '24-0119', start: '06:30', hours: 3 },
  { tech: 't8', status: 'In progress', scope: 'Subgrade proofroll', project: '24-0240', start: '08:00', hours: 5 },
]
for (const m of mondaySeed) {
  workOrders.push({ id: `WO-${woN++}`, project_id: m.project, test: m.scope, tech_id: m.tech, day: 0, start_time: m.start, hours: m.hours, status: m.status })
}
// Tue–Fri, assigned.
for (let day = 1; day <= 4; day++) {
  for (const tech of fieldTechs) {
    const n = int(0, 2)
    for (let k = 0; k < n; k++) {
      workOrders.push({
        id: `WO-${woN++}`, project_id: pick(activeIds), test: pick(scopes), tech_id: tech,
        day, start_time: pick(starts), hours: pick([2, 3, 4, 5, 6, 8]), status: 'Scheduled',
      })
    }
  }
}
// Unassigned queue — drives the dispatch board's left column.
for (let i = 0; i < 7; i++) {
  workOrders.push({
    id: `WO-${woN++}`, project_id: pick(activeIds), test: pick(scopes), tech_id: null,
    day: int(0, 4), start_time: pick(starts), hours: pick([2, 3, 4, 6]), status: 'Unassigned',
  })
}
for (const p of projects) {
  p.open_wo = workOrders.filter((w) => w.project_id === p.id && w.status !== 'Complete').length
}

// ---------------------------------------------------------------- samples
const materials = [
  { m: 'Concrete cylinder', tests: ['ASTM C39'], spec: 4000 },
  { m: 'Grout cube', tests: ['ASTM C1019'], spec: 2000 },
  { m: 'Masonry prism', tests: ['ASTM C140'], spec: 2500 },
  { m: 'Soil — bulk', tests: ['ASTM D1557', 'AASHTO T99'], spec: null },
  { m: 'Soil — SPT', tests: ['ASTM D2216', 'ASTM D4318'], spec: null },
  { m: 'Asphalt core', tests: ['ASTM D2950'], spec: null },
]
const castDays = ['Aug 10', 'Aug 12', 'Aug 17', 'Aug 24', 'Sep 02', 'Sep 08', 'Sep 09', 'Sep 11', 'Sep 12']
const dueDays = ['Sep 07', 'Sep 09', 'Sep 14', 'Sep 15', 'Sep 16', 'Sep 18', 'Sep 21', 'Oct 12']
const samples = []
let sN = 388
const sampleStatuses = [
  ...Array(8).fill('Due today'), ...Array(6).fill('In test'), ...Array(9).fill('Received'),
  ...Array(18).fill('Tested'), ...Array(4).fill('Curing'),
]
for (const status of sampleStatuses) {
  const mat = pick(materials)
  const tested = status === 'Tested'
  // Mostly passing, with a few genuine failures so the danger states show.
  let result = null
  if (tested && mat.spec) {
    const pass = rnd() > 0.22
    const strength = pass ? mat.spec + int(40, 900) : mat.spec - int(20, 380)
    result = { strength: Math.round(strength / 10) * 10, pass }
  }
  // Tests without a strength spec (moisture, Atterberg, density) get no numeric
  // result — the UI renders "—" for those rather than a fake number.
  samples.push({
    id: `S-${pad(sN++)}`,
    project_id: pick(activeIds),
    material: mat.m,
    test: pick(mat.tests),
    set_label: mat.m.startsWith('Soil') || mat.m.startsWith('Asphalt') ? '—' : pick(['A', 'B', 'C', 'D']),
    cast_date: pick(castDays),
    due: status === 'Due today' ? 'Sep 14' : pick(dueDays),
    age: pick([3, 5, 6, 7, 14, 28, 28, 28, 56]),
    tech_id: status === 'Received' ? null : pick(labTechs),
    status,
    result,
  })
}

// ---------------------------------------------------------------- reports
const reportTitles = [
  ['Lab', 'Compressive strength — set B (28-day)'], ['Field', 'Field density — building pad, lifts 4–6'],
  ['Lab', 'Proctor — borrow source 2'], ['Geotech', 'Boring log B-07'], ['Geotech', 'Boring log B-08'],
  ['Field', 'Concrete placement — pier cap 3'], ['Lab', 'Grout cube strength — set C'],
  ['Field', 'Rebar inspection — pier cap 3'], ['Lab', 'Atterberg limits — B-07 composite'],
  ['Field', 'Asphalt density — lot 4'], ['Lab', 'Masonry prism strength — set A'],
  ['Field', 'Subgrade proofroll observation'], ['Geotech', 'Foundation recommendations — draft'],
  ['Lab', 'Moisture content — SPT series'], ['Field', 'Post-tension stressing record'],
  ['Lab', 'Compressive strength — set D (7-day)'], ['Field', 'Floor flatness — warehouse slab'],
  ['Geotech', 'Groundwater monitoring — round 2'],
]
const submittedAt = ['Sep 13, 4:12 PM', 'Sep 13, 5:40 PM', 'Sep 12, 11:05 AM', 'Sep 12, 6:22 PM', 'Sep 11, 3:15 PM', 'Sep 10, 9:48 AM', 'Sep 09, 2:00 PM', 'Sep 08, 8:30 AM']
const reportStatuses = [...Array(6).fill('Pending review'), ...Array(4).fill('Approved'), ...Array(5).fill('Delivered'), ...Array(3).fill('Rejected')]
const reports = reportTitles.map(([type, title], i) => {
  const project = pick(activeIds)
  return {
    id: `${project}-R${pad(i + 2, 2)}`,
    project_id: project,
    title,
    type,
    author_id: type === 'Lab' ? pick(labTechs) : pick(fieldTechs),
    submitted: pick(submittedAt),
    status: reportStatuses[i],
    pages: int(1, 5),
  }
})

// ---------------------------------------------------------------- time entries
const tasks = ['Concrete placement', 'Soil compaction', 'Proctor sampling', 'Boring log B-07', 'Cylinder breaks', 'Asphalt density', 'Rebar inspection', 'Subgrade proofroll', 'Report preparation']
const rates = { t1: 92, t2: 98, t3: 78, t4: 118, t5: 84, t6: 92, t7: 88, t8: 104 }
const timeEntries = []
let teN = 9001
for (const date of ['Sep 08', 'Sep 09', 'Sep 10', 'Sep 11', 'Sep 12', 'Sep 13', 'Sep 14']) {
  for (const tech of pick([fieldTechs, staff.map((s) => s.id)]).slice(0, int(3, 6))) {
    timeEntries.push({
      id: `TE-${teN++}`, tech_id: tech, work_date: date, project_id: pick(activeIds),
      task: pick(tasks), hours: pick([1.5, 2, 3, 3.5, 4, 5, 6, 8]), rate: rates[tech] ?? 90,
      status: date >= 'Sep 12' ? 'Unbilled' : pick(['Unbilled', 'Approved', 'Invoiced']),
    })
  }
}

// ---------------------------------------------------------------- invoices
const invoices = [
  { id: 'INV-2044', project_id: '24-0187', issued: 'Sep 08', due: 'Oct 08', amount: 18420, status: 'Sent' },
  { id: 'INV-2043', project_id: '24-0203', issued: 'Sep 05', due: 'Oct 05', amount: 6215, status: 'Sent' },
  { id: 'INV-2042', project_id: '24-0119', issued: 'Sep 02', due: 'Oct 02', amount: 22890, status: 'Sent' },
  { id: 'INV-2041', project_id: '23-0942', issued: 'Aug 06', due: 'Sep 05', amount: 4980, status: 'Overdue' },
  { id: 'INV-2040', project_id: '23-0898', issued: 'Aug 04', due: 'Sep 03', amount: 7410, status: 'Overdue' },
  { id: 'INV-2039', project_id: '24-0166', issued: 'Aug 01', due: 'Aug 31', amount: 9330, status: 'Paid' },
  { id: 'INV-2038', project_id: '24-0187', issued: 'Jul 28', due: 'Aug 27', amount: 15600, status: 'Paid' },
  { id: 'INV-2037', project_id: '24-0231', issued: 'Jul 22', due: 'Aug 21', amount: 11240, status: 'Paid' },
  { id: 'INV-2036', project_id: '24-0221', issued: 'Jul 15', due: 'Aug 14', amount: 5120, status: 'Paid' },
  { id: 'INV-2035', project_id: '24-0240', issued: 'Jul 10', due: 'Aug 09', amount: 3980, status: 'Void' },
  { id: 'INV-2045', project_id: '24-0119', issued: 'Sep 14', due: 'Oct 14', amount: 8760, status: 'Draft' },
  { id: 'INV-2046', project_id: '24-0231', issued: 'Sep 14', due: 'Oct 14', amount: 6340, status: 'Draft' },
].map((i) => ({ ...i, client: projects.find((p) => p.id === i.project_id).client }))

// ---------------------------------------------------------------- equipment
const equipment = [
  { id: 'CM-02', type: 'Compression machine', model: 'Forney F-500', serial: 'F5-21938', last_cal: 'Sep 18, 2025', next_due: 'Sep 18', status: 'Due in 4 days' },
  { id: 'CM-01', type: 'Compression machine', model: 'Forney F-250', serial: 'F2-11784', last_cal: 'Apr 02', next_due: 'Apr 02, 2027', status: 'Current' },
  { id: 'NG-04', type: 'Nuclear density gauge', model: 'Troxler 3440', serial: 'T3-77041', last_cal: 'Mar 02', next_due: 'Mar 02, 2027', status: 'Current' },
  { id: 'NG-05', type: 'Nuclear density gauge', model: 'Troxler 3440', serial: 'T3-77102', last_cal: 'Aug 22, 2025', next_due: 'Aug 22', status: 'Overdue' },
  { id: 'NG-06', type: 'Nuclear density gauge', model: 'Troxler 3430', serial: 'T3-69820', last_cal: 'Sep 09', next_due: 'Sep 26', status: 'Due in 12 days' },
  { id: 'OV-01', type: 'Drying oven', model: 'Humboldt H-30140', serial: 'H3-1120', last_cal: 'Jun 14', next_due: 'Jun 14, 2027', status: 'Current' },
  { id: 'OV-02', type: 'Drying oven', model: 'Humboldt H-30145', serial: 'H3-1188', last_cal: 'Jun 20', next_due: 'Jun 20, 2027', status: 'Current' },
  { id: 'SL-03', type: 'Slump cone set', model: 'Gilson HM-73', serial: '—', last_cal: 'Jul 01', next_due: 'Jan 01, 2027', status: 'Current' },
  { id: 'TH-11', type: 'Concrete thermometer', model: 'Traceable 4052', serial: 'TR-4052-11', last_cal: 'Sep 01', next_due: 'Sep 01, 2027', status: 'Current' },
  { id: 'AM-02', type: 'Air meter (pressure)', model: 'Humboldt H-2783', serial: 'H2-5580', last_cal: 'May 20', next_due: 'Nov 20', status: 'Current' },
  { id: 'AM-03', type: 'Air meter (pressure)', model: 'Humboldt H-2783', serial: 'H2-5612', last_cal: 'Aug 30, 2025', next_due: 'Aug 30', status: 'Overdue' },
  { id: 'SC-01', type: 'Balance 30 kg', model: 'Ohaus Ranger 7000', serial: 'OR-33019', last_cal: 'Feb 11', next_due: 'Feb 11, 2027', status: 'Current' },
  { id: 'SC-02', type: 'Balance 6 kg', model: 'Ohaus Scout STX', serial: 'OS-77410', last_cal: 'Sep 12', next_due: 'Sep 20', status: 'Due in 6 days' },
  { id: 'SV-01', type: 'Sieve shaker', model: 'Gilson SS-15', serial: 'GS-40122', last_cal: 'Jan 18', next_due: 'Jan 18, 2027', status: 'Current' },
]

// ---------------------------------------------------------------- certifications
const certifications = [
  { id: 'c1', tech_id: 't1', cert: 'ACI Concrete Field Testing Technician — Grade I', issuer: 'ACI', expires: 'Nov 30', status: 'Expiring soon' },
  { id: 'c2', tech_id: 't1', cert: 'Nuclear Gauge Safety & HAZMAT', issuer: 'Troxler', expires: 'Mar 15, 2028', status: 'Current' },
  { id: 'c3', tech_id: 't2', cert: 'ACI Concrete Strength Testing Technician', issuer: 'ACI', expires: 'Jun 30, 2029', status: 'Current' },
  { id: 'c4', tech_id: 't2', cert: 'NICET Level II — Construction Materials Testing', issuer: 'NICET', expires: 'Jan 31, 2028', status: 'Current' },
  { id: 'c5', tech_id: 't3', cert: 'ACI Concrete Field Testing Technician — Grade I', issuer: 'ACI', expires: 'Sep 30', status: 'Expiring soon' },
  { id: 'c6', tech_id: 't4', cert: 'ICC Soils Special Inspector', issuer: 'ICC', expires: 'Aug 15', status: 'Expired' },
  { id: 'c7', tech_id: 't4', cert: 'ICC Reinforced Concrete Special Inspector', issuer: 'ICC', expires: 'Apr 30, 2028', status: 'Current' },
  { id: 'c8', tech_id: 't5', cert: 'ACI Laboratory Testing Technician — Level 1', issuer: 'ACI', expires: 'Dec 31, 2028', status: 'Current' },
  { id: 'c9', tech_id: 't6', cert: 'ACI Concrete Field Testing Technician — Grade I', issuer: 'ACI', expires: 'Feb 28, 2028', status: 'Current' },
  { id: 'c10', tech_id: 't6', cert: 'Nuclear Gauge Safety & HAZMAT', issuer: 'Troxler', expires: 'Oct 12', status: 'Expiring soon' },
  { id: 'c11', tech_id: 't7', cert: 'ACI Laboratory Testing Technician — Level 2', issuer: 'ACI', expires: 'May 31, 2029', status: 'Current' },
  { id: 'c12', tech_id: 't7', cert: 'AASHTO Aggregate Technician', issuer: 'AASHTO', expires: 'Jul 01, 2028', status: 'Current' },
  { id: 'c13', tech_id: 't8', cert: 'ICC Soils Special Inspector', issuer: 'ICC', expires: 'Mar 31, 2029', status: 'Current' },
  { id: 'c14', tech_id: 't8', cert: 'ACI Concrete Field Testing Technician — Grade I', issuer: 'ACI', expires: 'Jun 30, 2028', status: 'Current' },
  { id: 'c15', tech_id: 't3', cert: 'OSHA 30-Hour Construction', issuer: 'OSHA', expires: 'Jul 31', status: 'Expired' },
  { id: 'c16', tech_id: 't5', cert: 'OSHA 10-Hour Construction', issuer: 'OSHA', expires: 'Dec 01', status: 'Expiring soon' },
]

// ---------------------------------------------------------------- write
await put('staff', staff)
await put('projects', projects)
await put('work_orders', workOrders)
await put('samples', samples)
await put('reports', reports)
await put('time_entries', timeEntries)
await put('invoices', invoices)
await put('equipment', equipment)
await put('certifications', certifications)
console.log('seed complete')
