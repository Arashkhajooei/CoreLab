import { Plus, Star, Trash2 } from 'lucide-react'
import type { FieldTypeId, Validation } from '../lib/fieldTypes'
import { emptyValue } from '../lib/fieldTypes'

interface Props {
  type: FieldTypeId
  isList: boolean
  validation: Validation
  value: unknown
  onChange: (v: unknown) => void
}

export default function ValueEditor({ type, isList, validation, value, onChange }: Props) {
  if (isList) {
    const list = Array.isArray(value) ? value : []
    return (
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <ScalarEditor
                type={type}
                validation={validation}
                value={item}
                onChange={(v) => {
                  const next = [...list]
                  next[i] = v
                  onChange(next)
                }}
              />
            </div>
            <button
              type="button"
              className="btn-ghost mt-0.5 p-2 text-ink-400 hover:text-red-600"
              onClick={() => onChange(list.filter((_, j) => j !== i))}
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-outline"
          onClick={() => onChange([...list, emptyValue(type, false, validation)])}
        >
          <Plus size={16} /> Add item
        </button>
      </div>
    )
  }
  return <ScalarEditor type={type} validation={validation} value={value} onChange={onChange} />
}

function ScalarEditor({
  type,
  validation,
  value,
  onChange,
}: {
  type: FieldTypeId
  validation: Validation
  value: unknown
  onChange: (v: unknown) => void
}) {
  switch (type) {
    case 'single_line_text':
      if (validation.options?.length) {
        return (
          <select className="input" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
            <option value="">— Select —</option>
            {validation.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )
      }
      return (
        <input
          className="input"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Text value"
        />
      )

    case 'multi_line_text':
      return (
        <textarea
          className="input min-h-[96px]"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Longer text…"
        />
      )

    case 'url':
      return (
        <input
          className="input"
          type="url"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
        />
      )

    case 'integer':
      return (
        <input
          className="input"
          type="number"
          step={1}
          value={value === '' || value == null ? '' : Number(value)}
          onChange={(e) => onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
        />
      )

    case 'decimal':
      return (
        <input
          className="input"
          type="number"
          step={validation.step ?? 'any'}
          value={value === '' || value == null ? '' : Number(value)}
          onChange={(e) => onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
        />
      )

    case 'boolean':
      return (
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-sm text-ink-700">{value ? 'True' : 'False'}</span>
        </label>
      )

    case 'date':
      return (
        <input
          className="input"
          type="date"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'date_time':
      return (
        <input
          className="input"
          type="datetime-local"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )

    case 'color': {
      const hex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(String(value)) ? String(value) : '#3366ff'
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="h-9 w-12 cursor-pointer rounded border border-ink-200"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            className="input font-mono"
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#3366ff"
          />
        </div>
      )
    }

    case 'rating': {
      const max = validation.ratingMax ?? 5
      const n = Number(value) || 0
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i + 1 === n ? 0 : i + 1)}
              className="text-amber-400 hover:scale-110 transition"
              aria-label={`${i + 1} stars`}
            >
              <Star size={22} fill={i < n ? 'currentColor' : 'none'} />
            </button>
          ))}
          <span className="ml-2 text-sm text-ink-500">
            {n}/{max}
          </span>
        </div>
      )
    }

    case 'money': {
      const money = (value as { amount?: unknown; currency?: string }) ?? {}
      return (
        <div className="flex gap-2">
          <input
            className="input flex-1"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={money.amount === undefined || money.amount === null ? '' : Number(money.amount)}
            onChange={(e) =>
              onChange({ ...money, amount: e.target.value === '' ? '' : parseFloat(e.target.value) })
            }
          />
          <input
            className="input w-24 font-mono uppercase"
            maxLength={3}
            placeholder="USD"
            value={money.currency ?? validation.currency ?? 'USD'}
            onChange={(e) => onChange({ ...money, currency: e.target.value.toUpperCase() })}
          />
        </div>
      )
    }

    case 'json':
      return (
        <textarea
          className="input min-h-[120px] font-mono text-xs"
          value={typeof value === 'string' ? value : JSON.stringify(value ?? '', null, 2)}
          onChange={(e) => onChange(e.target.value)}
          placeholder='{ "key": "value" }'
          spellCheck={false}
        />
      )

    case 'reference':
      return (
        <input
          className="input font-mono"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Record ID to reference"
        />
      )

    default:
      return (
        <input className="input" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
      )
  }
}
