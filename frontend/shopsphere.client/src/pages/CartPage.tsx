import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { InlineNotice } from '../components/InlineNotice'
import { useCart } from '../hooks/useCart'
import { clearCart, removeCartItem, updateCartItem } from '../services/cartService'
import { createOrder } from '../services/orderService'
import { getApiErrorMessage } from '../utils/apiErrors'
import { formatCurrency } from '../utils/formatters'

export function CartPage() {
  const { cart, setCart, isLoading, error, refreshCart } = useCart()
  const [busyProductId, setBusyProductId] = useState<number | null>(null)
  const [isClearing, setIsClearing] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const navigate = useNavigate()

  async function handleQuantityChange(productId: number, quantity: number) {
    try {
      setBusyProductId(productId)
      const updatedCart = await updateCartItem(productId, quantity)
      setCart(updatedCart)
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to update quantity.'))
    } finally {
      setBusyProductId(null)
    }
  }

  async function handleRemove(productId: number) {
    try {
      setBusyProductId(productId)
      await removeCartItem(productId)
      await refreshCart()
      toast.success('Item removed from cart.')
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to remove item.'))
    } finally {
      setBusyProductId(null)
    }
  }

  async function handleClear() {
    try {
      setIsClearing(true)
      await clearCart()
      await refreshCart()
      toast.success('Cart cleared.')
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to clear cart.'))
    } finally {
      setIsClearing(false)
    }
  }

  async function handleCheckout() {
    try {
      setIsCheckingOut(true)
      const order = await createOrder()
      toast.success(`Order #${order.id} created.`)
      navigate('/orders')
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to create order.'))
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-10 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <InlineNotice title="Cart unavailable" message={error} />
      </section>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState title="Your cart is empty" message="Add a few products before moving to checkout." />
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Checkout</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">Shopping cart</h1>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {cart.totalItems} item{cart.totalItems === 1 ? '' : 's'} ready for checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          disabled={isClearing}
          className="inline-flex w-fit items-center gap-2 rounded border border-neutral-300 px-4 py-2 text-sm font-semibold transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:enabled:hover:bg-neutral-800"
        >
          <X size={17} aria-hidden="true" />
          {isClearing ? 'Clearing...' : 'Clear cart'}
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-4">
          {cart.items.map((item) => {
            const isBusy = busyProductId === item.productId
            const maxQuantity = Math.min(item.stockQuantity, 100)

            return (
              <article
                key={item.id}
                className="grid gap-4 rounded border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-[132px_1fr] sm:p-5"
              >
                <Link to={`/products/${item.productId}`} className="block overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={`${item.imageUrl}?auto=format&fit=crop&w=360&q=80`}
                    alt={item.productName}
                    className="aspect-square w-full object-cover sm:h-32"
                  />
                </Link>

                <div className="flex min-w-0 flex-col justify-between gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-lg font-bold tracking-normal text-neutral-950 transition hover:text-emerald-700 dark:text-white dark:hover:text-emerald-400"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {formatCurrency(item.unitPrice)} each · {item.stockQuantity} in stock
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleRemove(item.productId)}
                      disabled={isBusy}
                      className="grid size-10 shrink-0 place-items-center rounded text-neutral-500 transition enabled:hover:bg-red-50 enabled:hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:enabled:hover:bg-red-950/30 dark:enabled:hover:text-red-300"
                      aria-label={`Remove ${item.productName}`}
                      title={`Remove ${item.productName}`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center rounded border border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950">
                      <button
                        type="button"
                        onClick={() => void handleQuantityChange(item.productId, Math.max(item.quantity - 1, 1))}
                        disabled={item.quantity <= 1 || isBusy}
                        className="grid size-10 place-items-center text-neutral-700 transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-200 dark:enabled:hover:bg-neutral-800"
                        aria-label={`Decrease ${item.productName} quantity`}
                        title="Decrease quantity"
                      >
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <span className="grid h-10 w-14 place-items-center border-x border-neutral-300 text-sm font-bold dark:border-neutral-700">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleQuantityChange(item.productId, Math.min(item.quantity + 1, maxQuantity))}
                        disabled={item.quantity >= maxQuantity || isBusy}
                        className="grid size-10 place-items-center text-neutral-700 transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-200 dark:enabled:hover:bg-neutral-800"
                        aria-label={`Increase ${item.productName} quantity`}
                        title="Increase quantity"
                      >
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    </div>

                    <p className="text-xl font-bold tracking-normal text-neutral-950 dark:text-white">
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="rounded border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-bold tracking-normal text-neutral-950 dark:text-white">Order summary</h2>
          <div className="mt-5 space-y-3 border-b border-neutral-200 pb-5 text-sm dark:border-neutral-800">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-600 dark:text-neutral-300">Items</span>
              <span className="font-semibold">{cart.totalItems}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-600 dark:text-neutral-300">Subtotal</span>
              <span className="font-semibold">{formatCurrency(cart.totalPrice)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-600 dark:text-neutral-300">Shipping</span>
              <span className="font-semibold">Calculated later</span>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="text-base font-semibold">Total</span>
            <span className="text-2xl font-bold tracking-normal">{formatCurrency(cart.totalPrice)}</span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mt-6 w-full rounded bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition enabled:hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCheckingOut ? 'Creating order...' : 'Create order'}
          </button>
          <Link
            to="/products"
            className="mt-3 inline-flex w-full items-center justify-center rounded border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  )
}
