import { Link, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LogOut, Mail, PackageCheck, ShieldCheck, ShoppingCart, UserRound } from 'lucide-react'
import { InlineNotice } from '../components/InlineNotice'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'
import { useProfile } from '../hooks/useProfile'
import { formatCurrency, formatDate } from '../utils/formatters'

export function ProfilePage() {
  const { profile, isLoading: profileLoading, error: profileError } = useProfile()
  const { cart, isLoading: cartLoading } = useCart()
  const { orders, isLoading: ordersLoading } = useOrders()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const recentOrder = orders[0]

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (profileLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-10 w-56 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="h-80 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (profileError || !profile) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <InlineNotice title="Profile unavailable" message={profileError ?? 'Unable to load profile.'} />
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-8 dark:border-neutral-800 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Account</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">User profile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Keep account details, cart activity, and order history close at hand.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-fit items-center gap-2 rounded border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          <LogOut size={17} aria-hidden="true" />
          Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="grid size-16 place-items-center rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <UserRound size={30} aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-normal text-neutral-950 dark:text-white">{profile.fullName}</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Mail size={17} aria-hidden="true" />
              {profile.email}
            </p>
            <p className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <ShieldCheck size={17} aria-hidden="true" />
              {profile.role}
            </p>
          </div>
          <div className="mt-6 grid gap-3">
            <Link
              to="/orders"
              className="rounded bg-neutral-950 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-neutral-700 dark:bg-stone-100 dark:text-neutral-950 dark:hover:bg-stone-300"
            >
              View orders
            </Link>
            <Link
              to="/cart"
              className="rounded border border-neutral-300 px-4 py-3 text-center text-sm font-semibold transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              View cart
            </Link>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileMetric
              icon={<ShoppingCart size={20} aria-hidden="true" />}
              label="Cart items"
              value={cartLoading ? '...' : (cart?.totalItems ?? 0).toString()}
            />
            <ProfileMetric
              icon={<PackageCheck size={20} aria-hidden="true" />}
              label="Orders"
              value={ordersLoading ? '...' : orders.length.toString()}
            />
            <ProfileMetric
              icon={<ShieldCheck size={20} aria-hidden="true" />}
              label="Role"
              value={profile.role}
            />
            <ProfileMetric
              icon={<PackageCheck size={20} aria-hidden="true" />}
              label="Total spent"
              value={ordersLoading ? '...' : formatCurrency(totalSpent)}
            />
          </div>

          <div className="rounded border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold tracking-normal text-neutral-950 dark:text-white">Recent activity</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">Latest cart and order signals.</p>
              </div>
              <Link
                to="/products"
                className="inline-flex w-fit items-center rounded border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Continue shopping
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded bg-neutral-100 p-4 dark:bg-neutral-950">
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Cart</p>
                <p className="mt-2 text-2xl font-bold tracking-normal text-neutral-950 dark:text-white">
                  {cartLoading ? 'Loading...' : formatCurrency(cart?.totalPrice ?? 0)}
                </p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {cartLoading ? 'Checking cart' : `${cart?.totalItems ?? 0} item${(cart?.totalItems ?? 0) === 1 ? '' : 's'} in cart`}
                </p>
              </div>

              <div className="rounded bg-neutral-100 p-4 dark:bg-neutral-950">
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Latest order</p>
                {ordersLoading ? (
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Loading orders...</p>
                ) : recentOrder ? (
                  <>
                    <p className="mt-2 text-2xl font-bold tracking-normal text-neutral-950 dark:text-white">
                      #{recentOrder.id} · {recentOrder.status}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {formatCurrency(recentOrder.totalPrice)} on {formatDate(recentOrder.orderDate)}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">No orders yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type ProfileMetricProps = {
  icon: ReactNode
  label: string
  value: string
}

function ProfileMetric({ icon, label, value }: ProfileMetricProps) {
  return (
    <div className="rounded border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {icon}
        </span>
        <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{label}</p>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-normal text-neutral-950 dark:text-white">{value}</p>
    </div>
  )
}
