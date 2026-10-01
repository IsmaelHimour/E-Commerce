import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { EmptyState } from '../components/EmptyState'
import { InlineNotice } from '../components/InlineNotice'
import { ProductCard } from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/ProductCardSkeleton'
import { useCategories } from '../hooks/useCategories'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useProducts } from '../hooks/useProducts'
import type { ProductQuery } from '../types/catalog'

const pageSize = 6

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategoryId = Number(searchParams.get('categoryId')) || undefined
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>(initialCategoryId)
  const [pageNumber, setPageNumber] = useState(1)
  const debouncedSearch = useDebouncedValue(search)
  const { categories, isLoading: categoriesLoading } = useCategories()

  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (categoryId) {
      nextParams.set('categoryId', categoryId.toString())
    }
    setSearchParams(nextParams, { replace: true })
  }, [categoryId, setSearchParams])

  const query = useMemo<ProductQuery>(
    () => ({
      search: debouncedSearch,
      categoryId,
      pageNumber,
      pageSize,
    }),
    [categoryId, debouncedSearch, pageNumber],
  )

  const { productPage, isLoading, error } = useProducts(query)

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-8 dark:border-neutral-800 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Catalog
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">Products</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Find practical tech essentials, workspace upgrades, and everyday accessories with live pricing and stock.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
          <Search size={18} className="text-neutral-500" aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPageNumber(1)
            }}
            placeholder="Search products"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-400 sm:w-72"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          <SlidersHorizontal size={17} aria-hidden="true" />
          Categories
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              setCategoryId(undefined)
              setPageNumber(1)
            }}
            className={clsx(
              'shrink-0 rounded border px-3 py-2 text-sm font-semibold transition',
              !categoryId
                ? 'border-neutral-950 bg-neutral-950 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-neutral-950'
                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800',
            )}
          >
            All
          </button>
          {categoriesLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-10 w-24 shrink-0 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              ))
            : categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => {
                    setCategoryId(category.id)
                    setPageNumber(1)
                  }}
                  className={clsx(
                    'shrink-0 rounded border px-3 py-2 text-sm font-semibold transition',
                    categoryId === category.id
                      ? 'border-neutral-950 bg-neutral-950 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-neutral-950'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800',
                  )}
                >
                  {category.name}
                </button>
              ))}
        </div>
      </div>

      <div className="mt-8">
        {error ? <InlineNotice title="Products unavailable" message={error} /> : null}

        {!error && isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: pageSize }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {!error && !isLoading && productPage.items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productPage.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}

        {!error && !isLoading && productPage.items.length === 0 ? (
          <EmptyState title="No products found" message="Try a different search term or category." />
        ) : null}
      </div>

      {!error && productPage.totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Page {productPage.pageNumber} of {productPage.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!productPage.hasPreviousPage}
              onClick={() => setPageNumber((currentPage) => Math.max(currentPage - 1, 1))}
              className="rounded border border-neutral-300 px-4 py-2 text-sm font-semibold transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-800"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!productPage.hasNextPage}
              onClick={() => setPageNumber((currentPage) => currentPage + 1)}
              className="rounded border border-neutral-300 px-4 py-2 text-sm font-semibold transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-800"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
