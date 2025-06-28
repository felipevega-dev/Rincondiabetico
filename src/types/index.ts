// Enums
export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  ESPERANDO_CONFIRMACION = 'ESPERANDO_CONFIRMACION',
  PAGADO = 'PAGADO',
  PREPARANDO = 'PREPARANDO',
  LISTO = 'LISTO',
  RETIRADO = 'RETIRADO',
  CANCELADO = 'CANCELADO'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Tipos básicos (se actualizarán cuando tengamos la DB)
export type User = {
  id: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Banner = {
  id: string
  title: string
  subtitle?: string
  description?: string
  image: string
  buttonText?: string
  buttonLink?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type Product = {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  images: string[]
  isActive: boolean
  isAvailable: boolean
  stock: number
  categoryId: string
  createdAt: Date
  updatedAt: Date
}

// Tipos extendidos con relaciones
export type ProductWithCategory = Product & {
  category: Category
}

export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export type CartSummary = {
  items: CartItem[]
  subtotal: number
  total: number
  itemCount: number
}

// Formularios
export type CreateProductForm = {
  name: string
  description?: string
  price: number
  categoryId: string
  images: string[]
  stock: number
  isActive: boolean
  isAvailable: boolean
}

export type CreateOrderForm = {
  items: {
    productId: string
    quantity: number
    price: number
  }[]
  pickupDate: Date
  pickupTime: string
  customerNotes?: string
}

export type UpdateOrderStatusForm = {
  status: OrderStatus
  adminNotes?: string
}

// API Responses
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Estados y enums ya definidos arriba

// Constantes
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDIENTE: 'Pendiente de pago',
  ESPERANDO_CONFIRMACION: 'Esperando confirmación',
  PAGADO: 'Pagado',
  PREPARANDO: 'En preparación',
  LISTO: 'Listo para retiro',
  RETIRADO: 'Retirado',
  CANCELADO: 'Cancelado'
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  FAILED: 'Fallido',
  REFUNDED: 'Reembolsado'
} 