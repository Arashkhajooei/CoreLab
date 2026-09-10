import { supabase } from './supabase'
import type {
  MetafieldDefinition,
  OwnerType,
  RecordRow,
  ValueWithDefinition,
} from './types'

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

// ---- owner types ----
export async function listOwnerTypes(): Promise<OwnerType[]> {
  return unwrap(await supabase.from('owner_types').select('*').order('label'))
}

export async function getOwnerTypeByKey(key: string): Promise<OwnerType | null> {
  const res = await supabase.from('owner_types').select('*').eq('key', key).maybeSingle()
  if (res.error) throw new Error(res.error.message)
  return res.data
}

export async function createOwnerType(input: {
  key: string
  label: string
  icon: string
  description?: string
}): Promise<OwnerType> {
  return unwrap(await supabase.from('owner_types').insert(input).select().single())
}

export async function deleteOwnerType(id: string): Promise<void> {
  const { error } = await supabase.from('owner_types').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ---- definitions ----
export async function listDefinitions(ownerTypeId?: string): Promise<MetafieldDefinition[]> {
  let q = supabase.from('metafield_definitions').select('*').order('namespace').order('key')
  if (ownerTypeId) q = q.eq('owner_type_id', ownerTypeId)
  return unwrap(await q)
}

export async function createDefinition(
  input: Omit<MetafieldDefinition, 'id' | 'created_at' | 'updated_at'>,
): Promise<MetafieldDefinition> {
  return unwrap(await supabase.from('metafield_definitions').insert(input).select().single())
}

export async function updateDefinition(
  id: string,
  patch: Partial<MetafieldDefinition>,
): Promise<MetafieldDefinition> {
  return unwrap(
    await supabase.from('metafield_definitions').update(patch).eq('id', id).select().single(),
  )
}

export async function deleteDefinition(id: string): Promise<void> {
  const { error } = await supabase.from('metafield_definitions').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ---- records ----
export async function listRecords(ownerTypeId: string): Promise<RecordRow[]> {
  return unwrap(
    await supabase
      .from('records')
      .select('*')
      .eq('owner_type_id', ownerTypeId)
      .order('created_at', { ascending: false }),
  )
}

export async function getRecord(id: string): Promise<RecordRow> {
  return unwrap(await supabase.from('records').select('*').eq('id', id).single())
}

export async function createRecord(input: {
  owner_type_id: string
  title: string
  external_ref?: string
}): Promise<RecordRow> {
  return unwrap(await supabase.from('records').insert(input).select().single())
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from('records').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ---- values ----
// Merge a record's definitions with its stored values into one editable list.
export async function getRecordValues(
  ownerTypeId: string,
  recordId: string,
): Promise<ValueWithDefinition[]> {
  const [defs, vals] = await Promise.all([
    listDefinitions(ownerTypeId),
    supabase.from('metafield_values').select('*').eq('record_id', recordId),
  ])
  if (vals.error) throw new Error(vals.error.message)
  const byDef = new Map((vals.data ?? []).map((v) => [v.definition_id, v]))
  return defs.map((d) => {
    const v = byDef.get(d.id)
    return { ...d, value_id: v?.id ?? null, value: v ? v.value : null }
  })
}

export async function upsertValue(
  definitionId: string,
  recordId: string,
  value: unknown,
): Promise<void> {
  const { error } = await supabase
    .from('metafield_values')
    .upsert(
      { definition_id: definitionId, record_id: recordId, value },
      { onConflict: 'definition_id,record_id' },
    )
  if (error) throw new Error(error.message)
}

export async function clearValue(definitionId: string, recordId: string): Promise<void> {
  const { error } = await supabase
    .from('metafield_values')
    .delete()
    .eq('definition_id', definitionId)
    .eq('record_id', recordId)
  if (error) throw new Error(error.message)
}

// ---- dashboard counts ----
export async function counts(): Promise<{
  ownerTypes: number
  definitions: number
  records: number
  values: number
}> {
  const head = { count: 'exact' as const, head: true }
  const [ot, defs, recs, vals] = await Promise.all([
    supabase.from('owner_types').select('*', head),
    supabase.from('metafield_definitions').select('*', head),
    supabase.from('records').select('*', head),
    supabase.from('metafield_values').select('*', head),
  ])
  return {
    ownerTypes: ot.count ?? 0,
    definitions: defs.count ?? 0,
    records: recs.count ?? 0,
    values: vals.count ?? 0,
  }
}
