import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Database, Boxes } from 'lucide-react'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/definitions', label: 'Definitions', icon: Database, end: false },
  { to: '/records', label: 'Records', icon: Boxes, end: false },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-ink-200 bg-white">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            C
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight text-ink-900">CoreLab</div>
            <div className="text-[11px] leading-tight text-ink-400">Metafields</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 text-[11px] text-ink-400">
          Internal tool · MVP
        </div>
      </aside>

      <main className="ml-60 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
