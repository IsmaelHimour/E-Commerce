import { useCallback, useEffect, useState } from 'react'
import { getCategories } from '../services/catalogService'
import type { Category } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getCategories(signal)
      setCategories(data)
    } catch (exception) {
      if (!signal?.aborted) {
        setError(exception instanceof Error ? exception.message : 'Unable to load categories.')
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  const refreshCategories = useCallback(async () => {
    await loadCategories()
  }, [loadCategories])

  useEffect(() => {
    const controller = new AbortController()

    async function loadInitialCategories() {
      await loadCategories(controller.signal)
    }

    void loadInitialCategories()

    return () => controller.abort()
  }, [loadCategories])

  return { categories, isLoading, error, refreshCategories }
}
