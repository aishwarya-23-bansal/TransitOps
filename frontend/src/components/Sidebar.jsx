import { NavLink } from 'react-router-dom'
import {
  FiGrid, FiTruck, FiUsers, FiMap, FiTool, FiDroplet, FiBarChart2, FiSettings,
} from 'react-icons/fi'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/vehicles', label: 'Fleet', icon: FiTruck },
  { to: '/drivers', label: 'Drivers', icon: FiUsers },
  { to: '/trips', label: 'Trips', icon: FiMap },
  { to: '/maintenance', label: 'Maintenance', icon: FiTool },
  { to: '/fuel-expenses', label: 'Fuel / Expenses', icon: FiDroplet },
  { to: '/reports', label: 'Analytics', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-60 bg-bg-sidebar border-r border-border flex flex-col z-40 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 px-5 h-16 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-white text-sm">T</div>
          <span className="font-semibold text-gray-100 tracking-tight">TransitOps</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
