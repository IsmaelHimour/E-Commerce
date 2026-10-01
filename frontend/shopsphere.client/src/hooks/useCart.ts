import { useCallback, useEffect, useState } from 'react'
import { getCart } from '../services/cartService'
import type { Cart } from '../types'

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadCart(signal?: AbortSignal) {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getCart(signal)
      setCart(data)
    } catch (exception) {
      if (!signal?.aborted) {
        setError(exception instanceof Error ? exception.message : 'Unable to load cart.')
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }

  const refreshCart = useCallback(async () => {
    await loadCart()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadInitialCart() {
      await loadCart(controller.signal)
    }

    void loadInitialCart()

    return () => controller.abort()
  }, [])

  return { cart, setCart, isLoading, error, refreshCart }
}
