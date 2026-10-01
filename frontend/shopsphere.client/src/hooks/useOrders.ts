import { useCallback, useEffect, useState } from 'react'
import { getMyOrders } from '../services/orderService'
import type { Order } from '../types'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadOrders(signal?: AbortSignal) {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getMyOrders(signal)
      setOrders(data)
    } catch (exception) {
      if (!signal?.aborted) {
        setError(exception instanceof Error ? exception.message : 'Unable to load orders.')
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }

  const refreshOrders = useCallback(async () => {
    await loadOrders()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadInitialOrders() {
      await loadOrders(controller.signal)
    }

    void loadInitialOrders()

    return () => controller.abort()
  }, [])

  return { orders, isLoading, error, refreshOrders }
}
