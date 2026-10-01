import { api } from './api'
import type { AdminOrder, Order } from '../types'

export async function createOrder() {
  const response = await api.post<Order>('/orders')
  return response.data
}

export async function getMyOrders(signal?: AbortSignal) {
  const response = await api.get<Order[]>('/orders', { signal })
  return response.data
}

export async function getMyOrderById(id: number, signal?: AbortSignal) {
  const response = await api.get<Order>(`/orders/${id}`, { signal })
  return response.data
}

export async function getAdminOrders(signal?: AbortSignal) {
  const response = await api.get<AdminOrder[]>('/orders/admin', { signal })
  return response.data
}

export async function updateOrderStatus(id: number, status: string) {
  const response = await api.patch<AdminOrder>(`/orders/admin/${id}/status`, { status })
  return response.data
}
