import { useCallback, useEffect, useState } from 'react'
import { getAdminOrders } from '../services/orderService'
import type { AdminOrder } from '../types'

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAdminOrders(signal)
      setOrders(data)
    } catch (exception) {
      if (!signal?.aborted) {
        setError(exception instanceof Error ? exception.message : 'Unable to load admin orders.')
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  const refreshOrders = useCallback(async () => {
    await loadOrders()
  }, [loadOrders])

  useEffect(() => {
    const controller = new AbortController()

    async function loadInitialOrders() {
      await loadOrders(controller.signal)
    }

    void loadInitialOrders()

    return () => controller.abort()
  }, [loadOrders])

  return { orders, isLoading, error, refreshOrders }
}
