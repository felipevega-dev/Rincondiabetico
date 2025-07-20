'use client'

import { useEffect } from 'react'
import { useTrackProductView } from '@/components/providers/recently-viewed-provider'

interface ProductViewTrackerProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    category: {
      name: string
    }
  }
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  const { trackView } = useTrackProductView()

  useEffect(() => {
    // Pequeño delay para no interferir con la carga inicial
    const timer = setTimeout(() => {
      trackView({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0] || '',
        category: product.category.name
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [product, trackView])

  // Este componente no renderiza nada visible
  return null
}