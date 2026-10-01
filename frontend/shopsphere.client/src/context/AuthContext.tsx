import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContextDefinition'
import { setAuthToken } from '../services/api'
import type { UserProfile } from '../types'
import type { ReactNode } from 'react'
import type { AuthContextValue } from './AuthContextDefinition'

const tokenKey = 'shopsphere.token'
const userKey = 'shopsphere.user'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenKey))
  const [user, setUser] = useState<UserProfile | null>(() => {
    const storedUser = localStorage.getItem(userKey)
    return storedUser ? (JSON.parse(storedUser) as UserProfile) : null
  })

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login: (response) => {
        localStorage.setItem(tokenKey, response.token)
        localStorage.setItem(userKey, JSON.stringify(response.user))
        setToken(response.token)
        setUser(response.user)
      },
      logout: () => {
        localStorage.removeItem(tokenKey)
        localStorage.removeItem(userKey)
        setToken(null)
        setUser(null)
      },
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
