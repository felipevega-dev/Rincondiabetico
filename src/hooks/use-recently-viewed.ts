'use client'

import { useState, useEffect } from 'react'

interface RecentlyViewedProduct {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string
  viewedAt: number // timestamp
}

const STORAGE_KEY = 'rincondiabetico_recently_viewed'
const MAX_ITEMS = 12 // Máximo de productos en el historial

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar del localStorage al iniciar
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as RecentlyViewedProduct[]
          // Filtrar productos que tengan más de 30 días
          const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
          const filtered = parsed.filter(item => item.viewedAt > thirtyDaysAgo)
          setRecentlyViewed(filtered)
        }
      } catch (error) {
        console.error('Error loading recently viewed from storage:', error)
        // Si hay error, limpiar el storage corrupto
        localStorage.removeItem(STORAGE_KEY)
      } finally {
        setIsLoaded(true)
      }
    }

    loadFromStorage()
  }, [])

  // Guardar en localStorage cuando cambie el state
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed))
      } catch (error) {
        console.error('Error saving recently viewed to storage:', error)
      }
    }
  }, [recentlyViewed, isLoaded])

  // Agregar producto al historial
  const addToRecentlyViewed = (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
    setRecentlyViewed(current => {
      // Remover el producto si ya existe
      const filtered = current.filter(item => item.id !== product.id)
      
      // Agregar al inicio con timestamp actual
      const updated = [
        { ...product, viewedAt: Date.now() },
        ...filtered
      ]

      // Limitar el número de elementos
      return updated.slice(0, MAX_ITEMS)
    })
  }

  // Remover producto específico
  const removeFromRecentlyViewed = (productId: string) => {
    setRecentlyViewed(current => 
      current.filter(item => item.id !== productId)
    )
  }

  // Limpiar todo el historial
  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  // Obtener productos recientes excluyendo algunos IDs
  const getRecentlyViewed = (excludeIds: string[] = [], limit?: number) => {
    const filtered = recentlyViewed.filter(item => !excludeIds.includes(item.id))
    return limit ? filtered.slice(0, limit) : filtered
  }

  return {
    recentlyViewed,
    isLoaded,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewed,
    hasRecentlyViewed: recentlyViewed.length > 0
  }
}