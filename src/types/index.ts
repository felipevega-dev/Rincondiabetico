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

export enum VariationType {
  SIZE = 'SIZE',
  INGREDIENT = 'INGREDIENT'
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
  subtitle?: string | null
  description?: string | null
  image: string
  buttonText?: string | null
  buttonLink?: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type StoreSettings = {
  id: string
  storeName: string
  address: string
  phone: string
  email: string
  whatsapp: string
  description?: string | null
  openingHours: {
    weekdays: {
      open: string
      close: string
      isOpen: boolean
    }
    saturday: {
      open: string
      close: string
      isOpen: boolean
    }
    sunday: {
      open: string
      close: string
      isOpen: boolean
    }
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    whatsapp?: string
    email?: string
  }
  isOpen: boolean
  createdAt: Date
  updatedAt: Date
}

export type Page = {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  isActive: boolean
  showInMenu: boolean
  order: number
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

export type ProductVariation = {
  id: string
  type: VariationType
  name: string
  description?: string | null
  priceChange: number
  isAvailable: boolean
  order: number
  servingSize?: number | null
  productId: string
  createdAt: Date
  updatedAt: Date
}

// Tipos extendidos con relaciones
export type ProductWithCategory = Product & {
  category: Category
}

export type ProductWithVariations = Product & {
  category: Category
  variations: ProductVariation[]
}

export type CartItem = {
  id: string
  productId?: string
  name: string
  price: number
  quantity: number
  image?: string
  variations?: {
    id: string
    name: string
    priceChange: number
    type: VariationType
  }[]
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
  variations?: {
    type: VariationType
    name: string
    description?: string
    priceChange: number
    servingSize?: number
    order: number
  }[]
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

export type CreateVariationForm = {
  type: VariationType
  name: string
  description?: string
  priceChange: number
  servingSize?: number
  order: number
  isAvailable: boolean
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

export const VARIATION_TYPE_LABELS: Record<VariationType, string> = {
  SIZE: 'Tamaño',
  INGREDIENT: 'Ingrediente'
}

// Tamaños predefinidos
export const DEFAULT_SIZES = [
  { name: '4 personas', servingSize: 4, priceChange: 0 },
  { name: '8 personas', servingSize: 8, priceChange: 5000 },
  { name: '15 personas', servingSize: 15, priceChange: 12000 }
] 