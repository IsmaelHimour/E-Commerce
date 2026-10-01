import { api } from './api'
import type { Category, CategoryFormData, Product, ProductFormData } from '../types'
import type { ProductPage, ProductQuery } from '../types/catalog'

export async function getProducts(query: ProductQuery, signal?: AbortSignal) {
  const response = await api.get<ProductPage>('/products', {
    params: {
      search: query.search || undefined,
      categoryId: query.categoryId || undefined,
      minPrice: query.minPrice || undefined,
      maxPrice: query.maxPrice || undefined,
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    },
    signal,
  })

  return response.data
}

export async function getFeaturedProducts(count = 4, signal?: AbortSignal) {
  const response = await api.get<Product[]>('/products/featured', {
    params: { count },
    signal,
  })

  return response.data
}

export async function getProductById(id: number, signal?: AbortSignal) {
  const response = await api.get<Product>(`/products/${id}`, { signal })
  return response.data
}

export async function getCategories(signal?: AbortSignal) {
  const response = await api.get<Category[]>('/categories', { signal })
  return response.data
}

export async function createProduct(request: ProductFormData) {
  const response = await api.post<Product>('/products', request)
  return response.data
}

export async function updateProduct(id: number, request: ProductFormData) {
  const response = await api.put<Product>(`/products/${id}`, request)
  return response.data
}

export async function deleteProduct(id: number) {
  await api.delete(`/products/${id}`)
}

export async function createCategory(request: CategoryFormData) {
  const response = await api.post<Category>('/categories', request)
  return response.data
}

export async function updateCategory(id: number, request: CategoryFormData) {
  const response = await api.put<Category>(`/categories/${id}`, request)
  return response.data
}

export async function deleteCategory(id: number) {
  await api.delete(`/categories/${id}`)
}
