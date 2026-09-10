import React, { useState } from 'react'
import { Page, Status, money } from '../app/shell.jsx'
import { D } from '../data/corelab.js'
import { Button } from '../ds/core/Button.jsx'
import { IconButton } from '../ds/core/IconButton.jsx'
import { Avatar } from '../ds/core/Avatar.jsx'
import { Tag } from '../ds/core/Tag.jsx'
import { Segmented } from '../ds/forms/Segmented.jsx'
import { Input } from '../ds/forms/Input.jsx'
import { DataTable } from '../ds/data/DataTable.jsx'
import { Stat } from '../ds/data/Stat.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'

export function Projects({ navigate, toast }) {
  const [active, setActive] = useState('24-0187')
  const [view, setView] = useState('list')
  const p = D.project[active]
  const wos = D.workOrders.filter((w) => w.project === active)
  const reps = D.reports.filter((r) => r.project === active)
  const bar = (r) => <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ flex: 1, height: 6, background: 'var(--color-surface-3)' }}><div style={{ width: r.used * 100 + '%', height: '100%', background: r.used > 0.9 ? 'var(--color-danger)' : r.used > 0.75 ? 'var(--color-warning)' : 'var(--color-accent)' }} /></div><span className="mono" style={{ fontSize: 'var(--text-xs)', width: 34, textAlign: 'right' }}>{Math.round(r.used * 100)}%</span></div>
  const cols = [
    { key: 'id', label: 'Project', mono: true, strong: true },
    { key: 'name', label: 'Name', strong: true },
    { key: 'client', label: 'Client', muted: true },
    { key: 'pm', label: 'PM', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={r.pm} size="xs" />{r.pm}</span> },
    { key: 'phase', label: 'Phase', muted: true },
    { key: 'budget', label: 'Budget', mono: true, align: 'right', render: (r) => money(r.budget) },
    { key: 'used', label: 'Burn', width: 160, render: bar },
    { key: 'openWo', label: 'Open WOs', mono: true, align: 'right' },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
  ]
  return (
    <Page padded={false} asideWidth={380} header={<PageHeader title="Projects" meta={<><span>{D.projects.filter((x) => x.status === 'Active').length} active · {D.projects.length} total</span><span>Portfolio budget {money(D.projects.reduce((a, x) => a + x.budget, 0))}</span></>}
      actions={<><Input icon="search" placeholder="Project number, name, client" style={{ width: 260 }} /><Segmented size="sm" options={[{ value: 'list', icon: 'list', iconOnly: true, label: 'List' }, { value: 'board', icon: 'kanban', iconOnly: true, label: 'Board' }]} value={view} onChange={setView} /><Button icon="plus" onClick={() => toast({ title: 'New project', description: 'Draft 24-0230 created' })}>New project</Button></>} />}
      aside={<div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '2px solid var(--color-divider)' }}>
          <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-accent-text)', fontWeight: 500 }}>Project {p.id}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-xl)', letterSpacing: '-0.015em', marginTop: 4 }}>{p.name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', marginTop: 4 }}>{p.client} · PM {p.pm} · {p.phase}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}><Button size="sm" icon="plus" onClick={() => navigate('scheduling')}>Work order</Button><Button variant="secondary" size="sm" icon="file-text" onClick={() => navigate('reports')}>Reports</Button><IconButton icon="more-horizontal" label="More" size="sm" variant="secondary" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--color-hairline)' }}>
          <Stat plain size="sm" label="Budget used" value={Math.round(p.used * 100) + '%'} hint={money(p.budget * p.used) + ' of ' + money(p.budget)} style={{ padding: 16, borderRight: '1px solid var(--color-hairline)' }} />
          <Stat plain size="sm" label="Open work orders" value={String(p.openWo)} hint={wos.filter((w) => !w.tech).length + ' unassigned'} style={{ padding: 16 }} />
        </div>
        <div style={{ padding: 16, borderBottom: '1px solid var(--color-hairline)' }}>
          <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500, marginBottom: 8 }}>This week</div>
          {wos.length ? wos.slice(0, 5).map((w) => <div key={w.id} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: 'var(--text-xs)', alignItems: 'center' }}><span className="mono" style={{ color: 'var(--color-text-3)', width: 48 }}>{D.days[w.day].slice(0, 3)}</span><span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.test}</span><Status value={w.status} size="sm" /></div>) : <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>No work scheduled.</div>}
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500, marginBottom: 8 }}>Recent reports</div>
          {reps.length ? reps.map((r) => <div key={r.id} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: 'var(--text-xs)', alignItems: 'center' }}><span className="mono" style={{ color: 'var(--color-text-3)' }}>{r.id.slice(-3)}</span><span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span><Status value={r.status} size="sm" /></div>) : <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>No reports yet.</div>}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}><Tag icon="map-pin">2 sites</Tag><Tag icon="users">6 staff</Tag><Tag icon="file-check-2">Specs: ACI 318, DOT 2024</Tag></div>
        </div>
      </div>}>
      {view === 'list' ? <DataTable columns={cols} rows={D.projects} activeKey={active} onRowClick={(r) => setActive(r.id)} stickyHeader /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--grid-gap)', padding: 'var(--page-py) var(--page-px)' }}>
          {['Geotechnical investigation', 'Earthwork', 'Construction', 'Closeout'].map((phase) => <div key={phase}><div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottom: '2px solid var(--color-divider)', marginBottom: 10 }}><span style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-2)', fontWeight: 600 }}>{phase}</span><span className="mono" style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>{D.projects.filter((x) => x.phase === phase).length}</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{D.projects.filter((x) => x.phase === phase).map((x) => <button key={x.id} type="button" onClick={() => setActive(x.id)} style={{ textAlign: 'left', padding: 12, background: 'var(--color-surface)', border: 0, boxShadow: '0 0 0 1px ' + (active === x.id ? 'var(--color-accent)' : 'var(--color-hairline)'), color: 'var(--color-text)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}><span className="mono" style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>{x.id}</span><span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{x.name}</span><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>{x.client}</span>{bar(x)}</button>)}</div></div>)}
        </div>
      )}
    </Page>
  )
}
