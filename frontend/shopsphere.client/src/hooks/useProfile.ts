import { useEffect, useState } from 'react'
import { getProfile } from '../services/authService'
import type { UserProfile } from '../types'

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProfile() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProfile(controller.signal)
        setProfile(data)
      } catch (exception) {
        if (!controller.signal.aborted) {
          setError(exception instanceof Error ? exception.message : 'Unable to load profile.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadProfile()

    return () => controller.abort()
  }, [])

  return { profile, isLoading, error }
}
