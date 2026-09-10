import { useMemo, useState } from 'react'
import Icon from './Icon'
import Drawer from './Drawer'
import { ErrorNote } from './ui'
import {
  FIELD_TYPES,
  FIELD_TYPE_GROUPS,
  fieldType,
  type FieldTypeId,
  type Validation,
} from '../lib/fieldTypes'
import type { MetafieldDefinition, OwnerType } from '../lib/types'

type Draft = Omit<MetafieldDefinition, 'id' | 'created_at' | 'updated_at'>

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export default function DefinitionForm({
  ownerTypes,
  defaultOwnerTypeId,
  existing,
  onSave,
  onClose,
}: {
  ownerTypes: OwnerType[]
  defaultOwnerTypeId?: string
  existing?: MetafieldDefinition
  onSave: (draft: Draft, id?: string) => Promise<void>
  onClose: () => void
}) {
  const [draft, setDraft] = useState<Draft>(
    existing ?? {
      owner_type_id: defaultOwnerTypeId || ownerTypes[0]?.id || '',
      namespace: 'custom',
      key: '',
      name: '',
      description: '',
      type: 'single_line_text',
      is_list: false,
      required: false,
      validation: {},
    },
  )
  const [keyTouched, setKeyTouched] = useState(Boolean(existing))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ft = fieldType(draft.type)!
  const isEdit = Boolean(existing)

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setDraft((d) => ({ ...d, [k]: v }))
  }
  function setValidation(patch: Partial<Validation>) {
    setDraft((d) => ({ ...d, validation: { ...d.validation, ...patch } }))
  }

  function pickType(id: FieldTypeId) {
    const next = fieldType(id)!
    setDraft((d) => ({
      ...d,
      type: id,
      is_list: next.supportsList ? d.is_list : false,
      validation: {}, // reset validation when the type changes
    }))
  }

  async function submit() {
    setError(null)
    if (!draft.owner_type_id) return setError('Pick a resource this applies to.')
    if (!draft.name.trim()) return setError('Give the definition a name.')
    const key = draft.key.trim() || slugify(draft.name)
    if (!/^[a-z][a-z0-9_]*$/.test(key))
      return setError('Key must be lowercase letters, numbers and underscores, starting with a letter.')
    setSaving(true)
    try {
      await onSave({ ...draft, key, namespace: draft.namespace.trim() || 'custom' }, existing?.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
      setSaving(false)
    }
  }

  return (
    <Drawer
      open
      title={isEdit ? 'Edit definition' : 'New metafield definition'}
      onClose={onClose}
      width="max-w-xl"
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create definition'}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {error && <ErrorNote error={error} />}

        <div>
          <label className="label">Applies to</label>
          <select
            className="input"
            value={draft.owner_type_id}
            onChange={(e) => set('owner_type_id', e.target.value)}
            disabled={isEdit}
          >
            {ownerTypes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              value={draft.name}
              onChange={(e) => {
                set('name', e.target.value)
                if (!keyTouched) set('key', slugify(e.target.value))
              }}
              placeholder="e.g. Warranty months"
            />
          </div>
          <div>
            <label className="label">Key</label>
            <input
              className="input font-mono"
              value={draft.key}
              onChange={(e) => {
                setKeyTouched(true)
                set('key', e.target.value)
              }}
              placeholder="warranty_months"
              disabled={isEdit}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Namespace</label>
            <input
              className="input font-mono"
              value={draft.namespace}
              onChange={(e) => set('namespace', e.target.value)}
              placeholder="custom"
              disabled={isEdit}
            />
          </div>
          <div className="flex items-end">
            <div className="text-xs text-ink-400">
              Referenced as{' '}
              <code className="rounded bg-ink-100 px-1 py-0.5 text-ink-600">
                {draft.namespace || 'custom'}.{draft.key || 'key'}
              </code>
            </div>
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <input
            className="input"
            value={draft.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            placeholder="What is this field for?"
          />
        </div>

        {/* Type picker */}
        <div>
          <label className="label">Type</label>
          {isEdit ? (
            <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-600">
              <Icon name={ft.icon} size={16} /> {ft.label}
              <span className="text-ink-400">· type can't be changed after creation</span>
            </div>
          ) : (
            <TypePicker selected={draft.type} onPick={pickType} />
          )}
        </div>

        {/* List + required toggles */}
        <div className="flex flex-wrap gap-4">
          {ft.supportsList && (
            <Toggle
              label="List of values"
              hint="Store multiple values"
              checked={draft.is_list}
              onChange={(v) => set('is_list', v)}
            />
          )}
          <Toggle
            label="Required"
            hint="Must have a value"
            checked={draft.required}
            onChange={(v) => set('required', v)}
          />
        </div>

        {/* Validation controls */}
        {ft.validators.length > 0 && (
          <div className="rounded-lg border border-ink-200 bg-ink-50/60 p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
              Validation
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ft.validators.includes('min') && (
                <NumField label="Min" value={draft.validation.min} onChange={(v) => setValidation({ min: v })} />
              )}
              {ft.validators.includes('max') && (
                <NumField label="Max" value={draft.validation.max} onChange={(v) => setValidation({ max: v })} />
              )}
              {ft.validators.includes('step') && (
                <NumField label="Step" value={draft.validation.step} onChange={(v) => setValidation({ step: v })} />
              )}
              {ft.validators.includes('minLength') && (
                <NumField
                  label="Min length"
                  value={draft.validation.minLength}
                  onChange={(v) => setValidation({ minLength: v })}
                />
              )}
              {ft.validators.includes('maxLength') && (
                <NumField
                  label="Max length"
                  value={draft.validation.maxLength}
                  onChange={(v) => setValidation({ maxLength: v })}
                />
              )}
              {ft.validators.includes('ratingMax') && (
                <NumField
                  label="Max stars"
                  value={draft.validation.ratingMax}
                  onChange={(v) => setValidation({ ratingMax: v })}
                />
              )}
              {ft.validators.includes('currency') && (
                <div>
                  <label className="label">Default currency</label>
                  <input
                    className="input font-mono uppercase"
                    maxLength={3}
                    value={draft.validation.currency ?? 'USD'}
                    onChange={(e) => setValidation({ currency: e.target.value.toUpperCase() })}
                  />
                </div>
              )}
              {ft.validators.includes('regex') && (
                <div className="col-span-2">
                  <label className="label">Regex pattern</label>
                  <input
                    className="input font-mono"
                    value={draft.validation.regex ?? ''}
                    onChange={(e) => setValidation({ regex: e.target.value })}
                    placeholder="^[A-Z]{2}\d{4}$"
                  />
                </div>
              )}
              {ft.validators.includes('options') && (
                <div className="col-span-2">
                  <label className="label">Choices (one per line — makes a dropdown)</label>
                  <textarea
                    className="input min-h-[80px]"
                    value={(draft.validation.options ?? []).join('\n')}
                    onChange={(e) =>
                      setValidation({
                        options: e.target.value
                          .split('\n')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder={'Small\nMedium\nLarge'}
                  />
                </div>
              )}
              {ft.validators.includes('referenceOwnerTypeId') && (
                <div className="col-span-2">
                  <label className="label">References which resource</label>
                  <select
                    className="input"
                    value={draft.validation.referenceOwnerTypeId ?? ''}
                    onChange={(e) => setValidation({ referenceOwnerTypeId: e.target.value })}
                  >
                    <option value="">Any</option>
                    {ownerTypes.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}

function TypePicker({
  selected,
  onPick,
}: {
  selected: FieldTypeId
  onPick: (id: FieldTypeId) => void
}) {
  const grouped = useMemo(
    () => FIELD_TYPE_GROUPS.map((g) => ({ group: g, items: FIELD_TYPES.filter((t) => t.group === g) })),
    [],
  )
  return (
    <div className="space-y-3">
      {grouped.map(({ group, items }) => (
        <div key={group}>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            {group}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {items.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onPick(t.id)}
                className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition ${
                  selected === t.id
                    ? 'border-brand-400 bg-brand-50 ring-1 ring-brand-200'
                    : 'border-ink-200 bg-white hover:border-ink-300'
                }`}
              >
                <span
                  className={`mt-0.5 ${selected === t.id ? 'text-brand-600' : 'text-ink-400'}`}
                >
                  <Icon name={t.icon} size={16} />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink-800">{t.label}</span>
                  <span className="block text-[11px] leading-tight text-ink-400">{t.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-ink-200'}`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? 'left-4' : 'left-0.5'
          }`}
        />
      </button>
      <span>
        <span className="block text-sm font-medium text-ink-700">{label}</span>
        {hint && <span className="block text-[11px] leading-tight text-ink-400">{hint}</span>}
      </span>
    </label>
  )
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number | undefined
  onChange: (v: number | undefined) => void
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      />
    </div>
  )
}
