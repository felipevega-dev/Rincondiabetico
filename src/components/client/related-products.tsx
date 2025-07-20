'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { useWishlist } from '@/hooks/use-wishlist'

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category: {
    id: string
    name: string
  }
  isAvailable: boolean
  stock: number
}

interface RelatedProductsProps {
  productId: string
  title?: string
  limit?: number
}

export function RelatedProducts({ productId, title = "Productos Relacionados", limit = 4 }: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/related?limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [productId, limit])

  const handleAddToCart = (product: RelatedProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder-product.jpg',
      quantity: 1
    })
  }

  const handleWishlistToggle = (product: RelatedProduct) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Imagen del producto */}
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Link href={`/productos/${product.slug}`}>
                  <Image
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {/* Botón de wishlist */}
                <button
                  onClick={() => handleWishlistToggle(product)}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  aria-label={isInWishlist(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      isInWishlist(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    } transition-colors`}
                  />
                </button>

                {/* Badge de stock */}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      ¡Últimas {product.stock}!
                    </span>
                  </div>
                )}

                {product.stock === 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Agotado
                    </span>
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category.name}
                  </span>
                </div>
                
                <Link href={`/productos/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </div>
                </div>

                {/* Botón de agregar al carrito */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.isAvailable || product.stock === 0}
                  className="w-full mt-3"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? 'Agotado' : 'Agregar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}