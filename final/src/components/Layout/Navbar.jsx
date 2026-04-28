import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
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
      'text-sm font-semibold tracking-wide transition',
      isActive ? 'text-white' : 'text-slate-400 hover:text-white',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-500/20 px-3 py-2 text-sm font-black uppercase tracking-widest text-indigo-300">
            JT
          </div>
          <div>
            <p className="font-black uppercase tracking-wide text-white">
              JokiTorang
            </p>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Boosting Rank Service
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-slate-300">
                Hi, {user?.name?.split(' ')[0] || 'Player'}
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </div>

        <button
          className="flex items-center text-sm font-semibold uppercase tracking-[0.3em] text-white md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-800/70 bg-slate-950/95 px-4 py-6 md:hidden">
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
                <p className="text-sm text-slate-300">
                  Masuk sebagai{' '}
                  <span className="font-semibold text-white">
                    {user?.name}
                  </span>
                </p>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/login')}>Login</Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar