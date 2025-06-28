'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, VariationType } from '@/types'
import { useToast } from '@/components/providers/toast-provider'

interface CartContextType {
  items: CartItem[]
  isLoaded: boolean
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
  const { showToast } = useToast()

  useEffect(() => {
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
    }
  }, [items, isLoaded])

  const addItem = (product: {
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
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Usar setTimeout para evitar setState durante render
        setTimeout(() => {
          showToast(`${product.name} cantidad actualizada en el carrito`, 'success')
        }, 0)
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Usar setTimeout para evitar setState durante render
        setTimeout(() => {
          showToast(`${product.name} agregado al carrito`, 'success')
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
  }

  const removeItem = (itemId: string) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.id === itemId)
      if (item) {
        // Usar setTimeout para evitar setState durante render
        setTimeout(() => {
          showToast(`${item.name} removido del carrito`, 'info')
        }, 0)
      }
      return currentItems.filter(item => item.id !== itemId)
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    // Usar setTimeout para evitar setState durante render
    setTimeout(() => {
      showToast('Carrito vaciado', 'info')
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