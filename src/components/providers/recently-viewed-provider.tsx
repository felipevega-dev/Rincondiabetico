'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'

interface RecentlyViewedProduct {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string
}

interface RecentlyViewedContextType {
  recentlyViewed: (RecentlyViewedProduct & { viewedAt: number })[]
  isLoaded: boolean
  addToRecentlyViewed: (product: RecentlyViewedProduct) => void
  removeFromRecentlyViewed: (productId: string) => void
  clearRecentlyViewed: () => void
  getRecentlyViewed: (excludeIds?: string[], limit?: number) => (RecentlyViewedProduct & { viewedAt: number })[]
  hasRecentlyViewed: boolean
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const recentlyViewedData = useRecentlyViewed()

  return (
    <RecentlyViewedContext.Provider value={recentlyViewedData}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewedContext() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error('useRecentlyViewedContext must be used within a RecentlyViewedProvider')
  }
  return context
}

// Hook para trackear cuando se visita una página de producto
export function useTrackProductView() {
  const { addToRecentlyViewed } = useRecentlyViewedContext()

  const trackView = (product: RecentlyViewedProduct) => {
    addToRecentlyViewed(product)
  }

  return { trackView }
}