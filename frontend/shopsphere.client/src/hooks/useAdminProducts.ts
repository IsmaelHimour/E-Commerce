import { useCallback, useEffect, useState } from 'react'
import { getProducts } from '../services/catalogService'
import type { Product } from '../types'

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getProducts({ pageNumber: 1, pageSize: 100 }, signal)
      setProducts(data.items)
    } catch (exception) {
      if (!signal?.aborted) {
        setError(exception instanceof Error ? exception.message : 'Unable to load products.')
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  const refreshProducts = useCallback(async () => {
    await loadProducts()
  }, [loadProducts])

  useEffect(() => {
    const controller = new AbortController()

    async function loadInitialProducts() {
      await loadProducts(controller.signal)
    }

    void loadInitialProducts()

    return () => controller.abort()
  }, [loadProducts])

  return { products, isLoading, error, refreshProducts }
}
