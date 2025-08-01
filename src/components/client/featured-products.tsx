import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from './add-to-cart-button'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import { VariationType } from '@/types'

// Function to calculate price range
const calculatePriceRange = (basePrice: number, variations?: any[]) => {
  if (!variations || variations.length === 0) {
    return `$${basePrice.toLocaleString('es-CL')}`
  }

  const priceChanges = variations.map(v => v.priceChange)
  const minChange = Math.min(0, ...priceChanges)
  const maxChange = Math.max(0, ...priceChanges)

  const minPrice = basePrice + minChange
  const maxPrice = basePrice + maxChange

  if (minPrice === maxPrice) {
    return `$${basePrice.toLocaleString('es-CL')}`
  }

  return `$${minPrice.toLocaleString('es-CL')} - $${maxPrice.toLocaleString('es-CL')}`
}

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
        isActive: true
      },
      include: {
        variations: {
          orderBy: { order: 'asc' }
        }
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    // Fallback: obtener productos más recientes si no hay destacados
    return await prisma.product.findMany({
      where: {
        isAvailable: true,
        isActive: true
      },
      include: {
        variations: {
          orderBy: { order: 'asc' }
        }
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (products.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Productos Destacados
            </h2>
            <p className="text-gray-700 mb-8">
              Próximamente tendremos productos disponibles
            </p>
            <Link
              href="/admin/productos"
              className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              Agregar Productos
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Productos Destacados
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Descubre nuestros dulces más populares, elaborados especialmente para diabéticos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:transform hover:scale-105"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-6xl">🍰</span>
                  </div>
                )}
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Destacado
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-600">
                    {calculatePriceRange(product.price, product.variations)}
                  </span>
                  {!product.isAvailable && (
                    <span className="text-sm text-red-600 font-medium">
                      No disponible
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/productos/${product.slug}`}
                    className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
                  >
                    Ver Detalles
                  </Link>
                  {product.isAvailable && (
                    product.variations && product.variations.length > 0 ? (
                      <Link href={`/productos/${product.slug}`}>
                        <Button className="bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors">
                          <Package className="h-4 w-4 mr-1" />
                          Opciones
                        </Button>
                      </Link>
                    ) : (
                      <AddToCartButton
                        productId={product.id}
                        productName={product.name}
                        productPrice={product.price}
                        productImage={product.images?.[0]}
                        productStock={product.stock}
                        className="bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors"
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link
            href="/productos"
            className="inline-block bg-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>
    </section>
  )
} 