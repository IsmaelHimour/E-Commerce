import { useEffect, useState } from 'react'
import { getProducts } from '../services/catalogService'
import type { ProductPage, ProductQuery } from '../types/catalog'

const emptyProductPage: ProductPage = {
  items: [],
  pageNumber: 1,
  pageSize: 12,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
}

export function useProducts(query: ProductQuery) {
  const [productPage, setProductPage] = useState<ProductPage>(emptyProductPage)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProducts(query, controller.signal)
        setProductPage(data)
      } catch (exception) {
        if (!controller.signal.aborted) {
          setError(exception instanceof Error ? exception.message : 'Unable to load products.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()

    return () => controller.abort()
  }, [query])

  return { productPage, isLoading, error }
}
