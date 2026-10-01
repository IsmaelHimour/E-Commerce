import { useEffect, useState } from 'react'
import { getFeaturedProducts } from '../services/catalogService'
import type { Product } from '../types'

export function useFeaturedProducts(count = 4) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getFeaturedProducts(count, controller.signal)
        setProducts(data)
      } catch (exception) {
        if (!controller.signal.aborted) {
          setError(exception instanceof Error ? exception.message : 'Unable to load featured products.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()

    return () => controller.abort()
  }, [count])

  return { products, isLoading, error }
}
