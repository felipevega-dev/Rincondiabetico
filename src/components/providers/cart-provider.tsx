'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, VariationType } from '@/types'
import { toast } from 'sonner'

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
      const response = await fetch(`/api/products/${productId}/stock`)
      const { stock } = await response.json()

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === product.id)
        
        if (existingItem) {
          if (existingItem.quantity >= stock) {
            toast.error(`No hay más stock disponible de ${product.name}`)
            return currentItems
          }

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
      const response = await fetch(`/api/products/${item.productId}/stock`)
      const { stock } = await response.json()
      
      if (quantity > stock) {
        toast.error(`Solo hay ${stock} unidades disponibles`)
        quantity = stock
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

  const clearCart = () => {
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