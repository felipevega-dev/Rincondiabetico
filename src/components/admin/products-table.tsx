'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2, Eye, EyeOff, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  images: string[]
  isAvailable: boolean
  stock: number
  createdAt: string
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

export function ProductsTable() {
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
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

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      return
    }

    setDeleting(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts() // Refrescar la lista
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar el producto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    } finally {
      setDeleting(null)
    }
  }

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    setToggling(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      })

      if (response.ok) {
        fetchProducts() // Refrescar la lista
      } else {
        const error = await response.json()
        alert(error.error || 'Error al actualizar el producto')
      }
    } catch (error) {
      console.error('Error toggling product availability:', error)
      alert('Error al actualizar el producto')
    } finally {
      setToggling(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando productos...</p>
      </div>
    )
  }

  if (!data || data.products.length === 0) {
    return (
      <div className="p-8 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
        <p className="text-gray-600 mb-4">Crea tu primer producto para comenzar a vender</p>
        <Link href="/admin/productos/nuevo">
          <Button>Crear Producto</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
              Producto
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Categoría
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Precio
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Stock
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
              Fecha
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.category.name}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatPrice(product.price)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock} unidades
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleAvailability(product.id, product.isAvailable)}
                  disabled={toggling === product.id}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                    product.isAvailable
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {toggling === product.id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent mr-1"></div>
                  ) : product.isAvailable ? (
                    <Eye className="h-3 w-3 mr-1" />
                  ) : (
                    <EyeOff className="h-3 w-3 mr-1" />
                  )}
                  {product.isAvailable ? 'Disponible' : 'No disponible'}
                </button>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(product.createdAt).toLocaleDateString('es-CL')}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/productos/${product.id}/editar`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleting === product.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleting === product.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 