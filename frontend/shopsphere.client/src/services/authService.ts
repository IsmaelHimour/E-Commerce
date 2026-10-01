import { api } from './api'
import type { AuthResponse, UserProfile } from '../types'

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  fullName: string
  email: string
  password: string
}

export async function loginUser(request: LoginRequest) {
  const response = await api.post<AuthResponse>('/auth/login', request)
  return response.data
}

export async function registerUser(request: RegisterRequest) {
  const response = await api.post<AuthResponse>('/auth/register', request)
  return response.data
}

export async function getProfile(signal?: AbortSignal) {
  const response = await api.get<UserProfile>('/auth/me', { signal })
  return response.data
}
