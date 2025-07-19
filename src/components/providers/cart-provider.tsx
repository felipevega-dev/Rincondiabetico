'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, VariationType } from '@/types'
import { toast } from 'sonner'

interface CartContextType {
  items: CartItem[]
  isLoaded: boolean
  sessionId: string
  addItem: (product: {
    id: string
    productId?: string
    name: string
    price: number
    image?: string
    variations?: {
      id: string
      name: string
      priceChange: number
      type: VariationType
    }[]
  }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
  itemCount: number
  subtotal: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    // Generate or retrieve session ID
    let savedSessionId = localStorage.getItem('rincon-diabetico-session')
    if (!savedSessionId) {
      savedSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('rincon-diabetico-session', savedSessionId)
    }
    setSessionId(savedSessionId)

    const savedCart = localStorage.getItem('rincon-diabetico-cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rincon-diabetico-cart', JSON.stringify(items))
      // Reserve stock for items in cart
      if (sessionId && items.length > 0) {
        reserveCartStock()
      }
    }
  }, [items, isLoaded, sessionId])

  const reserveCartStock = async () => {
    for (const item of items) {
      try {
        await fetch('/api/stock/reserve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            sessionId
          })
        })
      } catch (error) {
        console.error('Error reserving stock for item:', item.id, error)
      }
    }
  }

  const addItem = async (product: {
    id: string
    productId?: string
    name: string
    price: number
    image?: string
    variations?: {
      id: string
      name: string
      priceChange: number
      type: VariationType
    }[]
  }) => {
    try {
      const productId = product.productId || product.id
      
      // Check available stock (considering reservations)
      const stockResponse = await fetch(`/api/stock/available?productId=${productId}`)
      const { availableStock } = await stockResponse.json()

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === product.id)
        const currentQuantity = existingItem ? existingItem.quantity : 0
        const newQuantity = currentQuantity + 1
        
        if (newQuantity > availableStock) {
          toast.error(`No hay más stock disponible de ${product.name}`)
          return currentItems
        }

        if (existingItem) {
          setTimeout(() => {
            toast.success(`${product.name} cantidad actualizada en el carrito`)
          }, 0)
          return currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          setTimeout(() => {
            toast.success(`${product.name} agregado al carrito`)
          }, 0)
          const newItem: CartItem = {
            id: product.id,
            productId: product.productId || product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            variations: product.variations
          }
          return [...currentItems, newItem]
        }
      })
    } catch (error) {
      console.error('Error checking stock:', error)
      toast.error('Error al verificar stock disponible')
    }
  }

  const removeItem = (itemId: string) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.id === itemId)
      if (item) {
        setTimeout(() => {
          toast.info(`${item.name} removido del carrito`)
        }, 0)
      }
      return currentItems.filter(item => item.id !== itemId)
    })
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    const item = items.find(item => item.id === itemId)
    if (!item) return

    try {
      // Check available stock (considering reservations)
      const stockResponse = await fetch(`/api/stock/available?productId=${item.productId}`)
      const { availableStock } = await stockResponse.json()
      
      if (quantity > availableStock) {
        toast.error(`Solo hay ${availableStock} unidades disponibles`)
        quantity = availableStock
      }
    } catch (error) {
      console.error('Error checking stock:', error)
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = async () => {
    // Release all stock reservations for this session
    if (sessionId) {
      try {
        await fetch('/api/stock/reserve', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        })
      } catch (error) {
        console.error('Error releasing stock reservations:', error)
      }
    }
    
    setItems([])
    setTimeout(() => {
      toast.info('Carrito vaciado')
    }, 0)
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotal = () => {
    return getSubtotal()
  }

  const getItemQuantity = (productId: string) => {
    const item = items.find(item => item.productId === productId)
    return item ? item.quantity : 0
  }

  const value: CartContextType = {
    items,
    isLoaded,
    sessionId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    itemCount: getItemCount(),
    subtotal: getSubtotal(),
    total: getTotal(),
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 