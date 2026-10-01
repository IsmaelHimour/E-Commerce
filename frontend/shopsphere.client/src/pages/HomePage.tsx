import { motion } from 'framer-motion'
import { ArrowRight, Boxes, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { InlineNotice } from '../components/InlineNotice'
import { ProductCard } from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/ProductCardSkeleton'
import { useCategories } from '../hooks/useCategories'
import { useFeaturedProducts } from '../hooks/useFeaturedProducts'

export function HomePage() {
  const { products, isLoading: productsLoading, error: productsError } = useFeaturedProducts(4)
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories()

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-neutral-950/60" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl text-white"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Modern commerce</p>
            <h1 className="mt-4 text-5xl font-bold tracking-normal sm:text-6xl">ShopSphere</h1>
            <p className="mt-5 text-lg leading-8 text-stone-100">
              Discover sharp tech essentials, home office upgrades, and everyday accessories in a fast, focused storefront.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded bg-emerald-500 px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-emerald-300"
            >
              Browse products
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="rounded border border-neutral-200 p-5 dark:border-neutral-800">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <Boxes size={16} aria-hidden="true" />
              Live catalog
            </p>
            <p className="mt-2 text-2xl font-bold tracking-normal">{products.length || 3} featured picks</p>
          </div>
          <div className="rounded border border-neutral-200 p-5 dark:border-neutral-800">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <Layers size={16} aria-hidden="true" />
              Departments
            </p>
            <p className="mt-2 text-2xl font-bold tracking-normal">{categories.length || 3} categories</p>
          </div>
          <div className="rounded border border-neutral-200 p-5 dark:border-neutral-800">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Fast checkout</p>
            <p className="mt-2 text-2xl font-bold tracking-normal">Cart and orders ready</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950 dark:text-white">Fresh from the catalog</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 rounded border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            View all
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8">
          {productsError ? <InlineNotice title="Products unavailable" message={productsError} /> : null}
          {!productsError && productsLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : null}
          {!productsError && !productsLoading && products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
          {!productsError && !productsLoading && products.length === 0 ? (
            <EmptyState title="No featured products" message="The catalog is ready for its next product drop." />
          ) : null}
        </div>
      </section>

      <section className="bg-neutral-100 py-14 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Categories
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950 dark:text-white">Shop by department</h2>
          </div>

          <div className="mt-8">
            {categoriesError ? <InlineNotice title="Categories unavailable" message={categoriesError} /> : null}
            {!categoriesError && categoriesLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-32 animate-pulse rounded bg-white dark:bg-neutral-800" />
                ))}
              </div>
            ) : null}
            {!categoriesError && !categoriesLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?categoryId=${category.id}`}
                    className="rounded border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950"
                  >
                    <h3 className="text-xl font-bold tracking-normal">{category.name}</h3>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                      {category.description}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      {category.productCount} products
                    </p>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
