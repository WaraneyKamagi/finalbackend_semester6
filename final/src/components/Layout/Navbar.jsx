import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const baseLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
]

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const menuItems = [...baseLinks]
  if (isAuthenticated) {
    menuItems.push({ to: '/orders', label: 'My Orders' })
    if (user?.role === 'admin') {
      menuItems.push({ to: '/admin', label: 'Admin' })
    }
  }

  const linkClasses = ({ isActive }) =>
    [
      'text-sm font-medium tracking-wide transition-colors duration-200',
      isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-500/10 bg-[#060a13]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm font-black text-cyan-400 transition group-hover:bg-cyan-500/20 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
            ⚔
          </div>
          <div>
            <p className="font-extrabold uppercase tracking-wider text-white text-sm">
              JokiTorang
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/60">
              Pro Game Pilots
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-slate-400">
                Hi, <span className="text-cyan-400">{user?.name?.split(' ')[0] || 'Player'}</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-slate-400 transition hover:text-cyan-400"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex items-center text-sm font-semibold uppercase tracking-[0.3em] text-white md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((p) => !p)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-cyan-500/10 bg-[#060a13]/98 px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClasses}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <p className="text-sm text-slate-400">
                  Masuk sebagai <span className="font-semibold text-cyan-400">{user?.name}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-300"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar