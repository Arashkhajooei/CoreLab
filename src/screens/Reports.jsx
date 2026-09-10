import React, { useState } from 'react'
import { Page, Status, persist } from '../app/shell.jsx'
import { D } from '../data/corelab.js'
import { supabase } from '../lib/supabase'
import { Button } from '../ds/core/Button.jsx'
import { IconButton } from '../ds/core/IconButton.jsx'
import { Badge } from '../ds/core/Badge.jsx'
import { Avatar } from '../ds/core/Avatar.jsx'
import { Icon } from '../ds/core/Icon.jsx'
import { Tag } from '../ds/core/Tag.jsx'
import { Input } from '../ds/forms/Input.jsx'
import { Checkbox } from '../ds/forms/Checkbox.jsx'
import { DataTable } from '../ds/data/DataTable.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'
import { Tabs } from '../ds/navigation/Tabs.jsx'
import { Dialog } from '../ds/feedback/Dialog.jsx'
import { EmptyState } from '../ds/feedback/EmptyState.jsx'

export function Reports({ toast }) {
  const [tab, setTab] = useState('Pending review')
  const [reports, setReports] = useState(D.reports)
  const [active, setActive] = useState('24-0187-R04')
  const [confirm, setConfirm] = useState(false)
  const rows = reports.filter((r) => r.status === tab)
  const cur = reports.find((r) => r.id === active) || rows[0]
  const count = (s) => reports.filter((r) => r.status === s).length
  const setStatus = (status) => {
    setReports((rs) => rs.map((r) => (r.id === cur.id ? { ...r, status } : r)))
    persist(supabase.from('reports').update({ status }).eq('id', cur.id), toast, cur.id)
  }
  const approve = () => { setStatus('Delivered'); setConfirm(false); toast({ tone: 'success', title: 'Report delivered', description: cur.id + ' sent to 3 recipients at ' + D.project[cur.project].client }) }
  const reject = () => { setStatus('Rejected'); toast({ tone: 'warning', title: 'Returned to author', description: cur.id + ' → ' + (D.tech[cur.author]?.name ?? 'the author') + ' with your comments' }) }
  const cols = [
    { key: 'id', label: 'Report', mono: true, strong: true },
    { key: 'title', label: 'Title', width: 280, ellipsis: true },
    { key: 'project', label: 'Project', muted: true, render: (r) => D.project[r.project].name },
    { key: 'type', label: 'Type', render: (r) => <Badge size="sm">{r.type}</Badge> },
    { key: 'author', label: 'Author', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={D.tech[r.author].name} size="xs" />{D.tech[r.author].name}</span> },
    { key: 'submitted', label: 'Submitted', mono: true, muted: true },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
  ]
  const paper = { fontFamily: 'var(--font-body)', color: 'var(--color-text)', background: 'var(--color-surface)', padding: 22, fontSize: 10, lineHeight: 1.5, boxShadow: 'var(--shadow-md)' }
  return (
    <Page padded={false} asideWidth={420} header={<PageHeader title="Review & deliver" meta={<><span>Signing as Dana Whitfield, P.E. — Lab manager</span><span>{count('Pending review')} awaiting review</span></>}
      actions={<><Input icon="search" placeholder="Report, project…" style={{ width: 240 }} /><Button variant="secondary" icon="filter">Filters</Button><Button variant="secondary" icon="settings-2">Delivery rules</Button></>}
      tabs={<Tabs size="sm" value={tab} onChange={setTab} items={['Pending review', 'Approved', 'Delivered', 'Rejected'].map((s) => ({ value: s, label: s, count: count(s) || undefined }))} />} />}
      aside={cur ? <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-hairline)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}><div className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{cur.id}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>{cur.pages} pages · rev 2 · PDF 412 KB</div></div>
          <IconButton icon="message-square" label="Comments" size="sm" /><IconButton icon="download" label="Download" size="sm" /><IconButton icon="maximize-2" label="Open full preview" size="sm" />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 16, background: 'var(--color-bg)' }}>
          <div data-theme="light" style={paper}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-divider)', paddingBottom: 6 }}><div><div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>Northline Geotechnical</div><div style={{ color: 'var(--color-text-2)' }}>3800 Industrial Pkwy · Fairmont</div></div><div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-text-2)' }}>{cur.id}<br />Page 1 of {cur.pages}</div></div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13, margin: '12px 0 2px' }}>{cur.title}</div>
            <div style={{ color: 'var(--color-text-2)' }}>{D.project[cur.project].name} · Project {cur.project} · Client: {D.project[cur.project].client}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 9 }}>
              <thead><tr>{['Specimen', 'Age', 'Load (lbf)', 'Strength (psi)', 'Spec', 'Result'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '4px 6px', borderBottom: '2px solid var(--color-divider)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 8, color: 'var(--color-text-2)' }}>{h}</th>)}</tr></thead>
              <tbody>{[['S-0399', '28', '51,800', '4,120', '4,000', 'Pass'], ['S-0400', '28', '48,760', '3,880', '4,000', 'Pass*'], ['S-0401', '28', '52,410', '4,170', '4,000', 'Pass']].map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} style={{ padding: '4px 6px', borderBottom: '1px solid var(--color-hairline)', color: c.startsWith('Pass') ? 'var(--color-success-text)' : undefined }}>{c}</td>)}</tr>)}</tbody>
            </table>
            <div style={{ marginTop: 8, color: 'var(--color-text-2)' }}>* Individual result below f'c; set average 4,057 psi meets ACI 318 §26.12.3 acceptance criteria.</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 8, borderTop: '1px solid var(--color-hairline)', color: 'var(--color-text-2)' }}><span>Tested by: {D.tech[cur.author].name}</span><span style={{ fontFamily: 'var(--font-mono)' }}>Reviewed by: ________</span></div>
          </div>
        </div>
        {cur.status === 'Pending review' ? <div style={{ padding: 12, borderTop: '1px solid var(--color-hairline)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Checkbox checked label="I have reviewed the data and calculations" />
          <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" icon="undo-2" onClick={reject} style={{ flex: 1 }}>Return</Button><Button icon="check" style={{ flex: 2 }} onClick={() => setConfirm(true)}>Approve and deliver</Button></div>
        </div> : <div style={{ padding: 12, borderTop: '1px solid var(--color-hairline)', display: 'flex', gap: 8, alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}><Icon name="check-circle-2" size={14} color="var(--color-success-text)" />{cur.status} · signed by Dana Whitfield, P.E.</div>}
      </div> : null}>
      {rows.length === 0 ? <div style={{ padding: 24 }}><EmptyState icon="file-check-2" title={'No reports ' + tab.toLowerCase()} description="Reports move here as reviewers act on them." /></div> : <DataTable columns={cols} rows={rows} activeKey={cur && cur.id} onRowClick={(r) => setActive(r.id)} stickyHeader />}
      {confirm && cur ? <Dialog title="Approve and deliver?" description={cur.id + ' will be locked, signed as Dana Whitfield, P.E., and emailed to the distribution list for ' + D.project[cur.project].name + '.'} onClose={() => setConfirm(false)}
        actions={<><Button variant="secondary" onClick={() => setConfirm(false)}>Cancel</Button><Button icon="send" onClick={approve}>Approve and deliver</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500 }}>Recipients</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><Tag icon="mail">j.alvarez@meridiandot.gov</Tag><Tag icon="mail">inspections@meridiandot.gov</Tag><Tag icon="mail">marcus.lee@northline.com</Tag></div><Checkbox checked label="Attach field photos (12)" /><Checkbox label="Also deliver to the project portal" /></div>
      </Dialog> : null}
    </Page>
  )
}
