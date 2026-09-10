import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Plus, Boxes, Trash2, ChevronRight } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, ErrorNote } from '../components/ui'
import Icon from '../components/Icon'
import Drawer from '../components/Drawer'
import { createRecord, deleteRecord, listOwnerTypes, listRecords } from '../lib/api'
import type { OwnerType, RecordRow } from '../lib/types'

export default function Records() {
  const { ownerKey } = useParams()
  const navigate = useNavigate()
  const [ownerTypes, setOwnerTypes] = useState<OwnerType[]>([])
  const [records, setRecords] = useState<RecordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const active = useMemo(
    () => ownerTypes.find((o) => o.key === ownerKey) ?? ownerTypes[0],
    [ownerTypes, ownerKey],
  )

  useEffect(() => {
    listOwnerTypes()
      .then(setOwnerTypes)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  useEffect(() => {
    if (!active) return
    setLoading(true)
    listRecords(active.id)
      .then(setRecords)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [active])

  return (
    <>
      <PageHeader
        title="Records"
        subtitle="Individual instances of each resource, with their metafield values."
        actions={
          <button className="btn-primary" onClick={() => setCreating(true)} disabled={!active}>
            <Plus size={16} /> New record
          </button>
        }
      />
      <div className="p-8">
        {error && <ErrorNote error={error} />}

        <div className="mb-5 flex flex-wrap gap-2">
          {ownerTypes.map((o) => (
            <button
              key={o.id}
              onClick={() => navigate(`/records/${o.key}`)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                active?.id === o.id
                  ? 'border-brand-300 bg-brand-50 text-brand-700'
                  : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
              }`}
            >
              <Icon name={o.icon} size={15} />
              {o.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : records.length === 0 ? (
          <EmptyState
            icon={<Boxes size={32} />}
            title={`No ${active?.label.toLowerCase() ?? ''} records yet`}
            hint="Create a record, then fill in its metafield values."
            action={
              <button className="btn-primary" onClick={() => setCreating(true)}>
                <Plus size={16} /> New record
              </button>
            }
          />
        ) : (
          <div className="card divide-y divide-ink-100">
            {records.map((r) => (
              <div key={r.id} className="group flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50/40">
                <Link
                  to={`/records/${active!.key}/${r.id}`}
                  className="flex flex-1 items-center gap-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                    <Icon name={active!.icon} size={16} />
                  </span>
                  <span>
                    <span className="block font-medium text-ink-900">{r.title}</span>
                    {r.external_ref && (
                      <span className="block font-mono text-xs text-ink-400">{r.external_ref}</span>
                    )}
                  </span>
                </Link>
                <button
                  className="btn-ghost p-2 text-ink-300 opacity-0 transition hover:text-red-600 group-hover:opacity-100"
                  onClick={async () => {
                    if (confirm(`Delete record "${r.title}"?`)) {
                      await deleteRecord(r.id)
                      setRecords((rs) => rs.filter((x) => x.id !== r.id))
                    }
                  }}
                  aria-label="Delete record"
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={16} className="text-ink-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      {creating && active && (
        <NewRecordDrawer
          owner={active}
          onClose={() => setCreating(false)}
          onCreated={(r) => {
            setCreating(false)
            navigate(`/records/${active.key}/${r.id}`)
          }}
        />
      )}
    </>
  )
}

function NewRecordDrawer({
  owner,
  onClose,
  onCreated,
}: {
  owner: OwnerType
  onClose: () => void
  onCreated: (r: RecordRow) => void
}) {
  const [title, setTitle] = useState('')
  const [ref, setRef] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!title.trim()) return setError('Give the record a title.')
    setSaving(true)
    try {
      const r = await createRecord({
        owner_type_id: owner.id,
        title: title.trim(),
        external_ref: ref.trim() || undefined,
      })
      onCreated(r)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create')
      setSaving(false)
    }
  }

  return (
    <Drawer
      open
      title={`New ${owner.label.toLowerCase()}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Creating…' : 'Create record'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <ErrorNote error={error} />}
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g. ${owner.label} name`}
          />
        </div>
        <div>
          <label className="label">External reference (optional)</label>
          <input
            className="input font-mono"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="ID in your source system"
          />
        </div>
      </div>
    </Drawer>
  )
}
