import React, { useState } from 'react'
import { Page, Status } from '../app/shell.jsx'
import { Button } from '../ds/core/Button.jsx'
import { Badge } from '../ds/core/Badge.jsx'
import { Avatar } from '../ds/core/Avatar.jsx'
import { Icon } from '../ds/core/Icon.jsx'
import { Segmented } from '../ds/forms/Segmented.jsx'
import { Field } from '../ds/forms/Field.jsx'
import { Input } from '../ds/forms/Input.jsx'
import { Select } from '../ds/forms/Select.jsx'
import { Checkbox } from '../ds/forms/Checkbox.jsx'
import { Switch } from '../ds/forms/Switch.jsx'
import { Card } from '../ds/data/Card.jsx'
import { DataTable } from '../ds/data/DataTable.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'
import { Tabs } from '../ds/navigation/Tabs.jsx'

export function FieldTest({ toast }) {
  const [tab, setTab] = useState('fresh')
  const [v, setV] = useState({ slump: '4.25', air: '5.8', temp: '74', ambient: '81', unit: '146.2', location: 'Pier cap 3, east half', element: 'Pier cap', mix: 'MX-4500-AE', ticket: '88213', batch: '07:05', placed: '07:48', cure: 'field' })
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e && e.target ? e.target.value : e }))
  const spec = [
    { k: 'slump', label: 'Slump', unit: 'in', min: 3, max: 5, method: 'C143' },
    { k: 'air', label: 'Air content', unit: '%', min: 4.5, max: 7.5, method: 'C231' },
    { k: 'temp', label: 'Concrete temp', unit: '°F', min: 50, max: 90, method: 'C1064' },
    { k: 'unit', label: 'Unit weight', unit: 'pcf', min: 140, max: 150, method: 'C138' },
  ]
  const check = (s) => { const n = parseFloat(v[s.k]); if (isNaN(n)) return null; return n >= s.min && n <= s.max }
  const fails = spec.filter((s) => check(s) === false).length
  const cylinders = [
    { id: '24-0187-C3-01', size: '4×8', age: 7, cure: 'Field', status: 'Cast' },
    { id: '24-0187-C3-02', size: '4×8', age: 28, cure: 'Field', status: 'Cast' },
    { id: '24-0187-C3-03', size: '4×8', age: 28, cure: 'Field', status: 'Cast' },
    { id: '24-0187-C3-04', size: '4×8', age: 28, cure: 'Field', status: 'Cast' },
    { id: '24-0187-C3-05', size: '4×8', age: 56, cure: 'Hold', status: 'Cast' },
  ]
  const num = (k, unit, s) => <Input mono unit={unit} align="right" value={v[k]} onChange={set(k)} invalid={s && check(s) === false} />
  return (
    <Page asideWidth={340} header={<PageHeader breadcrumbs={['Field tests', 'WO-3182']} kicker="Field test · WO-3182" title="Concrete placement — pier cap 3" badge={<Status value="In progress" />}
      meta={<><span>Riverside Interchange · Meridian DOT</span><span>Mon, Sep 14 · Tom Okafor</span><span>ASTM C31 / C143 / C231 / C1064 / C138</span></>}
      actions={<><Button variant="secondary" icon="camera">Photos <span className="mono" style={{ color: 'var(--color-text-3)' }}>12</span></Button><Button variant="secondary" icon="save" onClick={() => toast({ title: 'Draft saved', description: 'Synced 2 seconds ago' })}>Save draft</Button><Button icon="send" onClick={() => toast({ tone: 'success', title: 'Submitted to lab', description: '5 cylinders queued for receipt · report draft created' })}>Submit to lab</Button></>}
      tabs={<Tabs size="sm" value={tab} onChange={setTab} items={[{ value: 'placement', label: 'Placement' }, { value: 'fresh', label: 'Fresh concrete', count: fails || undefined }, { value: 'cylinders', label: 'Cylinders', count: cylinders.length }, { value: 'notes', label: 'Notes & photos' }]} />} />}
      aside={<div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500, marginBottom: 10 }}>Spec check · MX-4500-AE</div>
          {spec.map((s) => { const ok = check(s); return (
            <div key={s.k} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-hairline)' }}>
              <div><div style={{ fontSize: 'var(--text-sm)' }}>{s.label}</div><div className="mono" style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>{s.method} · {s.min}–{s.max} {s.unit}</div></div>
              <span className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{v[s.k]} <span style={{ color: 'var(--color-text-3)', fontWeight: 400 }}>{s.unit}</span></span>
              {ok == null ? <Badge size="sm">—</Badge> : <Badge size="sm" tone={ok ? 'success' : 'danger'} dot>{ok ? 'Pass' : 'Fail'}</Badge>}
            </div>
          ) })}
          {fails ? <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 'var(--text-xs)', color: 'var(--color-danger-text)' }}><Icon name="alert-triangle" size={14} style={{ marginTop: 1 }} /><span>{fails} result{fails > 1 ? 's' : ''} outside spec — the PM is notified on submit.</span></div> : null}
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500, marginBottom: 10 }}>Sync</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}><Icon name="cloud-check" size={14} color="var(--color-success-text)" />Synced from field device · 2 min ago</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', marginTop: 6 }}><Icon name="map-pin" size={14} />Geotagged at placement · 41.6923, −93.7148</div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500, marginBottom: 10 }}>Sign-off</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, boxShadow: '0 0 0 1px var(--color-hairline)' }}><Avatar name="Tom Okafor" size="sm" /><div style={{ flex: 1 }}><div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Tom Okafor</div><div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>ACI Grade I · signed 08:31</div></div><Icon name="check-circle-2" size={16} color="var(--color-success-text)" /></div>
        </div>
      </div>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-gap)', maxWidth: 920 }}>
        {tab === 'placement' || tab === 'fresh' ? (
          <Card title="Placement" meta="Where and what was poured">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              <Field label="Location" required style={{ gridColumn: 'span 2' }}><Input value={v.location} onChange={set('location')} /></Field>
              <Field label="Element"><Select value={v.element} onChange={set('element')} options={['Pier cap', 'Footing', 'Column', 'Deck', 'Slab on grade', 'Wall']} /></Field>
              <Field label="Mix design" required><Input mono value={v.mix} onChange={set('mix')} /></Field>
              <Field label="Truck / ticket no."><Input mono prefix="#" value={v.ticket} onChange={set('ticket')} /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><Field label="Batched"><Input mono value={v.batch} onChange={set('batch')} /></Field><Field label="Placed" hint="Elapsed 0:43"><Input mono value={v.placed} onChange={set('placed')} /></Field></div>
            </div>
          </Card>
        ) : null}
        {tab === 'fresh' ? (
          <Card title="Fresh concrete properties" meta="Recorded at the point of placement" actions={<Segmented size="sm" options={['US', 'SI']} value="US" />}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
              <Field label="Slump" hint="ASTM C143">{num('slump', 'in', spec[0])}</Field>
              <Field label="Air content" hint="ASTM C231 — pressure">{num('air', '%', spec[1])}</Field>
              <Field label="Concrete temp" hint="ASTM C1064">{num('temp', '°F', spec[2])}</Field>
              <Field label="Ambient temp">{num('ambient', '°F')}</Field>
              <Field label="Unit weight" hint="ASTM C138">{num('unit', 'pcf', spec[3])}</Field>
              <Field label="Water added on site"><Input mono unit="gal" align="right" defaultValue="0" /></Field>
              <Field label="Weather"><Select value="Clear" options={['Clear', 'Overcast', 'Rain', 'Wind']} /></Field>
              <Field label="Curing"><Segmented block options={[{ value: 'field', label: 'Field' }, { value: 'lab', label: 'Lab' }]} value={v.cure} onChange={set('cure')} /></Field>
            </div>
          </Card>
        ) : null}
        {tab === 'cylinders' || tab === 'fresh' ? (
          <Card title="Cylinders cast" meta="Set C3 · 5 specimens · 4×8 in" flush actions={<><Button variant="secondary" size="sm" icon="printer">Print labels</Button><Button variant="secondary" size="sm" icon="plus">Add cylinder</Button></>}>
            <DataTable dense columns={[
              { key: 'id', label: 'Specimen', mono: true, strong: true },
              { key: 'size', label: 'Size', mono: true },
              { key: 'age', label: 'Break age', mono: true, align: 'right', render: (r) => r.age + ' d' },
              { key: 'due', label: 'Break due', mono: true, render: (r) => (r.age === 7 ? 'Sep 21' : r.age === 28 ? 'Oct 12' : 'Nov 09') },
              { key: 'cure', label: 'Cure', render: (r) => <Badge size="sm" tone={r.cure === 'Hold' ? 'neutral' : 'accent'}>{r.cure}</Badge> },
              { key: 'status', label: 'Status', render: () => <Badge size="sm" dot>Cast</Badge> },
            ]} rows={cylinders} />
          </Card>
        ) : null}
        {tab === 'notes' ? (
          <Card title="Notes & photos" meta="12 photos · geotagged">
            <Field label="Field notes"><Input multiline rows={4} defaultValue="Pump placement, east half only. Slight rain 07:20–07:30, no water added. Vibration adequate; no honeycombing observed on the visible face." /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginTop: 12 }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ aspectRatio: '4 / 3', background: 'repeating-linear-gradient(135deg, var(--color-surface-2) 0 6px, var(--color-surface-3) 6px 7px)', display: 'flex', alignItems: 'flex-end', padding: 6 }}><span className="mono" style={{ fontSize: 9, color: 'var(--color-text-3)' }}>IMG_08{31 + i}</span></div>)}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}><Checkbox checked label="Include photos in report" /><Switch checked label="Notify PM on submit" /></div>
          </Card>
        ) : null}
      </div>
    </Page>
  )
}
