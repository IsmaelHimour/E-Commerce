import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingCart, Tag } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { InlineNotice } from '../components/InlineNotice'
import { useAuth } from '../hooks/useAuth'
import { useProduct } from '../hooks/useProduct'
import { addCartItem } from '../services/cartService'
import { formatCurrency } from '../utils/formatters'

export function ProductDetailsPage() {
  const { id } = useParams()
  const productId = Number(id)
  const safeProductId = Number.isFinite(productId) && productId > 0 ? productId : 0
  const { product, isLoading, error } = useProduct(safeProductId)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const maxQuantity = useMemo(() => {
    if (!product) {
      return 1
    }

    return Math.min(product.stockQuantity, 100)
  }, [product])

  const isOutOfStock = !product || product.stockQuantity <= 0

  async function handleAddToCart() {
    if (!product) {
      return
    }

    if (!token) {
      toast('Sign in to add items to your cart.')
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      setIsAdding(true)
      const cart = await addCartItem({ productId: product.id, quantity })
      toast.success(`${product.name} added to cart. ${cart.totalItems} item${cart.totalItems === 1 ? '' : 's'} now in cart.`)
    } catch (exception) {
      toast.error(exception instanceof Error ? exception.message : 'Unable to add item to cart.')
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="aspect-[4/3] animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="space-y-5">
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-24 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-12 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-12 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <InlineNotice title="Product unavailable" message={error} />
      </section>
    )
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState title="Product not found" message="The product may have been removed from the catalog." />
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="overflow-hidden rounded border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <img
            src={`${product.imageUrl}?auto=format&fit=crop&w=1300&q=85`}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="rounded border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-7">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            <Tag size={16} aria-hidden="true" />
            {product.categoryName}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-neutral-200 py-5 dark:border-neutral-800">
            <p className="text-3xl font-bold tracking-normal text-neutral-950 dark:text-white">{formatCurrency(product.price)}</p>
            <span className="inline-flex items-center gap-2 rounded bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 size={17} aria-hidden="true" />
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200" htmlFor="quantity">
              Quantity
            </label>
            <div className="flex w-fit items-center rounded border border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950">
              <button
                type="button"
                onClick={() => setQuantity((currentQuantity) => Math.max(currentQuantity - 1, 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="grid size-11 place-items-center text-neutral-700 transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-200 dark:enabled:hover:bg-neutral-800"
                aria-label="Decrease quantity"
                title="Decrease quantity"
              >
                <Minus size={17} aria-hidden="true" />
              </button>
              <input
                id="quantity"
                value={quantity}
                onChange={(event) => {
                  const nextQuantity = Number(event.target.value)
                  if (Number.isFinite(nextQuantity)) {
                    setQuantity(Math.min(Math.max(nextQuantity, 1), maxQuantity))
                  }
                }}
                disabled={isOutOfStock}
                className="h-11 w-16 border-x border-neutral-300 bg-transparent text-center text-sm font-bold outline-none dark:border-neutral-700"
              />
              <button
                type="button"
                onClick={() => setQuantity((currentQuantity) => Math.min(currentQuantity + 1, maxQuantity))}
                disabled={quantity >= maxQuantity || isOutOfStock}
                className="grid size-11 place-items-center text-neutral-700 transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-200 dark:enabled:hover:bg-neutral-800"
                aria-label="Increase quantity"
                title="Increase quantity"
              >
                <Plus size={17} aria-hidden="true" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition enabled:hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart size={18} aria-hidden="true" />
            {isAdding ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
      </div>
    </section>
  )
}
