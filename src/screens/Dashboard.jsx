import React, { useState } from 'react'
import { Page, Status } from '../app/shell.jsx'
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
  const alerts = [
    { icon: 'wrench', tone: 'warning', text: 'Compression machine CM-02 calibration due in 4 days', go: 'equipment' },
    { icon: 'badge-check', tone: 'danger', text: 'Grace Lindqvist — ICC Soils certification expired Aug 15', go: 'equipment' },
    { icon: 'alert-triangle', tone: 'danger', text: 'Grout cube S-0388 failed spec (1,960 psi < 2,000 psi)', go: 'samples' },
    { icon: 'receipt', tone: 'danger', text: 'INV-2041 City of Fairmont is 9 days overdue', go: 'billing' },
  ]
  return (
    <Page header={<PageHeader title="Dashboard" meta={<><span>Mon, Sep 14</span><span>Northline Geotechnical · all offices</span></>}
      actions={<><Segmented size="sm" options={['Today', 'Week', 'Month']} value={range} onChange={setRange} /><Button variant="secondary" icon="download" onClick={() => toast({ tone: 'success', title: 'Export started', description: 'Dashboard summary will download shortly' })}>Export</Button><Button icon="plus" onClick={() => navigate('scheduling')}>New work order</Button></>} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--grid-gap)' }}>
        <Stat label="Open work orders" value="128" delta="+9" deltaTone="accent" hint="vs last week" icon="clipboard-list" />
        <Stat label="Samples in lab" value="342" delta="+18" hint="due today: 14" icon="flask-conical" />
        <Stat label="Report turnaround" value="1.8" unit="days" delta="−0.4" deltaTone="success" hint="30-day avg" icon="file-check-2" />
        <Stat label="Unbilled" value="$46,210" delta="+$8,120" deltaTone="warning" hint="212 hours" icon="receipt" />
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
