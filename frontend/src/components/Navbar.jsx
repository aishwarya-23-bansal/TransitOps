import { FiMenu, FiBell, FiChevronDown, FiLogOut } from 'react-icons/fi'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 h-16 bg-bg/95 backdrop-blur border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-gray-200">
          <FiMenu size={20} />
        </button>
        <h1 className="text-sm font-semibold text-gray-200">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-200 transition-colors">
          <FiBell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-xs font-semibold text-accent uppercase">
              {user?.name?.[0] || 'U'}
            </div>
            <span className="text-sm text-gray-300 hidden sm:block">{user?.name || 'User'}</span>
            <FiChevronDown size={14} className="text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-lg shadow-soft py-1">
              <p className="px-3 py-2 text-xs text-gray-500 border-b border-border">{user?.role}</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
              >
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
