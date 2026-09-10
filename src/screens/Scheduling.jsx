import React, { useState } from 'react'
import { Page, Status } from '../app/shell.jsx'
import { D } from '../data/corelab.js'
import { Button } from '../ds/core/Button.jsx'
import { IconButton } from '../ds/core/IconButton.jsx'
import { Badge } from '../ds/core/Badge.jsx'
import { Avatar } from '../ds/core/Avatar.jsx'
import { Tag } from '../ds/core/Tag.jsx'
import { Segmented } from '../ds/forms/Segmented.jsx'
import { Field } from '../ds/forms/Field.jsx'
import { Select } from '../ds/forms/Select.jsx'
import { Dialog } from '../ds/feedback/Dialog.jsx'
import { EmptyState } from '../ds/feedback/EmptyState.jsx'
import { PageHeader } from '../ds/navigation/PageHeader.jsx'

export function Scheduling({ toast }) {
  const [view, setView] = useState('Week')
  const [open, setOpen] = useState(null)
  const [assign, setAssign] = useState('')
  const [orders, setOrders] = useState(D.workOrders)
  const unassigned = orders.filter((w) => !w.tech)
  const blockTone = (s) => (s === 'In progress' ? { bg: 'var(--color-accent-tint-strong)', rule: 'var(--color-accent)' } : s === 'Dispatched' ? { bg: 'var(--color-accent-tint)', rule: 'var(--color-accent)' } : s === 'Complete' ? { bg: 'var(--color-success-tint)', rule: 'var(--color-success)' } : { bg: 'var(--color-surface-2)', rule: 'var(--color-neutral-600)' })
  const dispatch = (wo, techId) => {
    setOrders((os) => os.map((o) => (o.id === wo.id ? { ...o, tech: techId, status: 'Dispatched' } : o)))
    setOpen(null)
    setAssign('')
    toast({ tone: 'accent', title: 'Work order dispatched', description: wo.id + ' → ' + D.tech[techId].name + ', ' + D.days[wo.day] + ' ' + wo.start })
  }
  const cell = { borderLeft: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)', padding: 6, minHeight: 84, display: 'flex', flexDirection: 'column', gap: 6 }
  return (
    <Page padded={false} header={<PageHeader title="Scheduling & dispatch" meta={<><span>Week of Sep 14</span><span>{orders.length} work orders · {unassigned.length} unassigned</span></>}
      actions={<>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}><IconButton icon="chevron-left" label="Previous week" /><Button variant="secondary" size="sm">Today</Button><IconButton icon="chevron-right" label="Next week" /></div>
        <Segmented size="sm" options={['Day', 'Week', 'Month']} value={view} onChange={setView} />
        <Button variant="secondary" icon="filter">Filters</Button>
        <Button icon="plus" onClick={() => toast({ tone: 'neutral', title: 'New work order', description: 'Draft WO-3195 created' })}>New work order</Button>
      </>} />}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', height: '100%' }}>
        <div style={{ borderRight: '2px solid var(--color-divider)', overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><span style={{ fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-3)', fontWeight: 500 }}>Unassigned</span><Badge tone="warning" size="sm">{unassigned.length}</Badge></div>
          {unassigned.length === 0 ? <EmptyState compact icon="check-circle-2" title="Everything is assigned" description="New requests will appear here." /> : unassigned.map((w) => (
            <button key={w.id} type="button" onClick={() => setOpen(w)} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 12, textAlign: 'left', background: 'var(--color-surface)', border: 0, borderLeft: '2px solid var(--color-warning)', boxShadow: '0 0 0 1px var(--color-hairline)', color: 'var(--color-text)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span className="mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>{w.id}</span><span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>{D.days[w.day]} · {w.start}</span></div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{w.test}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)' }}>{D.project[w.project].name} · {w.hours} h</div>
            </button>
          ))}
        </div>
        <div style={{ overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '180px repeat(5, minmax(130px, 1fr))', minWidth: 830 }}>
            <div style={{ padding: '10px 16px', borderBottom: '2px solid var(--color-divider)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-2)', fontWeight: 600, position: 'sticky', top: 0, background: 'var(--color-bg)', zIndex: 1 }}>Technician</div>
            {D.days.map((d, i) => <div key={d} style={{ padding: '10px 12px', borderLeft: '1px solid var(--color-hairline)', borderBottom: '2px solid var(--color-divider)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: i === 0 ? 'var(--color-accent-text)' : 'var(--color-text-2)', fontWeight: 600, position: 'sticky', top: 0, background: 'var(--color-bg)', zIndex: 1 }}>{d}{i === 0 ? ' · today' : ''}</div>)}
            {D.techs.map((t) => {
              const hrs = orders.filter((w) => w.tech === t.id).reduce((a, w) => a + w.hours, 0)
              return (
                <React.Fragment key={t.id}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-hairline)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Avatar name={t.name} size="sm" />
                    <div style={{ minWidth: 0 }}><div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{t.name}</div><div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>{t.role}</div><div className="mono" style={{ fontSize: 'var(--text-2xs)', color: hrs > 36 ? 'var(--color-warning-text)' : 'var(--color-text-3)', marginTop: 4 }}>{hrs} / 40 h</div></div>
                  </div>
                  {D.days.map((d, di) => (
                    <div key={d} style={cell}>
                      {orders.filter((w) => w.tech === t.id && w.day === di).map((w) => {
                        const tone = blockTone(w.status)
                        return (
                          <button key={w.id} type="button" onClick={() => setOpen(w)} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 8px', textAlign: 'left', background: tone.bg, border: 0, borderLeft: '2px solid ' + tone.rule, color: 'var(--color-text)', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><span className="mono" style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-2)' }}>{w.start} · {w.hours}h</span><span className="mono" style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>{w.id}</span></div>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, lineHeight: 1.3 }}>{w.test}</div>
                            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{D.project[w.project].name}</div>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>
      {open ? (
        <Dialog title={open.id + ' — ' + open.test} description={D.project[open.project].name + ' · ' + D.project[open.project].client + ' · ' + D.days[open.day] + ' at ' + open.start + ' · ' + open.hours + ' h'} onClose={() => setOpen(null)} width={520}
          actions={<><Button variant="secondary" onClick={() => setOpen(null)}>Close</Button>{open.tech ? <Button variant="secondary" icon="user-round-x" onClick={() => { setOrders((os) => os.map((o) => (o.id === open.id ? { ...o, tech: null, status: 'Unassigned' } : o))); setOpen(null); toast({ tone: 'warning', title: 'Work order unassigned', description: open.id + ' returned to the queue' }) }}>Unassign</Button> : null}<Button icon="send" disabled={!assign && !open.tech} onClick={() => dispatch(open, assign || open.tech)}>{open.tech ? 'Re-dispatch' : 'Dispatch'}</Button></>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Status"><div style={{ height: 'var(--control-h-md)', display: 'flex', alignItems: 'center' }}><Status value={open.status} /></div></Field>
            <Field label="Assign to" hint="Filtered to certified technicians">
              <Select placeholder={open.tech ? D.tech[open.tech].name : 'Choose a technician'} value={assign} onChange={setAssign} options={D.techs.filter((t) => t.id !== open.tech).map((t) => ({ value: t.id, label: t.name + ' · ' + t.certs[0] }))} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}><Tag icon="map-pin">Site: {D.project[open.project].name}</Tag><Tag icon="clock">{open.hours} h estimate</Tag><Tag icon="file-text">Forms: 3</Tag></div>
        </Dialog>
      ) : null}
    </Page>
  )
}
