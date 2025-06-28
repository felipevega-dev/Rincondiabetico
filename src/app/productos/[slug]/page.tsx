import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, Package } from 'lucide-react'
import { AddToCartButton } from '@/components/client/add-to-cart-button'
import { ProductVariationsSelector } from '@/components/client/product-variations-selector'

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
            <div className="aspect-square lg:aspect-auto">
              {product.images && product.images.length > 0 ? (
                <div className="relative h-96 lg:h-full">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {product.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      +{product.images.length - 1} más
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 lg:h-full bg-gray-200 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
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
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.variations && product.variations.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        Precio base - Varía según tamaño y opciones
                      </div>
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
                    <AddToCartButton 
                      productName={product.name}
                      productId={product.id}
                      productPrice={product.price}
                      productImage={product.images?.[0]}
                      productStock={product.stock}
                    />
                    <p className="text-sm text-gray-600 text-center">
                      * Solo retiro en tienda física
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {product.images && product.images.length > 1 && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Más imágenes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.slice(1).map((image: string, index: number) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} - imagen ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Productos relacionados
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-center">
              Próximamente: productos relacionados de la categoría {product.category.name}
            </p>
          </div>
        </div>
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