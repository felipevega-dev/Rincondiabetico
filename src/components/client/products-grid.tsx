'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/client/add-to-cart-button'
import { Package } from 'lucide-react'
import { VariationType } from '@/types'
import { Button } from '@/components/ui/button'

interface Product {
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
  variations?: {
    id: string
    type: VariationType
    name: string
    description?: string | null
    priceChange: number
    servingSize?: number | null
    order: number
    isAvailable: boolean
  }[]
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Function to calculate price range
const calculatePriceRange = (basePrice: number, variations?: Product['variations']) => {
  if (!variations || variations.length === 0) {
    return formatPrice(basePrice)
  }

  const priceChanges = variations.map(v => v.priceChange)
  const minChange = Math.min(0, ...priceChanges)
  const maxChange = Math.max(0, ...priceChanges)

  const minPrice = basePrice + minChange
  const maxPrice = basePrice + maxChange

  if (minPrice === maxPrice) {
    return formatPrice(basePrice)
  }

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}

export function ProductsGrid() {
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const search = searchParams.get('search')
  const ITEMS_PER_PAGE = 9

  useEffect(() => {
    fetchProducts()
  }, [categoryId, search, currentPage])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoryId) params.append('categoryId', categoryId)
      if (search) params.append('search', search)
      params.append('available', 'true')
      params.append('page', currentPage.toString())
      params.append('limit', ITEMS_PER_PAGE.toString())

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay productos disponibles
        </h3>
        <p className="text-gray-600">
          {search || categoryId 
            ? 'No se encontraron productos con los filtros aplicados'
            : 'Aún no tenemos productos en nuestro catálogo'
          }
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Mostrando {data.products.length} de {data.pagination.total} productos
        </p>
        {/* Sorting dropdown - TODO */}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow group flex flex-col h-full">
            <Link href={`/productos/${product.slug}`} className="flex-1 flex flex-col">
              {/* Product image */}
              <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    {product.category.name}
                  </span>
                </div>
              </div>

              {/* Product info */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                )}

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      {calculatePriceRange(product.price, product.variations)}
                    </span>
                    {product.stock > 0 && (
                      <span className="text-sm text-gray-600">
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>
                  
                  <div onClick={(e) => e.preventDefault()}>
                    {product.variations && product.variations.length > 0 ? (
                      <Link href={`/productos/${product.slug}`}>
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 text-lg font-semibold shadow-lg shadow-pink-200">
                          Ver Opciones
                        </Button>
                      </Link>
                    ) : (
                      <AddToCartButton
                        productId={product.id}
                        productName={product.name}
                        productPrice={product.price}
                        productImage={product.images[0]}
                        productStock={product.stock}
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 text-lg font-semibold shadow-lg shadow-pink-200"
                      />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          {[...Array(data.pagination.pages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(data.pagination.pages, p + 1))}
            disabled={currentPage === data.pagination.pages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
} 