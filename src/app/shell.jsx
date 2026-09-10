import React from 'react'
import { Badge } from '../ds/core/Badge.jsx'

// Standard screen layout: fixed header, scrolling body, optional right aside.
export function Page({ header, children, aside, asideWidth = 360, padded = true }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {header}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: padded ? 'var(--page-py) var(--page-px)' : 0 }}>{children}</div>
        {aside ? <aside style={{ width: asideWidth, flex: 'none', borderLeft: '2px solid var(--color-divider)', overflow: 'auto', background: 'var(--color-surface)' }}>{aside}</aside> : null}
      </div>
    </div>
  )
}

export const statusTone = (s) => {
  // Calibration due dates vary ("Due in 6 days"), so match the family, not one literal.
  if (typeof s === 'string' && s.startsWith('Due in')) return 'warning'
  return TONES[s] || 'neutral'
}

const TONES = {
  'In progress': 'accent', Dispatched: 'accent', Scheduled: 'neutral', Unassigned: 'warning', Complete: 'success', Submitted: 'accent',
  'Pending review': 'warning', Approved: 'success', Delivered: 'success', Rejected: 'danger',
  'Due today': 'warning', 'In test': 'accent', Received: 'neutral', Tested: 'success', Curing: 'neutral',
  Unbilled: 'warning', Invoiced: 'success', Sent: 'accent', Paid: 'success', Overdue: 'danger', Void: 'neutral',
  Current: 'success', 'Expiring soon': 'warning', Expired: 'danger',
  Active: 'success', Closeout: 'neutral', 'On hold': 'warning',
}

export function Status({ value, size }) {
  return (
    <Badge tone={statusTone(value)} dot size={size}>
      {value}
    </Badge>
  )
}

export const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

// Screens update local state optimistically; this writes the same change through and
// only speaks up if the write fails, so a silent desync can't happen.
export async function persist(query, toast, what) {
  const { error } = await query
  if (error && toast) toast({ tone: 'danger', title: "Couldn't save", description: `${what}: ${error.message}` })
  return !error
}
