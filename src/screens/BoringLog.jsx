import React, { useState } from 'react'
import { Page, Status } from '../app/shell.jsx'
import { Button } from '../ds/core/Button.jsx'
import { IconButton } from '../ds/core/IconButton.jsx'
import { Tag } from '../ds/core/Tag.jsx'
import { Segmented } from '../ds/forms/Segmented.jsx'
import { Field } from '../ds/forms/Field.jsx'
import { Input } from '../ds/forms/Input.jsx'
import { Select } from '../ds/forms/Select.jsx'
import { Card } from '../ds/data/Card.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'

export function BoringLog({ navigate, toast }) {
  const layers = [
    { top: 0, bottom: 1.5, uscs: 'TOPSOIL', color: 'Dark brown', desc: 'Silty topsoil with roots and organics', shade: 'var(--color-neutral-700)', n: null },
    { top: 1.5, bottom: 6, uscs: 'CL', color: 'Brown', desc: 'Lean CLAY, trace sand, moist, medium stiff', shade: 'var(--color-neutral-500)', n: 7 },
    { top: 6, bottom: 12.5, uscs: 'SC', color: 'Reddish brown', desc: 'Clayey SAND, fine to medium, moist, medium dense', shade: 'var(--color-neutral-400)', n: 18 },
    { top: 12.5, bottom: 21, uscs: 'SP', color: 'Gray', desc: 'Poorly graded SAND, medium to coarse, wet below 14 ft, dense', shade: 'var(--color-neutral-300)', n: 34 },
    { top: 21, bottom: 26.5, uscs: 'GP', color: 'Gray', desc: 'Poorly graded GRAVEL with sand, wet, very dense', shade: 'var(--color-neutral-200)', n: 52 },
    { top: 26.5, bottom: 30, uscs: 'ROCK', color: 'Gray', desc: 'Weathered LIMESTONE, auger refusal at 30.0 ft', shade: 'var(--color-neutral-600)', n: null },
  ]
  const samples = [
    { depth: 2.5, id: 'SS-1', type: 'SPT', blows: '2-3-4', n: 7, rec: '78%', mc: '21.4', rows: 'CL' },
    { depth: 5.0, id: 'SS-2', type: 'SPT', blows: '3-4-5', n: 9, rec: '83%', mc: '19.8', rows: 'CL' },
    { depth: 7.5, id: 'SS-3', type: 'SPT', blows: '6-8-10', n: 18, rec: '89%', mc: '14.2', rows: 'SC' },
    { depth: 10.0, id: 'ST-1', type: 'Shelby', blows: '—', n: null, rec: '100%', mc: '13.9', rows: 'SC' },
    { depth: 15.0, id: 'SS-4', type: 'SPT', blows: '12-16-18', n: 34, rec: '72%', mc: '22.6', rows: 'SP' },
    { depth: 20.0, id: 'SS-5', type: 'SPT', blows: '14-17-20', n: 37, rec: '67%', mc: '23.1', rows: 'SP' },
    { depth: 25.0, id: 'SS-6', type: 'SPT', blows: '20-25-27', n: 52, rec: '56%', mc: '11.0', rows: 'GP' },
    { depth: 29.5, id: 'SS-7', type: 'SPT', blows: '50/4"', n: null, rec: '30%', mc: '—', rows: 'ROCK' },
  ]
  const [sel, setSel] = useState(2)
  const L = layers[sel]
  const total = 30, px = 18 // px per foot
  return (
    <Page asideWidth={360} header={<PageHeader breadcrumbs={['Boring logs', '24-0221 Lakeview Elementary']} kicker="Boring log" title="B-07" badge={<Status value="In progress" />}
      meta={<><span>Lakeview Elementary · USD 4</span><span>CME-55 track rig · Driller: R. Vance · Logged by Grace Lindqvist</span><span>Sep 12 · GW at 14.0 ft (24 h)</span></>}
      actions={<><Segmented size="sm" options={['B-06', 'B-07', 'B-08']} value="B-07" /><Button variant="secondary" icon="download" onClick={() => toast({ tone: 'success', title: 'PDF exported', description: 'B-07 boring log, 4 pages' })}>Export PDF</Button><Button icon="send" onClick={() => navigate('reports')}>Submit for review</Button></>} />}
      aside={<div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500 }}>Stratum {sel + 1} of {layers.length}</span><span style={{ flex: 1 }} /><IconButton icon="chevron-up" label="Previous" size="sm" onClick={() => setSel(Math.max(0, sel - 1))} /><IconButton icon="chevron-down" label="Next" size="sm" onClick={() => setSel(Math.min(layers.length - 1, sel + 1))} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Top"><Input mono unit="ft" align="right" defaultValue={L.top.toFixed(1)} key={'t' + sel} /></Field>
          <Field label="Bottom"><Input mono unit="ft" align="right" defaultValue={L.bottom.toFixed(1)} key={'b' + sel} /></Field>
          <Field label="USCS"><Select value={L.uscs} options={['TOPSOIL', 'CL', 'CH', 'ML', 'SC', 'SM', 'SP', 'SW', 'GP', 'GW', 'ROCK']} key={'u' + sel} /></Field>
          <Field label="Color"><Input defaultValue={L.color} key={'c' + sel} /></Field>
          <Field label="Moisture"><Segmented block size="sm" options={['Dry', 'Moist', 'Wet']} value={L.desc.includes('wet') || L.desc.includes('Wet') ? 'Wet' : L.desc.includes('moist') ? 'Moist' : 'Dry'} /></Field>
          <Field label="Consistency / density"><Select value="Medium dense" options={['Very soft', 'Soft', 'Medium stiff', 'Stiff', 'Very stiff', 'Very loose', 'Loose', 'Medium dense', 'Dense', 'Very dense']} /></Field>
        </div>
        <Field label="Description"><Input multiline rows={3} defaultValue={L.desc} key={'d' + sel} /></Field>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><Tag icon="droplets">GW 14.0 ft</Tag><Tag icon="ruler">Refusal 30.0 ft</Tag><Tag icon="test-tubes">8 samples</Tag></div>
        <Button variant="secondary" block icon="plus">Add stratum below</Button>
      </div>}>
      <Card flush title="Log" meta="Depth in feet · N = SPT blows per 12 in · 140 lb automatic hammer">
        <div style={{ display: 'grid', gridTemplateColumns: '56px 64px minmax(0, 1fr)', borderTop: '2px solid var(--color-divider)' }}>
          <div style={{ padding: '8px 10px', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-2)', fontWeight: 600, borderBottom: '2px solid var(--color-divider)' }}>Depth</div>
          <div style={{ padding: '8px 10px', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-2)', fontWeight: 600, borderBottom: '2px solid var(--color-divider)', borderLeft: '1px solid var(--color-hairline)' }}>Log</div>
          <div style={{ display: 'grid', gridTemplateColumns: '64px 70px 80px 60px 60px minmax(0, 1fr)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-2)', fontWeight: 600, borderBottom: '2px solid var(--color-divider)', borderLeft: '1px solid var(--color-hairline)' }}>{['Sample', 'Type', 'Blows/6 in', 'N', 'Rec', 'Description'].map((h) => <div key={h} style={{ padding: '8px 10px' }}>{h}</div>)}</div>
          <div style={{ position: 'relative', height: total * px, borderRight: '1px solid var(--color-hairline)' }}>
            {Array.from({ length: total / 5 + 1 }).map((_, i) => <div key={i} className="mono" style={{ position: 'absolute', top: i * 5 * px - 7, right: 8, fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>{i * 5}</div>)}
            <div style={{ position: 'absolute', top: 14 * px, left: 0, right: 0, borderTop: '1px dashed var(--color-accent-text)' }}><span style={{ position: 'absolute', left: 6, top: -14, fontSize: 9, color: 'var(--color-accent-text)', fontFamily: 'var(--font-mono)' }}>▽ GW</span></div>
          </div>
          <div style={{ position: 'relative', height: total * px, borderRight: '1px solid var(--color-hairline)' }}>
            {layers.map((l, i) => <button key={i} type="button" onClick={() => setSel(i)} title={l.uscs} style={{ position: 'absolute', top: l.top * px, height: (l.bottom - l.top) * px, left: 8, right: 8, background: 'repeating-linear-gradient(' + (i % 2 ? '45deg' : '135deg') + ', ' + l.shade + ' 0 3px, transparent 3px 7px)', border: 0, borderTop: '1px solid var(--color-divider)', outline: sel === i ? '2px solid var(--color-accent)' : 'none', outlineOffset: -1, cursor: 'pointer' }} />)}
          </div>
          <div style={{ position: 'relative', height: total * px }}>
            {layers.map((l, i) => <div key={i} onClick={() => setSel(i)} style={{ position: 'absolute', top: l.top * px, height: (l.bottom - l.top) * px, left: 0, right: 0, borderTop: '1px solid var(--color-divider)', background: sel === i ? 'var(--color-selected)' : 'transparent', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', left: 344, right: 12, top: 6, fontSize: 'var(--text-xs)', lineHeight: 1.35, color: sel === i ? 'var(--color-text)' : 'var(--color-text-2)' }}><span className="mono" style={{ color: 'var(--color-text)', fontWeight: 500 }}>{l.uscs}</span> — {l.desc}</div>
            </div>)}
            {samples.map((s) => <div key={s.id} className="mono" style={{ position: 'absolute', top: s.depth * px - 9, left: 0, width: 334, display: 'grid', gridTemplateColumns: '64px 70px 80px 60px 60px', fontSize: 'var(--text-xs)', fontFeatureSettings: 'var(--font-numeric)' }}>
              <div style={{ padding: '0 10px', fontWeight: 500 }}>{s.id}</div><div style={{ padding: '0 10px', color: 'var(--color-text-2)' }}>{s.type}</div><div style={{ padding: '0 10px', color: 'var(--color-text-2)' }}>{s.blows}</div><div style={{ padding: '0 10px', color: s.n == null ? 'var(--color-text-3)' : 'var(--color-text)' }}>{s.n == null ? '—' : s.n}</div><div style={{ padding: '0 10px', color: 'var(--color-text-2)' }}>{s.rec}</div>
            </div>)}
          </div>
        </div>
      </Card>
    </Page>
  )
}
