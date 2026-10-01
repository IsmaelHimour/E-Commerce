import type { PagedResult, Product } from './index'

export type ProductQuery = {
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  pageNumber: number
  pageSize: number
}

export type ProductPage = PagedResult<Product>
