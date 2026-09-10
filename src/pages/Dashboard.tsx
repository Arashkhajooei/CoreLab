import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Database, Boxes, Layers, Tag, ArrowRight } from 'lucide-react'
import { PageHeader, Spinner, ErrorNote } from '../components/ui'
import { counts } from '../lib/api'

export default function Dashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof counts>> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    counts()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  const stats = [
    { label: 'Resources', value: data?.ownerTypes, icon: Layers, to: '/records' },
    { label: 'Definitions', value: data?.definitions, icon: Database, to: '/definitions' },
    { label: 'Records', value: data?.records, icon: Boxes, to: '/records' },
    { label: 'Values stored', value: data?.values, icon: Tag, to: '/records' },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Define custom fields for any resource, then attach values to individual records."
      />
      <div className="p-8">
        {error && <ErrorNote error={error} />}
        {!data && !error && <Spinner />}
        {data && (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((s) => (
                <Link key={s.label} to={s.to} className="card group p-5 transition hover:shadow-pop">
                  <div className="flex items-center justify-between">
                    <s.icon className="text-brand-500" size={22} />
                    <ArrowRight
                      size={16}
                      className="text-ink-300 opacity-0 transition group-hover:opacity-100"
                    />
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-ink-900">{s.value ?? 0}</div>
                  <div className="text-sm text-ink-500">{s.label}</div>
                </Link>
              ))}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="card p-6">
                <h3 className="text-base font-semibold text-ink-900">How CoreLab works</h3>
                <ol className="mt-3 space-y-3 text-sm text-ink-600">
                  <Step n={1}>
                    Create a <b>definition</b> — pick a resource (Employee, Product…), a type, and
                    validation rules.
                  </Step>
                  <Step n={2}>
                    Add <b>records</b> for that resource, or connect your own.
                  </Step>
                  <Step n={3}>
                    Fill in <b>metafield values</b> on each record with type-aware editors.
                  </Step>
                </ol>
                <Link to="/definitions" className="btn-primary mt-5">
                  Create your first definition <ArrowRight size={16} />
                </Link>
              </div>

              <div className="card p-6">
                <h3 className="text-base font-semibold text-ink-900">Supported field types</h3>
                <p className="mt-2 text-sm text-ink-500">
                  Text, multi-line, integer, decimal, money, rating, boolean, date, date-time, URL,
                  color, JSON and references — each available as a single value or a list.
                </p>
                <Link to="/definitions" className="btn-outline mt-5">
                  Browse definitions
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
        {n}
      </span>
      <span>{children}</span>
    </li>
  )
}
