// Seed CoreLab with demo definitions, records and values.
// Usage:  SUPABASE_URL=... SUPABASE_SECRET_KEY=... bun scripts/seed.mjs
// The secret key is read from the environment and is never stored in the repo.
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY')
  process.exit(1)
}
const db = createClient(url, key, { auth: { persistSession: false } })

function die(ctx, error) {
  if (error) {
    console.error(ctx, error.message)
    process.exit(1)
  }
}

const { data: owners, error: oErr } = await db.from('owner_types').select('*')
die('owner_types', oErr)
const byKey = Object.fromEntries(owners.map((o) => [o.key, o]))

const DEFS = [
  // Employee
  { owner: 'employee', namespace: 'hr', key: 'employee_code', name: 'Employee code', type: 'single_line_text', required: true, validation: { regex: '^E\\d{4}$' }, description: 'Format E0000' },
  { owner: 'employee', namespace: 'hr', key: 'start_date', name: 'Start date', type: 'date', description: 'First day on the job' },
  { owner: 'employee', namespace: 'hr', key: 'department', name: 'Department', type: 'single_line_text', validation: { options: ['Engineering', 'Sales', 'Operations', 'Finance', 'People'] } },
  { owner: 'employee', namespace: 'custom', key: 'skills', name: 'Skills', type: 'single_line_text', is_list: true, description: 'Key skills' },
  { owner: 'employee', namespace: 'custom', key: 'performance', name: 'Performance', type: 'rating', validation: { ratingMax: 5 } },
  { owner: 'employee', namespace: 'custom', key: 'remote', name: 'Remote', type: 'boolean' },
  // Product
  { owner: 'product', namespace: 'custom', key: 'warranty_months', name: 'Warranty (months)', type: 'integer', validation: { min: 0, max: 120 } },
  { owner: 'product', namespace: 'custom', key: 'material', name: 'Material', type: 'single_line_text', validation: { options: ['Steel', 'Aluminum', 'Plastic', 'Wood'] } },
  { owner: 'product', namespace: 'custom', key: 'unit_cost', name: 'Unit cost', type: 'money', validation: { currency: 'USD' } },
  { owner: 'product', namespace: 'custom', key: 'brand_color', name: 'Brand color', type: 'color' },
  { owner: 'product', namespace: 'custom', key: 'spec_sheet', name: 'Spec sheet', type: 'url' },
  { owner: 'product', namespace: 'custom', key: 'featured', name: 'Featured', type: 'boolean' },
  // Order
  { owner: 'order', namespace: 'ops', key: 'priority', name: 'Priority', type: 'single_line_text', validation: { options: ['Low', 'Normal', 'High', 'Urgent'] } },
  { owner: 'order', namespace: 'ops', key: 'gift_wrap', name: 'Gift wrap', type: 'boolean' },
  { owner: 'order', namespace: 'ops', key: 'delivery_date', name: 'Delivery date', type: 'date' },
  // Project
  { owner: 'project', namespace: 'custom', key: 'budget', name: 'Budget', type: 'money', validation: { currency: 'USD' } },
  { owner: 'project', namespace: 'custom', key: 'health', name: 'Health', type: 'single_line_text', validation: { options: ['On track', 'At risk', 'Off track'] } },
  { owner: 'project', namespace: 'custom', key: 'metadata', name: 'Metadata', type: 'json' },
]

const defId = {}
for (const d of DEFS) {
  const owner = byKey[d.owner]
  if (!owner) continue
  const row = {
    owner_type_id: owner.id,
    namespace: d.namespace,
    key: d.key,
    name: d.name,
    description: d.description ?? null,
    type: d.type,
    is_list: d.is_list ?? false,
    required: d.required ?? false,
    validation: d.validation ?? {},
  }
  const { data, error } = await db
    .from('metafield_definitions')
    .upsert(row, { onConflict: 'owner_type_id,namespace,key' })
    .select()
    .single()
  die(`definition ${d.owner}.${d.key}`, error)
  defId[`${d.owner}.${d.namespace}.${d.key}`] = data.id
}
console.log(`definitions: ${Object.keys(defId).length}`)

const RECORDS = [
  { owner: 'employee', title: 'Dana Whitfield', ref: 'E1042', values: { 'employee.hr.employee_code': 'E1042', 'employee.hr.start_date': '2023-04-17', 'employee.hr.department': 'Engineering', 'employee.custom.skills': ['TypeScript', 'Postgres', 'React'], 'employee.custom.performance': 4, 'employee.custom.remote': true } },
  { owner: 'employee', title: 'Marco Reyes', ref: 'E1088', values: { 'employee.hr.employee_code': 'E1088', 'employee.hr.start_date': '2024-01-08', 'employee.hr.department': 'Sales', 'employee.custom.skills': ['Negotiation', 'CRM'], 'employee.custom.performance': 5, 'employee.custom.remote': false } },
  { owner: 'product', title: 'Titan Office Chair', ref: 'SKU-CHR-01', values: { 'product.custom.warranty_months': 24, 'product.custom.material': 'Aluminum', 'product.custom.unit_cost': { amount: 189.5, currency: 'USD' }, 'product.custom.brand_color': '#1f47f5', 'product.custom.featured': true } },
  { owner: 'product', title: 'Nomad Standing Desk', ref: 'SKU-DSK-07', values: { 'product.custom.warranty_months': 60, 'product.custom.material': 'Wood', 'product.custom.unit_cost': { amount: 420, currency: 'USD' }, 'product.custom.spec_sheet': 'https://example.com/desk.pdf', 'product.custom.featured': false } },
  { owner: 'project', title: 'Warehouse automation', ref: 'PRJ-14', values: { 'project.custom.budget': { amount: 125000, currency: 'USD' }, 'project.custom.health': 'On track', 'project.custom.metadata': { lead: 'Dana', quarter: 'Q3' } } },
  { owner: 'order', title: 'Order #10293', ref: '10293', values: { 'order.ops.priority': 'High', 'order.ops.gift_wrap': true, 'order.ops.delivery_date': '2026-09-20' } },
]

let recCount = 0
let valCount = 0
for (const r of RECORDS) {
  const owner = byKey[r.owner]
  if (!owner) continue
  // avoid duplicates on re-run: match by owner + title
  const { data: existing } = await db
    .from('records')
    .select('id')
    .eq('owner_type_id', owner.id)
    .eq('title', r.title)
    .maybeSingle()
  let recordId = existing?.id
  if (!recordId) {
    const { data, error } = await db
      .from('records')
      .insert({ owner_type_id: owner.id, title: r.title, external_ref: r.ref ?? null })
      .select()
      .single()
    die(`record ${r.title}`, error)
    recordId = data.id
    recCount++
  }
  for (const [defKey, value] of Object.entries(r.values)) {
    const definition_id = defId[defKey]
    if (!definition_id) continue
    const { error } = await db
      .from('metafield_values')
      .upsert({ definition_id, record_id: recordId, value }, { onConflict: 'definition_id,record_id' })
    die(`value ${r.title}/${defKey}`, error)
    valCount++
  }
}
console.log(`records: +${recCount}, values: ${valCount}`)
console.log('seed complete')
