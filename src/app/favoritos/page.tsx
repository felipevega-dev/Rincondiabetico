'use client'

import { useWishlist } from '@/hooks/use-wishlist'
import { useUser } from '@clerk/nextjs'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WishlistButton } from '@/components/client/wishlist-button'
import { AddToCartButton } from '@/components/client/add-to-cart-button'
import { Heart, ShoppingBag, ArrowLeft, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function WishlistPage() {
  const { user } = useUser()
  const { items, isLoading, itemCount } = useWishlist()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Inicia sesión para ver tus favoritos
            </h2>
            <p className="text-gray-600 mb-6">
              Crea una cuenta o inicia sesión para guardar tus productos favoritos.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/sign-in">Iniciar sesión</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">Crear cuenta</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 text-pink-600 hover:text-pink-700">
            <Link href="/productos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar comprando
            </Link>
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
          </div>
          
          <p className="text-gray-600">
            {itemCount === 0 
              ? 'No tienes productos favoritos aún' 
              : `${itemCount} ${itemCount === 1 ? 'producto favorito' : 'productos favoritos'}`
            }
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Tu lista de favoritos está vacía
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Explora nuestros deliciosos productos y guarda tus favoritos haciendo clic en el corazón.
            </p>
            <Button asChild size="lg">
              <Link href="/productos">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Explorar productos
              </Link>
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200 relative">
                {/* Wishlist Button */}
                <WishlistButton
                  productId={item.product.id}
                  variant="icon"
                  size="sm"
                  className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm"
                />

                <Link href={`/productos/${item.product.slug}`}>
                  <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    {item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {item.product.category.name}
                      </span>
                    </div>
                  </div>
                </Link>

                <CardContent className="p-4">
                  <Link href={`/productos/${item.product.slug}`}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  {item.product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(item.product.price)}
                    </span>
                    {item.product.stock > 0 && (
                      <span className="text-sm text-gray-600">
                        Stock: {item.product.stock}
                      </span>
                    )}
                  </div>

                  {/* Added date */}
                  <p className="text-xs text-gray-500 mb-4">
                    Agregado el {new Date(item.addedAt).toLocaleDateString('es-CL')}
                  </p>

                  {/* Actions */}
                  <div className="space-y-2">
                    {item.product.variations && item.product.variations.length > 0 ? (
                      <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
                        <Link href={`/productos/${item.product.slug}`}>
                          Ver opciones
                        </Link>
                      </Button>
                    ) : (
                      <AddToCartButton
                        productId={item.product.id}
                        productName={item.product.name}
                        productPrice={item.product.price}
                        productImage={item.product.images[0]}
                        productStock={item.product.stock}
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}