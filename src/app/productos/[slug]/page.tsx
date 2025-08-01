import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, Package } from 'lucide-react'
import { AddToCartButton } from '@/components/client/add-to-cart-button'
import { WishlistButton } from '@/components/client/wishlist-button'
import { ProductVariationsSelector } from '@/components/client/product-variations-selector'
import { ProductImageCollage } from '@/components/client/product-image-collage'
import { RelatedProducts } from '@/components/client/related-products'
import { ProductViewTracker } from '@/components/client/product-view-tracker'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { 
        slug,
        isAvailable: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        variations: {
          where: {
            isAvailable: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-pink-600">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-pink-600">
            Productos
          </Link>
          <span>/</span>
          <Link 
            href={`/productos?categoryId=${product.category.id}`}
            className="hover:text-pink-600"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <Link 
          href="/productos"
          className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a productos
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="p-4">
              <ProductImageCollage
                images={product.images || []}
                productName={product.name}
                className="w-full"
              />
            </div>

            <div className="p-6 lg:p-8">
              <div className="mb-4">
                <Link 
                  href={`/productos?categoryId=${product.category.id}`}
                  className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-pink-200 transition-colors"
                >
                  {product.category.name}
                </Link>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    {product.variations && product.variations.length > 0 ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900">
                          {(() => {
                            const minPrice = product.price + Math.min(...product.variations.map(v => v.priceChange), 0)
                            const maxPrice = product.price + Math.max(...product.variations.map(v => v.priceChange), 0)
                            return minPrice === maxPrice 
                              ? formatPrice(minPrice)
                              : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                          })()}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">
                          Varía según tamaño y opciones
                        </div>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Stock disponible</div>
                    <div className={`text-lg font-semibold ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                    </div>
                  </div>
                </div>
              </div>

              {product.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Descripción
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-green-700 font-medium">
                    Disponible para retiro
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Retiro en tienda - Chiguayante
                </p>
              </div>

              <div className="space-y-4">
                {product.variations && product.variations.length > 0 ? (
                  <ProductVariationsSelector
                    productId={product.id}
                    productName={product.name}
                    basePrice={product.price}
                    productImage={product.images?.[0]}
                    productStock={product.stock}
                    variations={product.variations as any}
                  />
                ) : (
                  <>
                    <div className="flex gap-3">
                      <AddToCartButton 
                        productName={product.name}
                        productId={product.id}
                        productPrice={product.price}
                        productImage={product.images?.[0]}
                        productStock={product.stock}
                        className="flex-1"
                      />
                      <WishlistButton
                        productId={product.id}
                        variant="outline"
                        size="lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      * Solo retiro en tienda física
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>


        </div>

        {/* Productos relacionados */}
        <RelatedProducts 
          productId={product.id}
          title="Productos relacionados"
          limit={4}
        />

        {/* Tracker para historial de navegación */}
        <ProductViewTracker product={product} />
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Producto no encontrado',
    }
  }

  return {
    title: `${product.name} - Rincón Diabético`,
    description: product.description || `${product.name} - Deliciosos postres artesanales en Chiguayante`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
} 