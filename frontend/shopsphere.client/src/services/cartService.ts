import { api } from './api'
import type { Cart } from '../types'

export type AddCartItemRequest = {
  productId: number
  quantity: number
}

export async function addCartItem(request: AddCartItemRequest) {
  const response = await api.post<Cart>('/cart/items', request)
  return response.data
}

export async function getCart(signal?: AbortSignal) {
  const response = await api.get<Cart>('/cart', { signal })
  return response.data
}

export async function updateCartItem(productId: number, quantity: number) {
  const response = await api.put<Cart>(`/cart/items/${productId}`, { quantity })
  return response.data
}

export async function removeCartItem(productId: number) {
  await api.delete(`/cart/items/${productId}`)
}

export async function clearCart() {
  await api.delete('/cart')
}
