import { useEffect, useState } from 'react'
import { getProductById } from '../services/catalogService'
import type { Product } from '../types'

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProduct() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProductById(id, controller.signal)
        setProduct(data)
      } catch (exception) {
        if (!controller.signal.aborted) {
          setError(exception instanceof Error ? exception.message : 'Unable to load product.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadProduct()

    return () => controller.abort()
  }, [id])

  return { product, isLoading, error }
}
