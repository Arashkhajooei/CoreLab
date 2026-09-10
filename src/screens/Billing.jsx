import React, { useState } from 'react'
import { Page, Status, money } from '../app/shell.jsx'
import { D } from '../data/corelab.js'
import { Button } from '../ds/core/Button.jsx'
import { IconButton } from '../ds/core/IconButton.jsx'
import { Avatar } from '../ds/core/Avatar.jsx'
import { Segmented } from '../ds/forms/Segmented.jsx'
import { Field } from '../ds/forms/Field.jsx'
import { Input } from '../ds/forms/Input.jsx'
import { Select } from '../ds/forms/Select.jsx'
import { Card } from '../ds/data/Card.jsx'
import { DataTable } from '../ds/data/DataTable.jsx'
import { Stat } from '../ds/data/Stat.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'
import { Tabs } from '../ds/navigation/Tabs.jsx'
import { Dialog } from '../ds/feedback/Dialog.jsx'

export function Billing({ toast }) {
  const [tab, setTab] = useState('time')
  const [sel, setSel] = useState(['TE-9021', 'TE-9018', 'TE-9019'])
  const [entries, setEntries] = useState(D.timeEntries)
  const [invoices, setInvoices] = useState(D.invoices)
  const [open, setOpen] = useState(false)
  const chosen = entries.filter((e) => sel.includes(e.id))
  const total = chosen.reduce((a, e) => a + e.hours * e.rate, 0)
  const unbilled = entries.filter((e) => e.status === 'Unbilled')
  const create = () => { const id = 'INV-2045'; setEntries((es) => es.map((e) => (sel.includes(e.id) ? { ...e, status: 'Invoiced' } : e))); setInvoices((is) => [{ id, project: '24-0187', client: 'Meridian DOT', issued: 'Sep 14', due: 'Oct 14', amount: Math.round(total), status: 'Draft' }, ...is]); setSel([]); setOpen(false); setTab('invoices'); toast({ tone: 'success', title: id + ' created', description: money(total) + ' · ' + chosen.length + ' time entries · draft' }) }
  const timeCols = [
    { key: 'tech', label: 'Technician', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={D.tech[r.tech].name} size="xs" />{D.tech[r.tech].name}</span> },
    { key: 'date', label: 'Date', mono: true, muted: true },
    { key: 'project', label: 'Project', render: (r) => D.project[r.project].name },
    { key: 'task', label: 'Task', muted: true },
    { key: 'hours', label: 'Hours', mono: true, align: 'right', render: (r) => r.hours.toFixed(1) },
    { key: 'rate', label: 'Rate', mono: true, align: 'right', muted: true, render: (r) => '$' + r.rate + '/h' },
    { key: 'amount', label: 'Amount', mono: true, align: 'right', strong: true, render: (r) => money(r.hours * r.rate) },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
  ]
  const invCols = [
    { key: 'id', label: 'Invoice', mono: true, strong: true },
    { key: 'client', label: 'Client' },
    { key: 'project', label: 'Project', muted: true, render: (r) => D.project[r.project].name },
    { key: 'issued', label: 'Issued', mono: true, muted: true },
    { key: 'due', label: 'Due', mono: true, render: (r) => <span style={{ color: r.status === 'Overdue' ? 'var(--color-danger-text)' : undefined }}>{r.due}</span> },
    { key: 'amount', label: 'Amount', mono: true, align: 'right', strong: true, render: (r) => money(r.amount) },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
    { key: 'a', label: '', align: 'right', render: () => <span style={{ display: 'inline-flex', gap: 2 }}><IconButton icon="download" label="Download PDF" size="sm" /><IconButton icon="send" label="Send" size="sm" /><IconButton icon="more-horizontal" label="More" size="sm" /></span> },
  ]
  return (
    <Page header={<PageHeader title="Timesheets & invoicing" meta={<><span>Period: Sep 1 – Sep 14</span><span>{unbilled.length} unbilled entries</span></>}
      actions={<><Segmented size="sm" options={['This period', 'Last period', 'Custom']} value="This period" /><Button variant="secondary" icon="download">Export to QuickBooks</Button><Button icon="plus" disabled={!sel.length} onClick={() => setOpen(true)}>Create invoice{sel.length ? ' (' + sel.length + ')' : ''}</Button></>}
      tabs={<Tabs size="sm" value={tab} onChange={setTab} items={[{ value: 'time', label: 'Time entries', count: entries.length }, { value: 'unbilled', label: 'Unbilled', count: unbilled.length }, { value: 'invoices', label: 'Invoices', count: invoices.length }]} />} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--grid-gap)', marginBottom: 'var(--grid-gap)' }}>
        <Stat label="Unbilled hours" value={unbilled.reduce((a, e) => a + e.hours, 0).toFixed(1)} unit="h" hint={unbilled.length + ' entries'} icon="clock" />
        <Stat label="Unbilled amount" value={money(unbilled.reduce((a, e) => a + e.hours * e.rate, 0))} delta="+$1,940" deltaTone="warning" hint="since Friday" icon="receipt" />
        <Stat label="Invoiced MTD" value="$24,635" delta="+12%" deltaTone="success" hint="vs Aug" icon="trending-up" />
        <Stat label="Overdue" value={money(invoices.filter((i) => i.status === 'Overdue').reduce((a, i) => a + i.amount, 0))} delta="1 invoice" deltaTone="danger" hint="INV-2041 · 9 days" icon="alert-circle" />
      </div>
      {tab === 'invoices' ? (
        <Card title="Invoices" meta={invoices.length + ' this quarter'} flush><DataTable columns={invCols} rows={invoices} /></Card>
      ) : (
        <Card title={tab === 'unbilled' ? 'Unbilled time' : 'Time entries'} meta="Select entries from one project to invoice them together" flush actions={<><Button variant="secondary" size="sm" icon="check-check" onClick={() => toast({ tone: 'success', title: 'Timesheets approved', description: '4 entries for Sep 14' })}>Approve week</Button></>}
          footer={sel.length ? <><span>{sel.length} selected · <span className="mono">{chosen.reduce((a, e) => a + e.hours, 0).toFixed(1)} h</span> · <span className="mono" style={{ color: 'var(--color-text)' }}>{money(total)}</span></span><span style={{ flex: 1 }} /><Button variant="ghost" size="sm" onClick={() => setSel([])}>Clear</Button><Button size="sm" icon="receipt" onClick={() => setOpen(true)}>Create invoice</Button></> : null}>
          <DataTable columns={timeCols} rows={tab === 'unbilled' ? unbilled : entries} selectable selected={sel} onSelect={setSel} />
        </Card>
      )}
      {open ? <Dialog title="Create invoice" description={'Riverside Interchange · Meridian DOT · ' + chosen.length + ' time entries'} onClose={() => setOpen(false)} width={520}
        actions={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button icon="receipt" onClick={create}>Create draft — {money(total)}</Button></>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Invoice date"><Input mono defaultValue="Sep 14, 2026" icon="calendar" /></Field>
          <Field label="Terms"><Select value="Net 30" options={['Net 15', 'Net 30', 'Net 45', 'Due on receipt']} /></Field>
          <Field label="PO number"><Input mono placeholder="Optional" /></Field>
          <Field label="Template"><Select value="Standard — itemized" options={['Standard — itemized', 'Summary by task', 'DOT format']} /></Field>
        </div>
        <div style={{ marginTop: 14, borderTop: '2px solid var(--color-divider)' }}>{chosen.map((e) => <div key={e.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--color-hairline)', fontSize: 'var(--text-xs)' }}><span className="mono" style={{ color: 'var(--color-text-3)' }}>{e.date}</span><span style={{ flex: 1 }}>{D.tech[e.tech].name} · {e.task}</span><span className="mono">{e.hours.toFixed(1)} h × {'$' + e.rate}</span><span className="mono" style={{ width: 70, textAlign: 'right' }}>{money(e.hours * e.rate)}</span></div>)}</div>
      </Dialog> : null}
    </Page>
  )
}
