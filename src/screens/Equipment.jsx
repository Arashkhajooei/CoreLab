import React, { useState } from 'react'
import { Page, Status } from '../app/shell.jsx'
import { D } from '../data/corelab.js'
import { Button } from '../ds/core/Button.jsx'
import { IconButton } from '../ds/core/IconButton.jsx'
import { Badge } from '../ds/core/Badge.jsx'
import { Avatar } from '../ds/core/Avatar.jsx'
import { Segmented } from '../ds/forms/Segmented.jsx'
import { Card } from '../ds/data/Card.jsx'
import { DataTable } from '../ds/data/DataTable.jsx'
import { Stat } from '../ds/data/Stat.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'
import { Tabs } from '../ds/navigation/Tabs.jsx'

export function Equipment({ toast }) {
  const [tab, setTab] = useState('equipment')
  const eqCols = [
    { key: 'id', label: 'Asset', mono: true, strong: true },
    { key: 'type', label: 'Type' },
    { key: 'model', label: 'Model', muted: true },
    { key: 'serial', label: 'Serial', mono: true, muted: true },
    { key: 'last', label: 'Last calibration', mono: true },
    { key: 'next', label: 'Next due', mono: true, render: (r) => <span style={{ color: r.status === 'Overdue' ? 'var(--color-danger-text)' : r.status.startsWith('Due') ? 'var(--color-warning-text)' : undefined }}>{r.next}</span> },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
    { key: 'a', label: '', align: 'right', render: (r) => <span style={{ display: 'inline-flex', gap: 2 }}><IconButton icon="file-text" label="Certificate" size="sm" /><IconButton icon="calendar-plus" label="Schedule calibration" size="sm" onClick={() => toast({ tone: 'accent', title: 'Calibration scheduled', description: r.id + ' · vendor pickup Thu, Sep 17' })} /></span> },
  ]
  const certCols = [
    { key: 'tech', label: 'Staff', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={D.tech[r.tech].name} size="xs" />{D.tech[r.tech].name}</span> },
    { key: 'cert', label: 'Certification', wrap: true },
    { key: 'issuer', label: 'Issuer', render: (r) => <Badge size="sm">{r.issuer}</Badge> },
    { key: 'expires', label: 'Expires', mono: true, render: (r) => <span style={{ color: r.status === 'Expired' ? 'var(--color-danger-text)' : r.status === 'Expiring soon' ? 'var(--color-warning-text)' : undefined }}>{r.expires}</span> },
    { key: 'status', label: 'Status', render: (r) => <Status value={r.status} /> },
    { key: 'a', label: '', align: 'right', render: (r) => <span style={{ display: 'inline-flex', gap: 2 }}><IconButton icon="upload" label="Upload renewal" size="sm" /><IconButton icon="bell" label="Remind" size="sm" onClick={() => toast({ title: 'Reminder sent', description: D.tech[r.tech].name + ' · ' + r.cert })} /></span> },
  ]
  const eq = D.equipment, certs = D.certifications
  const rank = (s) => (s === 'Overdue' ? 0 : s.startsWith('Due') ? 1 : 2)
  return (
    <Page header={<PageHeader title="Equipment & certifications" meta={<><span>{eq.length} assets · {certs.length} staff certifications</span><span>Accreditation: AASHTO re:source · next assessment Mar 2027</span></>}
      actions={<><Button variant="secondary" icon="download">Calibration records</Button><Button icon="plus" onClick={() => toast({ title: tab === 'equipment' ? 'New asset' : 'New certification', description: 'Form opened' })}>{tab === 'equipment' ? 'Add equipment' : 'Add certification'}</Button></>}
      tabs={<Tabs size="sm" value={tab} onChange={setTab} items={[{ value: 'equipment', label: 'Equipment', count: eq.length }, { value: 'certs', label: 'Certifications', count: certs.length }]} />} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--grid-gap)', marginBottom: 'var(--grid-gap)' }}>
        <Stat label="Calibrations current" value={eq.filter((e) => e.status === 'Current').length + ' / ' + eq.length} hint="assets in service" icon="wrench" />
        <Stat label="Due in 30 days" value={String(eq.filter((e) => e.status.startsWith('Due')).length)} deltaTone="warning" delta="CM-02" hint="compression machine" icon="calendar-clock" />
        <Stat label="Overdue" value={String(eq.filter((e) => e.status === 'Overdue').length)} delta="NG-05" deltaTone="danger" hint="removed from dispatch" icon="alert-circle" />
        <Stat label="Certs expiring ≤ 90 d" value={String(certs.filter((c) => c.status !== 'Current').length)} delta="1 expired" deltaTone="danger" hint="renewals requested" icon="badge-check" />
      </div>
      {tab === 'equipment' ? (
        <Card title="Calibration schedule" meta="Sorted by next due date" flush actions={<Segmented size="sm" options={['All', 'Field', 'Lab']} value="All" />}>
          <DataTable columns={eqCols} rows={[...eq].sort((a, b) => rank(a.status) - rank(b.status))} />
        </Card>
      ) : (
        <Card title="Staff certifications" meta="Dispatch checks these before assigning work" flush actions={<Segmented size="sm" options={['All', 'Expiring', 'Expired']} value="All" />}>
          <DataTable columns={certCols} rows={certs} />
        </Card>
      )}
    </Page>
  )
}
