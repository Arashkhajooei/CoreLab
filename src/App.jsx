import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { CoreLabMark } from './app/CoreLabMark.jsx'
import { ErrorBoundary } from './app/ErrorBoundary.jsx'
import { D, loadData } from './data/corelab.js'
import { Avatar } from './ds/core/Avatar.jsx'
import { IconButton } from './ds/core/IconButton.jsx'
import { Sidebar } from './ds/navigation/Sidebar.jsx'
import { Toast } from './ds/feedback/Toast.jsx'
import { Tooltip } from './ds/feedback/Tooltip.jsx'
import { Login } from './screens/Login.jsx'
import { Dashboard } from './screens/Dashboard.jsx'
import { Scheduling } from './screens/Scheduling.jsx'
import { FieldTest } from './screens/FieldTest.jsx'
import { BoringLog } from './screens/BoringLog.jsx'
import { LabSamples } from './screens/LabSamples.jsx'
import { Reports } from './screens/Reports.jsx'
import { Billing } from './screens/Billing.jsx'
import { Projects } from './screens/Projects.jsx'
import { Equipment } from './screens/Equipment.jsx'

// Counts come from the loaded data so the nav can't drift from what the screens show.
const buildSections = () => {
  const n = (v) => (v > 0 ? v : undefined)
  const needsCal = D.equipment.filter((e) => e.status === 'Overdue' || String(e.status).startsWith('Due in')).length
  const badCerts = D.certifications.filter((c) => c.status !== 'Current').length
  return [
    { title: 'Operations', items: [
      { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
      { key: 'scheduling', label: 'Scheduling & dispatch', icon: 'calendar-days', count: n(D.workOrders.filter((w) => w.status !== 'Complete').length) },
      { key: 'field', label: 'Field tests', icon: 'clipboard-check', count: n(D.workOrders.filter((w) => w.status === 'In progress').length) },
      { key: 'boring', label: 'Boring logs', icon: 'layers' },
    ] },
    { title: 'Lab', items: [
      { key: 'samples', label: 'Samples', icon: 'flask-conical', count: n(D.samples.filter((s) => s.status !== 'Tested').length) },
      { key: 'reports', label: 'Review & deliver', icon: 'file-check-2', count: n(D.reports.filter((r) => r.status === 'Pending review').length) },
    ] },
    { title: 'Finance', items: [{ key: 'billing', label: 'Timesheets & invoicing', icon: 'receipt', count: n(D.timeEntries.filter((e) => e.status === 'Unbilled').length) }] },
    { title: 'Management', items: [
      { key: 'projects', label: 'Projects', icon: 'folder-kanban', count: n(D.projects.filter((p) => p.status === 'Active').length) },
      { key: 'equipment', label: 'Equipment & certifications', icon: 'badge-check', count: n(needsCal + badCerts) },
    ] },
  ]
}

const screens = { dashboard: Dashboard, scheduling: Scheduling, field: FieldTest, boring: BoringLog, samples: LabSamples, reports: Reports, billing: Billing, projects: Projects, equipment: Equipment }

export function App() {
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const [dataError, setDataError] = useState(null)
  const [route, setRoute] = useState(() => (location.hash || '#dashboard').slice(1))
  const [light, setLight] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // Screens read the D store synchronously, so it must be filled before they mount.
  useEffect(() => {
    if (!session) { setDataReady(false); return }
    let cancelled = false
    loadData()
      .then(() => { if (!cancelled) { setDataError(null); setDataReady(true) } })
      .catch((e) => { if (!cancelled) setDataError(e instanceof Error ? e.message : 'Failed to load data') })
    return () => { cancelled = true }
  }, [session])

  useEffect(() => { location.hash = route }, [route])
  // Keep back/forward and pasted deep links working, not just the initial hash.
  useEffect(() => {
    const onHash = () => setRoute((location.hash || '#dashboard').slice(1))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    if (light) document.documentElement.setAttribute('data-theme', 'light')
    else document.documentElement.removeAttribute('data-theme')
  }, [light])

  const toast = (t) => {
    const id = Date.now() + Math.random()
    setToasts((ts) => [...ts, { ...t, id }])
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4500)
  }

  if (!authReady) {
    return <div style={{ height: '100vh', background: 'var(--color-bg)' }} />
  }
  if (!session) return <Login />
  if (dataError) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', color: 'var(--color-text)', padding: 24 }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-lg)' }}>Couldn't load lab data</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-2)', marginTop: 6 }}>{dataError}</div>
          <button className="cl-retry" onClick={() => location.reload()} style={{ marginTop: 16, padding: '8px 14px', background: 'var(--color-accent)', color: 'var(--color-on-accent)', border: 0, cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Retry</button>
        </div>
      </div>
    )
  }
  if (!dataReady) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'var(--color-bg)', color: 'var(--color-text-3)' }}>
        <CoreLabMark size={40} showWordmark={false} />
        <div style={{ fontSize: 'var(--text-xs)' }}>Loading lab data…</div>
      </div>
    )
  }

  const meta = session.user.user_metadata || {}
  const name = meta.full_name || session.user.email
  const role = meta.role || 'Staff'
  const Screen = screens[route] || Dashboard
  const sections = buildSections()

  return (
    <div style={{ display: 'flex', height: '100vh', minHeight: 0, background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Sidebar brand={<CoreLabMark />} org="Northline Geotechnical" sections={sections} active={route} onSelect={setRoute}
        footer={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={name} size="sm" tone="accent" />
          <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div><div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-3)' }}>{role}</div></div>
          <Tooltip content={light ? 'Dark theme' : 'Light theme'}><IconButton icon={light ? 'moon' : 'sun'} label="Toggle theme" size="sm" onClick={() => setLight((v) => !v)} /></Tooltip>
          <Tooltip content="Sign out"><IconButton icon="log-out" label="Sign out" size="sm" onClick={() => supabase.auth.signOut()} /></Tooltip>
        </div>} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', minHeight: 0 }}>
        <ErrorBoundary resetKey={route}>
          <Screen navigate={setRoute} toast={toast} />
        </ErrorBoundary>
      </main>
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 'var(--z-toast)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map((t) => <Toast key={t.id} tone={t.tone} title={t.title} description={t.description} onDismiss={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} />)}
      </div>
    </div>
  )
}
