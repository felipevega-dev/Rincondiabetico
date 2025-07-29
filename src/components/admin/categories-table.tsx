'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  _count: {
    products: number
  }
}

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
      return
    }

    setDeleting(categoryId)
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar la categoría')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error al eliminar la categoría')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando categorías...</p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="p-8 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
        <p className="text-gray-600 mb-4">Crea tu primera categoría para organizar los productos</p>
        <Link href="/admin/categorias/nueva">
          <Button>Crear Categoría</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Productos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600 max-w-xs truncate">
                  {category.description || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  {category._count.products} productos
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(category.createdAt).toLocaleDateString('es-CL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/categorias/${category.id}/editar`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id, category.name)}
                    disabled={deleting === category.id || category._count.products > 0}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleting === category.id ? (
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