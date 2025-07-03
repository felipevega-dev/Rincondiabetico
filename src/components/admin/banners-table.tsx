'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Edit, Trash2, Plus, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
import { Banner } from '@/types'
import { toast } from 'sonner'

export function BannersTable() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data)
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      toast.error('Error al cargar banners')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const banner = banners.find(b => b.id === id)
      if (!banner) return

      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...banner,
          isActive: !isActive
        }),
      })

      if (response.ok) {
        setBanners(prev => 
          prev.map(b => 
            b.id === id ? { ...b, isActive: !isActive } : b
          )
        )
        toast.success(
          `Banner ${!isActive ? 'activado' : 'desactivado'} correctamente`
        )
      }
    } catch (error) {
      console.error('Error toggling banner:', error)
      toast.error('Error al cambiar estado del banner')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este banner?')) return

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBanners(prev => prev.filter(b => b.id !== id))
        toast.success('Banner eliminado correctamente')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Error al eliminar banner')
    }
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= banners.length) return

    try {
      const banner = banners[currentIndex]
      const targetBanner = banners[newIndex]

      // Intercambiar órdenes
      await Promise.all([
        fetch(`/api/banners/${banner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...banner, order: targetBanner.order }),
        }),
        fetch(`/api/banners/${targetBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...targetBanner, order: banner.order }),
        })
      ])

      // Recargar banners
      fetchBanners()
      toast.success('Orden actualizado correctamente')
    } catch (error) {
      console.error('Error reordering banner:', error)
      toast.error('Error al reordenar banner')
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Cargando banners...</div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Banners</h1>
        <Button asChild className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
          <Link href="/admin/cms/banners/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Banner
          </Link>
        </Button>
      </div>

      {banners.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay banners
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando tu primer banner para el carousel.
            </p>
            <Button asChild>
              <Link href="/admin/cms/banners/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer banner
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner, index) => (
            <Card key={banner.id} className="p-4">
              <div className="flex items-center gap-4">
                {/* Imagen */}
                <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                      {banner.subtitle && (
                        <p className="text-sm text-gray-600">{banner.subtitle}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                          {banner.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Orden: {banner.order}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      {/* Reordenar */}
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(banner.id, 'up')}
                          disabled={index === 0}
                          className="h-6 px-2"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(banner.id, 'down')}
                          disabled={index === banners.length - 1}
                          className="h-6 px-2"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Toggle activo */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(banner.id, banner.isActive)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {banner.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Editar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Link href={`/admin/cms/banners/${banner.id}/editar`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      {/* Eliminar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}