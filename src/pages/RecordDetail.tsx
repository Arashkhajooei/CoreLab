import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, ErrorNote } from '../components/ui'
import Icon from '../components/Icon'
import ValueEditor from '../components/ValueEditor'
import { fieldType, validateValue, emptyValue, type Validation } from '../lib/fieldTypes'
import { clearValue, getOwnerTypeByKey, getRecord, getRecordValues, upsertValue } from '../lib/api'
import type { OwnerType, RecordRow, ValueWithDefinition } from '../lib/types'

function isEmpty(v: unknown): boolean {
  if (v == null) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  if (typeof v === 'object') {
    const amt = (v as { amount?: unknown }).amount
    if (amt !== undefined) return amt === '' || amt == null
  }
  return false
}

export default function RecordDetail() {
  const { ownerKey, recordId } = useParams()
  const [owner, setOwner] = useState<OwnerType | null>(null)
  const [record, setRecord] = useState<RecordRow | null>(null)
  const [fields, setFields] = useState<ValueWithDefinition[]>([])
  const [edited, setEdited] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)

  async function load() {
    if (!ownerKey || !recordId) return
    setLoading(true)
    try {
      const ot = await getOwnerTypeByKey(ownerKey)
      if (!ot) throw new Error('Unknown resource')
      const [rec, vals] = await Promise.all([getRecord(recordId), getRecordValues(ot.id, recordId)])
      setOwner(ot)
      setRecord(rec)
      setFields(vals)
      const init: Record<string, unknown> = {}
      for (const f of vals) {
        init[f.id] =
          f.value != null ? f.value : emptyValue(f.type, f.is_list, f.validation as Validation)
      }
      setEdited(init)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerKey, recordId])

  const dirty = useMemo(
    () => fields.some((f) => JSON.stringify(f.value ?? null) !== JSON.stringify(normalize(edited[f.id]))),
    [fields, edited],
  )

  function normalize(v: unknown): unknown {
    return isEmpty(v) ? null : v
  }

  async function save() {
    const errs: Record<string, string> = {}
    for (const f of fields) {
      const err = validateValue(f.type, f.is_list, f.required, f.validation as Validation, edited[f.id])
      if (err) errs[f.id] = err
    }
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    try {
      for (const f of fields) {
        const next = normalize(edited[f.id])
        const prev = f.value ?? null
        if (JSON.stringify(next) === JSON.stringify(prev)) continue
        if (next == null) {
          if (f.value_id) await clearValue(f.id, recordId!)
        } else {
          let toStore = next
          if (f.type === 'json' && typeof next === 'string') {
            try {
              toStore = JSON.parse(next)
            } catch {
              /* keep as string; validation already passed if valid */
            }
          }
          await upsertValue(f.id, recordId!, toStore)
        }
      }
      await load()
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 1800)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title={record?.title ?? 'Record'}
        subtitle={owner ? `${owner.label} · metafield values` : undefined}
        actions={
          <div className="flex items-center gap-3">
            {savedFlash && <span className="text-sm text-green-600">Saved</span>}
            <button className="btn-primary" onClick={save} disabled={saving || !dirty}>
              <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        }
      />
      <div className="p-8">
        <Link
          to={`/records/${ownerKey}`}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft size={15} /> Back to {owner?.label ?? 'records'}
        </Link>

        {error && <ErrorNote error={error} />}

        {loading ? (
          <Spinner />
        ) : fields.length === 0 ? (
          <EmptyState
            title="No definitions for this resource"
            hint="Create a metafield definition first, then its fields will appear here to fill in."
            action={
              <Link to="/definitions" className="btn-primary">
                Go to definitions
              </Link>
            }
          />
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {fields.map((f) => {
              const ft = fieldType(f.type)
              return (
                <div key={f.id} className="card p-5">
                  <div className="mb-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon name={ft?.icon ?? 'box'} size={16} className="text-ink-400" />
                        <span className="font-medium text-ink-900">{f.name}</span>
                        {f.required && <span className="chip bg-amber-100 text-amber-700">required</span>}
                        {f.is_list && <span className="chip bg-ink-100 text-ink-500">list</span>}
                      </div>
                      <code className="mt-0.5 block font-mono text-[11px] text-ink-400">
                        {f.namespace}.{f.key}
                      </code>
                      {f.description && (
                        <p className="mt-1 text-xs text-ink-500">{f.description}</p>
                      )}
                    </div>
                  </div>
                  <ValueEditor
                    type={f.type}
                    isList={f.is_list}
                    validation={f.validation as Validation}
                    value={edited[f.id]}
                    onChange={(v) => {
                      setEdited((e) => ({ ...e, [f.id]: v }))
                      if (errors[f.id]) setErrors((e) => ({ ...e, [f.id]: '' }))
                    }}
                  />
                  {errors[f.id] && <p className="mt-1.5 text-xs text-red-600">{errors[f.id]}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
