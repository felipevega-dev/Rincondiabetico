'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, Globe } from 'lucide-react'
import { Page } from '@/types'
import { toast } from 'sonner'

export function PagesTable() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      } else {
        throw new Error('Error al cargar páginas')
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
      toast.error('Error al cargar páginas')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la página "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Página eliminada correctamente')
        fetchPages()
      } else {
        throw new Error('Error al eliminar página')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      toast.error('Error al eliminar página')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando páginas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Páginas</h1>
        <Button asChild className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
          <Link href="/admin/cms/pages/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Página
          </Link>
        </Button>
      </div>

      {pages.length === 0 ? (
        <Card className="p-8 text-center">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay páginas</h3>
          <p className="text-gray-500 mb-4">Crea tu primera página de contenido</p>
          <Button asChild>
            <Link href="/admin/cms/pages/nueva">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Página
            </Link>
          </Button>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Página
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menú
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                        {page.excerpt && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {page.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={page.isActive ? "default" : "secondary"}
                        className={page.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {page.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={page.showInMenu ? "default" : "secondary"}
                        className={page.showInMenu ? "bg-blue-100 text-blue-800" : ""}
                      >
                        {page.showInMenu ? 'Sí' : 'No'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {page.order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {page.isActive && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Link href={`/${page.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Link href={`/admin/cms/pages/${page.id}/editar`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(page.id, page.title)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
} 