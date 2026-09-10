import { Star } from 'lucide-react'
import type { FieldTypeId } from '../lib/fieldTypes'

export default function ValueDisplay({
  type,
  isList,
  value,
}: {
  type: FieldTypeId
  isList: boolean
  value: unknown
}) {
  if (value == null || value === '') return <span className="text-ink-300">—</span>

  if (isList) {
    const list = Array.isArray(value) ? value : []
    if (list.length === 0) return <span className="text-ink-300">—</span>
    return (
      <div className="flex flex-wrap gap-1.5">
        {list.map((item, i) => (
          <span key={i} className="chip bg-ink-100 text-ink-700">
            <Scalar type={type} value={item} />
          </span>
        ))}
      </div>
    )
  }
  return <Scalar type={type} value={value} />
}

function Scalar({ type, value }: { type: FieldTypeId; value: unknown }) {
  switch (type) {
    case 'boolean':
      return (
        <span className={`chip ${value ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-500'}`}>
          {value ? 'True' : 'False'}
        </span>
      )
    case 'url':
      return (
        <a
          href={String(value)}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:underline break-all"
        >
          {String(value)}
        </a>
      )
    case 'color': {
      const hex = String(value)
      return (
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-3.5 w-3.5 rounded border border-ink-200"
            style={{ background: hex }}
          />
          <span className="font-mono text-xs">{hex}</span>
        </span>
      )
    }
    case 'rating': {
      const n = Number(value) || 0
      return (
        <span className="inline-flex items-center gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < n ? 'currentColor' : 'none'} />
          ))}
        </span>
      )
    }
    case 'money': {
      const m = value as { amount?: unknown; currency?: string }
      if (m?.amount === undefined || m.amount === '' || m.amount == null)
        return <span className="text-ink-300">—</span>
      return (
        <span className="font-medium">
          {Number(m.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {m.currency ?? ''}
        </span>
      )
    }
    case 'json':
      return (
        <code className="block max-w-full overflow-x-auto rounded bg-ink-50 px-2 py-1 font-mono text-xs">
          {typeof value === 'string' ? value : JSON.stringify(value)}
        </code>
      )
    case 'reference':
      return <code className="font-mono text-xs text-ink-600">{String(value)}</code>
    default:
      return <span className="text-ink-800">{String(value)}</span>
  }
}
