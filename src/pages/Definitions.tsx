import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Database } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, ErrorNote } from '../components/ui'
import Icon from '../components/Icon'
import DefinitionForm from '../components/DefinitionForm'
import { fieldType } from '../lib/fieldTypes'
import {
  createDefinition,
  deleteDefinition,
  listDefinitions,
  listOwnerTypes,
  updateDefinition,
} from '../lib/api'
import type { MetafieldDefinition, OwnerType } from '../lib/types'

export default function Definitions() {
  const [ownerTypes, setOwnerTypes] = useState<OwnerType[]>([])
  const [defs, setDefs] = useState<MetafieldDefinition[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MetafieldDefinition | undefined>()

  async function load() {
    setLoading(true)
    try {
      const [ots, ds] = await Promise.all([listOwnerTypes(), listDefinitions()])
      setOwnerTypes(ots)
      setDefs(ds)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const ownerById = useMemo(() => new Map(ownerTypes.map((o) => [o.id, o])), [ownerTypes])
  const shown = filter === 'all' ? defs : defs.filter((d) => d.owner_type_id === filter)

  async function handleSave(
    draft: Omit<MetafieldDefinition, 'id' | 'created_at' | 'updated_at'>,
    id?: string,
  ) {
    if (id) await updateDefinition(id, draft)
    else await createDefinition(draft)
    setFormOpen(false)
    setEditing(undefined)
    await load()
  }

  async function handleDelete(d: MetafieldDefinition) {
    if (!confirm(`Delete definition "${d.name}"? Values stored under it will be removed.`)) return
    await deleteDefinition(d.id)
    await load()
  }

  return (
    <>
      <PageHeader
        title="Definitions"
        subtitle="The schema of your metafields — one row per custom field."
        actions={
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(undefined)
              setFormOpen(true)
            }}
            disabled={ownerTypes.length === 0}
          >
            <Plus size={16} /> New definition
          </button>
        }
      />
      <div className="p-8">
        {error && <ErrorNote error={error} />}

        {!loading && (
          <div className="mb-5 flex flex-wrap gap-2">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label={`All (${defs.length})`} />
            {ownerTypes.map((o) => (
              <FilterChip
                key={o.id}
                active={filter === o.id}
                onClick={() => setFilter(o.id)}
                label={`${o.label} (${defs.filter((d) => d.owner_type_id === o.id).length})`}
                icon={o.icon}
              />
            ))}
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : shown.length === 0 ? (
          <EmptyState
            icon={<Database size={32} />}
            title="No definitions yet"
            hint="A definition describes a custom field: its type, namespace, key and validation."
            action={
              <button className="btn-primary" onClick={() => setFormOpen(true)}>
                <Plus size={16} /> New definition
              </button>
            }
          />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50/60 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-5 py-3 font-medium">Field</th>
                  <th className="px-5 py-3 font-medium">Namespace · key</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Applies to</th>
                  <th className="px-5 py-3 font-medium">Flags</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {shown.map((d) => {
                  const ft = fieldType(d.type)
                  const owner = ownerById.get(d.owner_type_id)
                  return (
                    <tr key={d.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/40">
                      <td className="px-5 py-3">
                        <div className="font-medium text-ink-900">{d.name}</div>
                        {d.description && (
                          <div className="text-xs text-ink-400">{d.description}</div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-xs text-ink-600">
                          {d.namespace}.{d.key}
                        </code>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-ink-700">
                          <Icon name={ft?.icon ?? 'box'} size={15} className="text-ink-400" />
                          {ft?.label ?? d.type}
                          {d.is_list && <span className="chip bg-ink-100 text-ink-500">list</span>}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-ink-600">
                          <Icon name={owner?.icon ?? 'box'} size={15} className="text-ink-400" />
                          {owner?.label ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {d.required ? (
                          <span className="chip bg-amber-100 text-amber-700">required</span>
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="btn-ghost p-2"
                            onClick={() => {
                              setEditing(d)
                              setFormOpen(true)
                            }}
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn-ghost p-2 text-ink-400 hover:text-red-600"
                            onClick={() => handleDelete(d)}
                            aria-label="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <DefinitionForm
          ownerTypes={ownerTypes}
          defaultOwnerTypeId={filter !== 'all' ? filter : undefined}
          existing={editing}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false)
            setEditing(undefined)
          }}
        />
      )}
    </>
  )
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-brand-300 bg-brand-50 text-brand-700'
          : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
      }`}
    >
      {icon && <Icon name={icon} size={15} />}
      {label}
    </button>
  )
}
