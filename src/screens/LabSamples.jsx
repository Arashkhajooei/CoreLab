import React, { useState } from 'react'
import { Page, Status } from '../app/shell.jsx'
import { D } from '../data/corelab.js'
import { Button } from '../ds/core/Button.jsx'
import { Badge } from '../ds/core/Badge.jsx'
import { Tag } from '../ds/core/Tag.jsx'
import { Segmented } from '../ds/forms/Segmented.jsx'
import { Field } from '../ds/forms/Field.jsx'
import { Input } from '../ds/forms/Input.jsx'
import { Select } from '../ds/forms/Select.jsx'
import { DataTable } from '../ds/data/DataTable.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'
import { Tabs } from '../ds/navigation/Tabs.jsx'
import { EmptyState } from '../ds/feedback/EmptyState.jsx'

export function LabSamples({ navigate, toast }) {
  const [tab, setTab] = useState('all')
  const [sel, setSel] = useState([])
  const [active, setActive] = useState('S-0412')
  const [samples, setSamples] = useState(D.samples)
  const [load, setLoad] = useState('51,800')
  const counts = { all: samples.length, due: samples.filter((s) => s.status === 'Due today').length, test: samples.filter((s) => s.status === 'In test').length, received: samples.filter((s) => s.status === 'Received').length, tested: samples.filter((s) => s.status === 'Tested').length }
  const rows = samples.filter((s) => tab === 'all' || (tab === 'due' && s.status === 'Due today') || (tab === 'test' && s.status === 'In test') || (tab === 'received' && s.status === 'Received') || (tab === 'tested' && s.status === 'Tested'))
  const cur = samples.find((s) => s.id === active)
  const area = 12.57
  const strength = Math.round(parseFloat(String(load).replace(/,/g, '')) / area / 10) * 10
  const record = () => { setSamples((ss) => ss.map((s) => (s.id === cur.id ? { ...s, status: 'Tested', result: { strength, pass: strength >= 4000 } } : s))); toast({ tone: strength >= 4000 ? 'success' : 'danger', title: 'Result recorded — ' + cur.id, description: strength.toLocaleString() + ' psi · ' + (strength >= 4000 ? 'meets 4,000 psi spec' : 'below 4,000 psi spec — PM notified') }) }
  const cols = [
    { key: 'id', label: 'Sample', mono: true, strong: true },
    { key: 'project', label: 'Project', render: (r) => D.project[r.project].name },
    { key: 'material', label: 'Material', muted: true },
    { key: 'test', label: 'Test', mono: true },
    { key: 'set', label: 'Set', mono: true, align: 'center' },
    { key: 'cast', label: 'Cast / received', mono: true },
    { key: 'due', label: 'Due', mono: true, render: (r) => <span style={{ color: r.status === 'Due today' ? 'var(--color-warning-text)' : undefined }}>{r.due}</span> },
    { key: 'age', label: 'Age', mono: true, align: 'right', render: (r) => r.age + ' d' },
    { key: 'result', label: 'Result', mono: true, align: 'right', render: (r) => (r.result ? <span style={{ color: r.result.pass ? undefined : 'var(--color-danger-text)' }}>{r.result.strength.toLocaleString()} psi</span> : <span style={{ color: 'var(--color-text-3)' }}>—</span>) },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
  ]
  return (
    <Page padded={false} asideWidth={380} header={<PageHeader title="Samples" meta={<><span>Lab · Northline main</span><span>{counts.due} due today · {counts.test} in test</span></>}
      actions={<><Input icon="search" placeholder="Sample, project, set…" style={{ width: 260 }} size="md" /><Button variant="secondary" icon="filter">Filters</Button><Button variant="secondary" icon="scan-barcode" onClick={() => toast({ title: 'Scanner ready', description: 'Scan a specimen label to open it' })}>Scan</Button><Button icon="plus" onClick={() => toast({ tone: 'accent', title: 'Receiving started', description: 'Chain-of-custody form opened' })}>Receive samples</Button></>}
      tabs={<Tabs size="sm" value={tab} onChange={setTab} items={[{ value: 'all', label: 'All', count: counts.all }, { value: 'due', label: 'Due today', count: counts.due }, { value: 'test', label: 'In test', count: counts.test }, { value: 'received', label: 'Received', count: counts.received }, { value: 'tested', label: 'Tested', count: counts.tested }]} />} />}
      aside={cur ? <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-hairline)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}><div className="mono" style={{ fontSize: 'var(--text-lg)', fontWeight: 500 }}>{cur.id}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', marginTop: 2 }}>{D.project[cur.project].name} · set {cur.set} · {cur.material}</div></div>
          <Status value={cur.status} />
        </div>
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 'var(--text-xs)', borderBottom: '1px solid var(--color-hairline)' }}>
          {[['Test', cur.test], ['Cast', cur.cast], ['Break due', cur.due], ['Age', cur.age + ' days'], ['Spec', '4,000 psi'], ['Size', '4 × 8 in']].map(([k, val]) => <div key={k}><div style={{ color: 'var(--color-text-3)' }}>{k}</div><div className="mono" style={{ color: 'var(--color-text)', marginTop: 2 }}>{val}</div></div>)}
        </div>
        {cur.result ? (
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500 }}>Result</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}><span className="mono" style={{ fontSize: 'var(--text-3xl)', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1 }}>{cur.result.strength.toLocaleString()}</span><span className="mono" style={{ color: 'var(--color-text-3)' }}>psi</span><Badge tone={cur.result.pass ? 'success' : 'danger'} dot style={{ marginLeft: 'auto' }}>{cur.result.pass ? 'Meets spec' : 'Below spec'}</Badge></div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', marginTop: 10 }}>Tested by Sam Whitaker on CM-02 · fracture type 3</div>
            <Button variant="secondary" size="sm" icon="file-text" style={{ marginTop: 14 }} onClick={() => navigate('reports')}>Open report draft</Button>
          </div>
        ) : (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500 }}>Record result · {cur.test}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Machine"><Select value="CM-02" options={['CM-02 · Forney F-500', 'CM-01 · Forney F-250']} /></Field>
              <Field label="Diameter"><Input mono unit="in" align="right" defaultValue="4.00" /></Field>
              <Field label="Max load" required><Input mono unit="lbf" align="right" value={load} onChange={(e) => setLoad(e.target.value)} /></Field>
              <Field label="Fracture type"><Select value="3" options={[{ value: '1', label: 'Type 1 — cone' }, { value: '2', label: 'Type 2 — cone & split' }, { value: '3', label: 'Type 3 — columnar' }, { value: '4', label: 'Type 4 — shear' }]} /></Field>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '12px 14px', background: 'var(--color-surface-2)' }}><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>Strength</span><span className="mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 500, marginLeft: 'auto', letterSpacing: '-0.015em', color: strength >= 4000 ? 'var(--color-text)' : 'var(--color-danger-text)' }}>{isNaN(strength) ? '—' : strength.toLocaleString()}</span><span className="mono" style={{ color: 'var(--color-text-3)', fontSize: 'var(--text-xs)' }}>psi · area {area} in²</span></div>
            <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" style={{ flex: 1 }} icon="skip-forward" onClick={() => { const i = rows.findIndex((r) => r.id === cur.id); setActive((rows[i + 1] || rows[0]).id) }}>Next</Button><Button style={{ flex: 1 }} icon="check" onClick={record}>Record</Button></div>
          </div>
        )}
      </div> : null}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px var(--page-px)', borderBottom: '1px solid var(--color-hairline)' }}>
        <Tag icon="flask-conical" onRemove={() => {}}>Material: Concrete cylinder</Tag><Tag onRemove={() => {}}>Cast: last 30 days</Tag>
        <span style={{ flex: 1 }} />
        {sel.length ? <><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>{sel.length} selected</span><Button variant="secondary" size="sm" icon="printer">Print labels</Button><Button variant="secondary" size="sm" icon="user-plus">Assign</Button><Button size="sm" icon="check" onClick={() => toast({ tone: 'success', title: sel.length + ' samples moved to In test' })}>Start testing</Button></> : <Segmented size="sm" options={[{ value: 'list', icon: 'list', iconOnly: true, label: 'List' }, { value: 'grid', icon: 'layout-grid', iconOnly: true, label: 'Cards' }]} value="list" />}
      </div>
      {rows.length === 0 ? <div style={{ padding: 24 }}><EmptyState icon="flask-conical" title="No samples here" description="Samples matching this tab will appear as they are received." /></div> : <DataTable columns={cols} rows={rows} selectable selected={sel} onSelect={setSel} activeKey={active} onRowClick={(r) => setActive(r.id)} stickyHeader />}
    </Page>
  )
}
