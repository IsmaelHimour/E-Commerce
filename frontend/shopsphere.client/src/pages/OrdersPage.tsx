import { Link } from 'react-router-dom'
import { ChevronRight, PackageCheck, ReceiptText, ShoppingBag } from 'lucide-react'
import clsx from 'clsx'
import { EmptyState } from '../components/EmptyState'
import { InlineNotice } from '../components/InlineNotice'
import { useOrders } from '../hooks/useOrders'
import { formatCurrency, formatDate } from '../utils/formatters'
import type { Order } from '../types'

export function OrdersPage() {
  const { orders, isLoading, error } = useOrders()

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-10 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <InlineNotice title="Orders unavailable" message={error} />
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState title="No orders yet" message="Your completed checkouts will appear here." />
        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            Browse products
          </Link>
        </div>
      </section>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 dark:border-neutral-800 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Purchases
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">Orders</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Track recent purchases, totals, order items, and fulfillment status.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
          <SummaryTile label="Orders" value={orders.length.toString()} />
          <SummaryTile label="Items" value={totalItems.toString()} />
          <SummaryTile label="Total spent" value={formatCurrency(totalSpent)} />
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  )
}

type SummaryTileProps = {
  label: string
  value: string
}

function SummaryTile({ label, value }: SummaryTileProps) {
  return (
    <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-normal text-neutral-950 dark:text-white">{value}</p>
    </div>
  )
}

type OrderCardProps = {
  order: Order
}

function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <article className="overflow-hidden rounded border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="grid gap-4 border-b border-neutral-200 p-5 dark:border-neutral-800 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ReceiptText size={21} aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold tracking-normal text-neutral-950 dark:text-white">Order #{order.id}</h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{formatDate(order.orderDate)}</p>
          </div>
        </div>

        <div className="grid gap-2 text-sm sm:grid-cols-2 lg:min-w-64">
          <div className="rounded bg-neutral-100 px-3 py-2 dark:bg-neutral-950">
            <p className="text-neutral-500 dark:text-neutral-400">Items</p>
            <p className="font-bold text-neutral-950 dark:text-white">{itemCount}</p>
          </div>
          <div className="rounded bg-neutral-100 px-3 py-2 dark:bg-neutral-950">
            <p className="text-neutral-500 dark:text-neutral-400">Total</p>
            <p className="font-bold text-neutral-950 dark:text-white">{formatCurrency(order.totalPrice)}</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {order.items.map((item) => (
          <div key={item.id} className="grid gap-4 p-4 sm:grid-cols-[80px_1fr_auto] sm:items-center">
            <Link to={`/products/${item.productId}`} className="block overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
              <img
                src={`${item.imageUrl}?auto=format&fit=crop&w=220&q=80`}
                alt={item.productName}
                className="aspect-square w-full object-cover"
              />
            </Link>
            <div>
              <Link
                to={`/products/${item.productId}`}
                className="font-bold tracking-normal text-neutral-950 transition hover:text-emerald-700 dark:text-white dark:hover:text-emerald-400"
              >
                {item.productName}
              </Link>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Line total</p>
              <p className="font-bold text-neutral-950 dark:text-white">{formatCurrency(item.lineTotal)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 bg-neutral-50 p-4 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          <PackageCheck size={17} aria-hidden="true" />
          Current status: {order.status}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400"
        >
          Shop again
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

type StatusBadgeProps = {
  status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase()

  return (
    <span
      className={clsx(
        'rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
        normalizedStatus === 'pending' && 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
        normalizedStatus === 'processing' && 'bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200',
        normalizedStatus === 'shipped' && 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200',
        normalizedStatus === 'delivered' && 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200',
        normalizedStatus === 'cancelled' && 'bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200',
      )}
    >
      {status}
    </span>
  )
}
