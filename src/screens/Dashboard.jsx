import React, { useState } from 'react'
import { Page, Status, money } from '../app/shell.jsx'
import { D } from '../data/corelab.js'
import { Button } from '../ds/core/Button.jsx'
import { Badge } from '../ds/core/Badge.jsx'
import { Avatar } from '../ds/core/Avatar.jsx'
import { Icon } from '../ds/core/Icon.jsx'
import { Segmented } from '../ds/forms/Segmented.jsx'
import { Card } from '../ds/data/Card.jsx'
import { DataTable } from '../ds/data/DataTable.jsx'
import { Stat } from '../ds/data/Stat.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'

export function Dashboard({ navigate, toast }) {
  const [range, setRange] = useState('Today')
  const today = D.workOrders.filter((w) => w.day === 0)
  const due = D.samples.filter((s) => s.status === 'Due today' || s.status === 'In test')
  const pending = D.reports.filter((r) => r.status === 'Pending review')
  const woCols = [
    { key: 'id', label: 'Work order', mono: true, strong: true },
    { key: 'project', label: 'Project', render: (r) => D.project[r.project].name },
    { key: 'test', label: 'Scope', muted: true, width: 190, ellipsis: true },
    { key: 'tech', label: 'Technician', render: (r) => (r.tech ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={D.tech[r.tech].name} size="xs" />{D.tech[r.tech].name.split(' ')[0]}</span> : <span style={{ color: 'var(--color-warning-text)' }}>Unassigned</span>) },
    { key: 'start', label: 'Start', mono: true, align: 'right' },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
  ]
  const labCols = [
    { key: 'id', label: 'Sample', mono: true, strong: true },
    { key: 'project', label: 'Project', render: (r) => D.project[r.project].name },
    { key: 'test', label: 'Test', muted: true },
    { key: 'age', label: 'Age', mono: true, align: 'right', render: (r) => r.age + ' d' },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
  ]
  // Derived from live data, so the panel reflects what is actually in the lab.
  const openWo = D.workOrders.filter((w) => w.status !== 'Complete')
  const inLab = D.samples.filter((s) => s.status !== 'Tested')
  const unbilled = D.timeEntries.filter((e) => e.status === 'Unbilled')
  const unbilledAmount = unbilled.reduce((a, e) => a + e.hours * e.rate, 0)
  const unbilledHours = unbilled.reduce((a, e) => a + e.hours, 0)

  const alerts = [
    ...D.equipment.filter((e) => e.status === 'Overdue').map((e) => ({
      icon: 'wrench', tone: 'danger', go: 'equipment',
      text: `${e.type} ${e.id} calibration is overdue — removed from dispatch`,
    })),
    ...D.equipment.filter((e) => String(e.status).startsWith('Due in')).map((e) => ({
      icon: 'wrench', tone: 'warning', go: 'equipment',
      text: `${e.type} ${e.id} calibration ${String(e.status).toLowerCase()}`,
    })),
    ...D.certifications.filter((c) => c.status === 'Expired').map((c) => ({
      icon: 'badge-check', tone: 'danger', go: 'equipment',
      text: `${D.tech[c.tech]?.name ?? 'Staff'} — ${c.cert} expired ${c.expires}`,
    })),
    ...D.samples.filter((s) => s.result && s.result.pass === false).map((s) => ({
      icon: 'alert-triangle', tone: 'danger', go: 'samples',
      text: `${s.material} ${s.id} failed spec${s.result.strength ? ` (${s.result.strength.toLocaleString()} psi)` : ''}`,
    })),
    ...D.invoices.filter((i) => i.status === 'Overdue').map((i) => ({
      icon: 'receipt', tone: 'danger', go: 'billing',
      text: `${i.id} ${i.client} is overdue`,
    })),
  ].slice(0, 8)
  return (
    <Page header={<PageHeader title="Dashboard" meta={<><span>Mon, Sep 14</span><span>Northline Geotechnical · all offices</span></>}
      actions={<><Segmented size="sm" options={['Today', 'Week', 'Month']} value={range} onChange={setRange} /><Button variant="secondary" icon="download" onClick={() => toast({ tone: 'success', title: 'Export started', description: 'Dashboard summary will download shortly' })}>Export</Button><Button icon="plus" onClick={() => navigate('scheduling')}>New work order</Button></>} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--grid-gap)' }}>
        <Stat label="Open work orders" value={String(openWo.length)} delta={`${today.length} today`} deltaTone="accent" hint={`${D.workOrders.filter((w) => w.status === 'Unassigned').length} unassigned`} icon="clipboard-list" />
        <Stat label="Samples in lab" value={String(inLab.length)} delta={`${D.samples.filter((s) => s.status === 'Due today').length} due today`} hint={`${D.samples.length} total on file`} icon="flask-conical" />
        <Stat label="Reports pending" value={String(pending.length)} delta={`${D.reports.filter((r) => r.status === 'Delivered').length} delivered`} deltaTone="success" hint="awaiting review" icon="file-check-2" />
        <Stat label="Unbilled" value={money(unbilledAmount)} delta={`${unbilled.length} entries`} deltaTone="warning" hint={`${unbilledHours.toFixed(1)} hours`} icon="receipt" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--grid-gap)', marginTop: 'var(--grid-gap)' }}>
        <Card title="Today's dispatch" meta={today.length + ' work orders · ' + new Set(today.map((w) => w.tech)).size + ' technicians in the field'} flush actions={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => navigate('scheduling')}>Open board</Button>}>
          <DataTable columns={woCols} rows={today} onRowClick={() => navigate('scheduling')} />
        </Card>
        <Card title="Needs attention" meta={alerts.length + ' items'} flush>
          {alerts.map((a, i) => (
            <button key={i} type="button" onClick={() => navigate(a.go)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', padding: '12px 16px', border: 0, borderBottom: i < alerts.length - 1 ? '1px solid var(--color-hairline)' : 0, background: 'transparent', color: 'var(--color-text)', textAlign: 'left', cursor: 'pointer', fontSize: 'var(--text-sm)', lineHeight: 1.4 }}>
              <Icon name={a.icon} size={16} color={a.tone === 'danger' ? 'var(--color-danger-text)' : 'var(--color-warning-text)'} style={{ marginTop: 1 }} />
              <span style={{ flex: 1 }}>{a.text}</span>
              <Icon name="chevron-right" size={14} color="var(--color-text-3)" style={{ marginTop: 2 }} />
            </button>
          ))}
        </Card>
        <Card title="Lab — due today" meta={due.length + ' samples · 3 cylinder sets'} flush actions={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => navigate('samples')}>Open lab queue</Button>}>
          <DataTable columns={labCols} rows={due} dense onRowClick={() => navigate('samples')} />
        </Card>
        <Card title="Reports pending review" meta={pending.length + ' awaiting your approval'} flush actions={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => navigate('reports')}>Review</Button>}>
          {pending.map((r, i) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < pending.length - 1 ? '1px solid var(--color-hairline)' : 0 }}>
              <Avatar name={D.tech[r.author].name} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}><span className="mono">{r.id}</span> · {r.submitted}</div>
              </div>
              <Badge size="sm">{r.type}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </Page>
  )
}
