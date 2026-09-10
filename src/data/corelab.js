/* CoreLab operational data, loaded from Supabase.
   `D` keeps the exact shape the screens were written against (the design's
   window.CLData), so screens read D.projects / D.tech[id] / D.days unchanged.
   App.jsx awaits loadData() before rendering any screen, so every screen's
   useState(D.x) initialiser sees populated data. */
import { supabase } from '../lib/supabase'

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]))
const num = (v) => (v == null ? 0 : Number(v))

export const D = {
  techs: [],
  projects: [],
  workOrders: [],
  samples: [],
  reports: [],
  timeEntries: [],
  invoices: [],
  equipment: [],
  certifications: [],
  tech: {},
  project: {},
  days: ['Mon 14', 'Tue 15', 'Wed 16', 'Thu 17', 'Fri 18'],
}

const statusRank = { Active: 0, Closeout: 1, 'On hold': 2 }

export async function loadData() {
  const tables = ['staff', 'projects', 'work_orders', 'samples', 'reports', 'time_entries', 'invoices', 'equipment', 'certifications']
  const results = await Promise.all(tables.map((t) => supabase.from(t).select('*')))
  const failed = results.find((r) => r.error)
  if (failed) throw new Error(failed.error.message)
  const [staff, projects, workOrders, samples, reports, timeEntries, invoices, equipment, certifications] = results.map((r) => r.data ?? [])

  D.techs = staff.map((s) => ({ id: s.id, name: s.name, role: s.role, certs: s.certs ?? [] }))

  D.projects = projects
    .map((p) => ({
      id: p.id, name: p.name, client: p.client, pm: p.pm, phase: p.phase,
      budget: num(p.budget), used: num(p.used), openWo: num(p.open_wo), status: p.status,
    }))
    .sort((a, b) => (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9) || a.id.localeCompare(b.id))

  D.workOrders = workOrders
    .map((w) => ({
      id: w.id, project: w.project_id, test: w.test, tech: w.tech_id,
      day: num(w.day), start: w.start_time, hours: num(w.hours), status: w.status,
    }))
    .sort((a, b) => a.day - b.day || String(a.start).localeCompare(String(b.start)))

  D.samples = samples
    .map((s) => ({
      id: s.id, project: s.project_id, material: s.material, test: s.test,
      set: s.set_label, cast: s.cast_date, due: s.due, age: num(s.age),
      tech: s.tech_id, status: s.status, result: s.result,
    }))
    .sort((a, b) => b.id.localeCompare(a.id))

  D.reports = reports
    .map((r) => ({
      id: r.id, project: r.project_id, title: r.title, type: r.type,
      author: r.author_id, submitted: r.submitted, status: r.status, pages: num(r.pages),
    }))
    .sort((a, b) => a.id.localeCompare(b.id))

  D.timeEntries = timeEntries
    .map((e) => ({
      id: e.id, tech: e.tech_id, date: e.work_date, project: e.project_id,
      task: e.task, hours: num(e.hours), rate: num(e.rate), status: e.status,
    }))
    .sort((a, b) => b.id.localeCompare(a.id))

  D.invoices = invoices
    .map((i) => ({
      id: i.id, project: i.project_id, client: i.client, issued: i.issued,
      due: i.due, amount: num(i.amount), status: i.status,
    }))
    .sort((a, b) => b.id.localeCompare(a.id))

  D.equipment = equipment.map((e) => ({
    id: e.id, type: e.type, model: e.model, serial: e.serial,
    last: e.last_cal, next: e.next_due, status: e.status,
  }))

  D.certifications = certifications.map((c) => ({
    id: c.id, tech: c.tech_id, cert: c.cert, issuer: c.issuer, expires: c.expires, status: c.status,
  }))

  D.tech = byId(D.techs)
  D.project = byId(D.projects)
  return D
}
