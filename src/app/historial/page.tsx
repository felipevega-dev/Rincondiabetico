'use client'

import { Button } from '@/components/ui/button'
import { RecentlyViewed } from '@/components/client/recently-viewed'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { ArrowLeft, Trash2, Clock } from 'lucide-react'
import Link from 'next/link'

export default function HistorialPage() {
  const { recentlyViewed, clearRecentlyViewed, hasRecentlyViewed, isLoaded } = useRecentlyViewed()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary-600" />
                Historial de navegación
              </h1>
              <p className="text-gray-600 mt-2">
                Productos que has visitado recientemente
              </p>
            </div>

            {hasRecentlyViewed && (
              <Button
                variant="outline"
                onClick={clearRecentlyViewed}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar historial
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {!hasRecentlyViewed ? (
          <div className="text-center py-16">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tu historial está vacío
            </h2>
            <p className="text-gray-600 mb-6">
              Explora nuestros productos para comenzar a crear tu historial de navegación
            </p>
            <Link href="/productos">
              <Button>
                Explorar productos
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {recentlyViewed.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Productos visitados
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {new Set(recentlyViewed.map(p => p.category)).size}
                  </div>
                  <div className="text-sm text-gray-600">
                    Categorías exploradas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {(() => {
                      const oldestView = Math.min(...recentlyViewed.map(p => p.viewedAt))
                      const days = Math.ceil((Date.now() - oldestView) / (1000 * 60 * 60 * 24))
                      return days
                    })()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Días de historial
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow">
              <RecentlyViewed
                title=""
                limit={50}
                showRemoveButton={true}
                showAddToCart={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}