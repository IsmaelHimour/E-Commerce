export type UserProfile = {
  id: number
  fullName: string
  email: string
  role: 'Customer' | 'Admin'
}

export type AuthResponse = {
  token: string
  expiresAt: string
  user: UserProfile
}

export type Category = {
  id: number
  name: string
  description: string
  productCount: number
}

export type Product = {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string
  categoryId: number
  categoryName: string
}

export type ProductFormData = {
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string
  categoryId: number
}

export type CategoryFormData = {
  name: string
  description: string
}

export type CartItem = {
  id: number
  productId: number
  productName: string
  imageUrl: string
  unitPrice: number
  quantity: number
  stockQuantity: number
  lineTotal: number
}

export type Cart = {
  id: number
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export type OrderItem = {
  id: number
  productId: number
  productName: string
  imageUrl: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type Order = {
  id: number
  orderDate: string
  totalPrice: number
  status: string
  items: OrderItem[]
}

export type AdminOrder = Order & {
  userId: number
  customerName: string
  customerEmail: string
}

export type PagedResult<T> = {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}
