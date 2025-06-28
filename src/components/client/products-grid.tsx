'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/client/add-to-cart-button'
import { Package } from 'lucide-react'

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

export function ProductsGrid() {
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const search = searchParams.get('search')

  useEffect(() => {
    fetchProducts()
  }, [categoryId, search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoryId) params.append('categoryId', categoryId)
      if (search) params.append('search', search)
      params.append('available', 'true') // Solo productos disponibles

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
        {/* TODO: Add sorting options */}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow group">
            <Link href={`/productos/${product.slug}`}>
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
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.stock > 0 && (
                      <span className="text-sm text-gray-600">
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>
                  
                  <div onClick={(e) => e.preventDefault()}>
                    <AddToCartButton
                      productId={product.id}
                      productName={product.name}
                      productPrice={product.price}
                      productImage={product.images[0]}
                      productStock={product.stock}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            {/* TODO: Implement pagination */}
            <span className="text-sm text-gray-600">
              Página {data.pagination.page} de {data.pagination.pages}
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 