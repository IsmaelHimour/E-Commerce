import { createContext } from 'react'
import type { AuthResponse, UserProfile } from '../types'

export type AuthContextValue = {
  user: UserProfile | null
  token: string | null
  login: (response: AuthResponse) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
