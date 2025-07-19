'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

interface WishlistProduct {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  images: string[]
  isAvailable: boolean
  stock: number
  category: {
    id: string
    name: string
  }
  variations?: Array<{
    id: string
    type: string
    name: string
    description?: string | null
    priceChange: number
    servingSize?: number | null
    order: number
    isAvailable: boolean
  }>
}

interface WishlistItem {
  id: string
  product: WishlistProduct
  addedAt: string
}

interface UseWishlistReturn {
  items: WishlistItem[]
  isLoading: boolean
  isInWishlist: (productId: string) => boolean
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  toggleWishlist: (productId: string) => Promise<boolean>
  refreshWishlist: () => Promise<void>
  itemCount: number
}

export function useWishlist(): UseWishlistReturn {
  const { user } = useUser()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Cargar wishlist cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      refreshWishlist()
    } else {
      setItems([])
    }
  }, [user])

  const refreshWishlist = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.product.id === productId)
  }

  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar a favoritos')
      return false
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (response.ok) {
        if (data.alreadyExists) {
          toast.info(data.message)
        } else {
          toast.success(data.message)
          await refreshWishlist()
        }
        return true
      } else {
        toast.error(data.error || 'Error al agregar a favoritos')
        return false
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Error al agregar a favoritos')
      return false
    }
  }

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        await refreshWishlist()
        return true
      } else {
        toast.error(data.error || 'Error al remover de favoritos')
        return false
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Error al remover de favoritos')
      return false
    }
  }

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId)
    } else {
      return await addToWishlist(productId)
    }
  }

  return {
    items,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist,
    itemCount: items.length
  }
}