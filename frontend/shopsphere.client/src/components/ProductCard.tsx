import { ArrowRight, Boxes, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatters'
import type { Product } from '../types'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <Link to={`/products/${product.id}`} className="block aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={`${product.imageUrl}?auto=format&fit=crop&w=900&q=80`}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            <Tag size={14} aria-hidden="true" />
            {product.categoryName}
          </div>
          <h2 className="mt-2 line-clamp-2 min-h-12 text-lg font-bold tracking-normal text-neutral-950 dark:text-white">
            {product.name}
          </h2>
        </div>

        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{product.description}</p>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-neutral-950 dark:text-white">{formatCurrency(product.price)}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <Boxes size={14} aria-hidden="true" />
              {product.stockQuantity} in stock
            </p>
          </div>
          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center gap-2 rounded bg-neutral-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-stone-100 dark:text-neutral-950 dark:hover:bg-stone-300"
          >
            View
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
