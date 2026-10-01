import { Link, NavLink, Outlet } from 'react-router-dom'
import { Moon, ShoppingBag, ShoppingCart, Sun, User } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Orders', to: '/orders' },
]

export function MainLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-stone-50">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-stone-50/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-normal">
            <span className="grid size-9 place-items-center rounded bg-emerald-600 text-white">
              <ShoppingBag size={19} aria-hidden="true" />
            </span>
            ShopSphere
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'rounded px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-stone-100 dark:text-neutral-950'
                      : 'text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user?.role === 'Admin' ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  clsx(
                    'rounded px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-stone-100 dark:text-neutral-950'
                      : 'text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800',
                  )
                }
              >
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid size-10 place-items-center rounded border border-neutral-300 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <Link
              to="/cart"
              className="grid size-10 place-items-center rounded border border-neutral-300 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              aria-label="Cart"
              title="Cart"
            >
              <ShoppingCart size={18} aria-hidden="true" />
            </Link>
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="rounded bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-stone-100 dark:text-neutral-950 dark:hover:bg-stone-300"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="grid size-10 place-items-center rounded bg-neutral-900 text-white transition hover:bg-neutral-700 dark:bg-stone-100 dark:text-neutral-950 dark:hover:bg-stone-300"
                aria-label="Login"
                title="Login"
              >
                <User size={18} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
