import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import toast from 'react-hot-toast'
import { Boxes, Layers, PackageCheck, Plus, Save, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { InlineNotice } from '../components/InlineNotice'
import { useAdminOrders } from '../hooks/useAdminOrders'
import { useAdminProducts } from '../hooks/useAdminProducts'
import { useCategories } from '../hooks/useCategories'
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  updateCategory,
  updateProduct,
} from '../services/catalogService'
import { updateOrderStatus } from '../services/orderService'
import { getApiErrorMessage } from '../utils/apiErrors'
import { formatCurrency, formatDate } from '../utils/formatters'
import type { AdminOrder, Category, CategoryFormData, Product, ProductFormData } from '../types'

type AdminTab = 'products' | 'categories' | 'orders'

const emptyProductForm: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  imageUrl: '',
  categoryId: 0,
}

const emptyCategoryForm: CategoryFormData = {
  name: '',
  description: '',
}

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('products')
  const { products, isLoading: productsLoading, error: productsError, refreshProducts } = useAdminProducts()
  const { categories, isLoading: categoriesLoading, error: categoriesError, refreshCategories } = useCategories()
  const { orders, isLoading: ordersLoading, error: ordersError, refreshOrders } = useAdminOrders()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-8 dark:border-neutral-800 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Admin</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Manage products, organize categories, and review order activity from one protected workspace.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
          <Metric icon={<Boxes size={18} aria-hidden="true" />} label="Products" value={products.length.toString()} />
          <Metric icon={<Layers size={18} aria-hidden="true" />} label="Categories" value={categories.length.toString()} />
          <Metric icon={<PackageCheck size={18} aria-hidden="true" />} label="Orders" value={orders.length.toString()} />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-neutral-200 pb-3 dark:border-neutral-800">
        {(['products', 'categories', 'orders'] as AdminTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'shrink-0 rounded px-4 py-2 text-sm font-bold capitalize transition',
              activeTab === tab
                ? 'bg-neutral-950 text-white dark:bg-stone-100 dark:text-neutral-950'
                : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'products' ? (
          <ProductsAdmin
            products={products}
            categories={categories}
            isLoading={productsLoading || categoriesLoading}
            error={productsError ?? categoriesError}
            onChanged={refreshProducts}
          />
        ) : null}
        {activeTab === 'categories' ? (
          <CategoriesAdmin categories={categories} isLoading={categoriesLoading} error={categoriesError} onChanged={refreshCategories} />
        ) : null}
        {activeTab === 'orders' ? (
          <OrdersAdmin orders={orders} isLoading={ordersLoading} error={ordersError} onChanged={refreshOrders} />
        ) : null}
      </div>
    </section>
  )
}

type MetricProps = {
  icon: ReactNode
  label: string
  value: string
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-normal text-neutral-950 dark:text-white">{value}</p>
    </div>
  )
}

type ProductsAdminProps = {
  products: Product[]
  categories: Category[]
  isLoading: boolean
  error: string | null
  onChanged: () => Promise<void>
}

function ProductsAdmin({ products, categories, isLoading, error, onChanged }: ProductsAdminProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormData>({ ...emptyProductForm, categoryId: categories[0]?.id ?? 0 })
  const [isSaving, setIsSaving] = useState(false)

  function startCreate() {
    setEditingProduct(null)
    setForm({ ...emptyProductForm, categoryId: categories[0]?.id ?? 0 })
  }

  function startEdit(product: Product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSaving(true)
      if (editingProduct) {
        await updateProduct(editingProduct.id, form)
        toast.success('Product updated.')
      } else {
        await createProduct(form)
        toast.success('Product created.')
      }
      startCreate()
      await onChanged()
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to save product.'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(product: Product) {
    try {
      await deleteProduct(product.id)
      toast.success('Product deleted.')
      await onChanged()
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to delete product.'))
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="rounded border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-normal">{editingProduct ? 'Edit product' : 'New product'}</h2>
          <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-semibold">
            <Plus size={16} aria-hidden="true" />
            New
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          <TextInput label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <TextArea label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
          <TextInput label="Image URL" value={form.imageUrl} onChange={(value) => setForm((current) => ({ ...current, imageUrl: value }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Price" value={form.price} min={0.01} onChange={(value) => setForm((current) => ({ ...current, price: value }))} />
            <NumberInput label="Stock" value={form.stockQuantity} min={0} onChange={(value) => setForm((current) => ({ ...current, stockQuantity: value }))} />
          </div>
          <label className="block text-sm font-semibold">
            Category
            <select
              value={form.categoryId}
              onChange={(event) => setForm((current) => ({ ...current, categoryId: Number(event.target.value) }))}
              className="mt-2 h-11 w-full rounded border border-neutral-300 bg-neutral-50 px-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950"
              required
            >
              <option value={0} disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition enabled:hover:bg-emerald-700 disabled:opacity-60">
            <Save size={17} aria-hidden="true" />
            {isSaving ? 'Saving...' : 'Save product'}
          </button>
        </div>
      </form>

      <AdminPanel title="Products" isLoading={isLoading} error={error}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500 dark:border-neutral-800">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className="px-4 py-3">{product.categoryName}</td>
                  <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">{product.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => startEdit(product)} className="rounded border px-3 py-1.5 font-semibold">
                        Edit
                      </button>
                      <button type="button" onClick={() => void handleDelete(product)} className="rounded border border-red-200 px-3 py-1.5 font-semibold text-red-700 dark:border-red-900 dark:text-red-300" aria-label={`Delete ${product.name}`}>
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>
    </div>
  )
}

type CategoriesAdminProps = {
  categories: Category[]
  isLoading: boolean
  error: string | null
  onChanged: () => Promise<void>
}

function CategoriesAdmin({ categories, isLoading, error, onChanged }: CategoriesAdminProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryFormData>(emptyCategoryForm)
  const [isSaving, setIsSaving] = useState(false)

  function startCreate() {
    setEditingCategory(null)
    setForm(emptyCategoryForm)
  }

  function startEdit(category: Category) {
    setEditingCategory(category)
    setForm({ name: category.name, description: category.description })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSaving(true)
      if (editingCategory) {
        await updateCategory(editingCategory.id, form)
      } else {
        await createCategory(form)
      }
      setEditingCategory(null)
      setForm(emptyCategoryForm)
      toast.success(editingCategory ? 'Category updated.' : 'Category created.')
      await onChanged()
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to save category.'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(category: Category) {
    try {
      await deleteCategory(category.id)
      toast.success('Category deleted.')
      await onChanged()
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to delete category.'))
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleSubmit} className="rounded border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold tracking-normal">{editingCategory ? 'Edit category' : 'New category'}</h2>
          <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-semibold">
            <Plus size={16} aria-hidden="true" />
            New
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          <TextInput label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <TextArea label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
          <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition enabled:hover:bg-emerald-700 disabled:opacity-60">
            <Save size={17} aria-hidden="true" />
            {isSaving ? 'Saving...' : 'Save category'}
          </button>
        </div>
      </form>

      <AdminPanel title="Categories" isLoading={isLoading} error={error}>
        <div className="grid gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col justify-between gap-3 rounded border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold tracking-normal">{category.name}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{category.description}</p>
                <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">{category.productCount} products</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(category)} className="rounded border px-3 py-2 text-sm font-semibold">
                  Edit
                </button>
                <button type="button" onClick={() => void handleDelete(category)} className="rounded border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-900 dark:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>
    </div>
  )
}

type OrdersAdminProps = {
  orders: AdminOrder[]
  isLoading: boolean
  error: string | null
  onChanged: () => Promise<void>
}

function OrdersAdmin({ orders, isLoading, error, onChanged }: OrdersAdminProps) {
  async function handleStatusChange(orderId: number, status: string) {
    try {
      await updateOrderStatus(orderId, status)
      await onChanged()
      toast.success('Order status updated.')
    } catch (exception) {
      toast.error(getApiErrorMessage(exception, 'Unable to update order status.'))
    }
  }

  return (
    <AdminPanel title="Orders" isLoading={isLoading} error={error}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase text-neutral-500 dark:border-neutral-800">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-bold">#{order.id}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{order.customerEmail}</p>
                </td>
                <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalPrice)}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(event) => void handleStatusChange(order.id, event.target.value)}
                    className="h-10 rounded border border-neutral-300 bg-neutral-50 px-3 text-sm font-semibold outline-none dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPanel>
  )
}

type AdminPanelProps = {
  title: string
  isLoading: boolean
  error: string | null
  children: ReactNode
}

function AdminPanel({ title, isLoading, error, children }: AdminPanelProps) {
  if (error) {
    return <InlineNotice title={`${title} unavailable`} message={error} />
  }

  return (
    <div className="rounded border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="text-xl font-bold tracking-normal">{title}</h2>
      </div>
      <div className="p-4">{isLoading ? <div className="h-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" /> : children}</div>
    </div>
  )
}

type TextInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

function TextInput({ label, value, onChange }: TextInputProps) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded border border-neutral-300 bg-neutral-50 px-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950"
        required
      />
    </label>
  )
}

function TextArea({ label, value, onChange }: TextInputProps) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950"
        required
      />
    </label>
  )
}

type NumberInputProps = {
  label: string
  value: number
  min: number
  onChange: (value: number) => void
}

function NumberInput({ label, value, min, onChange }: NumberInputProps) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-11 w-full rounded border border-neutral-300 bg-neutral-50 px-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950"
        min={min}
        step={label === 'Price' ? '0.01' : '1'}
        required
      />
    </label>
  )
}
