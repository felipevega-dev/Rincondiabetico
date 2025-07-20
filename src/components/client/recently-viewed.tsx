'use client'

import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { X, Clock, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'

interface RecentlyViewedProps {
  title?: string
  limit?: number
  excludeIds?: string[]
  showRemoveButton?: boolean
  showAddToCart?: boolean
  compact?: boolean
}

export function RecentlyViewed({ 
  title = "Productos vistos recientemente",
  limit = 8,
  excludeIds = [],
  showRemoveButton = false,
  showAddToCart = true,
  compact = false
}: RecentlyViewedProps) {
  const { getRecentlyViewed, removeFromRecentlyViewed, isLoaded, hasRecentlyViewed } = useRecentlyViewed()
  const { addItem } = useCart()

  const products = getRecentlyViewed(excludeIds, limit)

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  // No mostrar nada mientras carga
  if (!isLoaded) {
    return null
  }

  // No mostrar si no hay productos
  if (!hasRecentlyViewed || products.length === 0) {
    return null
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                <p className="text-xs text-gray-500">{product.category}</p>
                <p className="text-sm font-semibold text-primary-600">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {products.length > 4 && (
          <Link
            href="/historial"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todos ({products.length})
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-6 w-6 text-gray-500" />
          {title}
        </h2>
        {products.length > 0 && (
          <span className="text-sm text-gray-500">
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Imagen del producto */}
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Link href={`/productos/${product.slug}`}>
                  <Image
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {/* Botón de remover */}
                {showRemoveButton && (
                  <button
                    onClick={() => removeFromRecentlyViewed(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    aria-label="Remover del historial"
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </button>
                )}

                {/* Timestamp del vistazo */}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {formatRelativeTime(product.viewedAt)}
                  </span>
                </div>
              </div>

              {/* Información del producto */}
              <div className="p-3">
                <div className="mb-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                
                <Link href={`/productos/${product.slug}`}>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </div>
                </div>

                {/* Botón de agregar al carrito */}
                {showAddToCart && (
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-2"
                    size="sm"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Agregar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return minutes <= 1 ? 'Ahora' : `${minutes}m`
  } else if (hours < 24) {
    return `${hours}h`
  } else {
    return `${days}d`
  }
}