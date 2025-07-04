'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Package, TrendingDown } from 'lucide-react'

interface LowStockProduct {
  id: string
  name: string
  stock: number
  isAvailable: boolean
}

export default function StockAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchLowStockProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/stock/low-stock')
      if (response.ok) {
        const data = await response.json()
        setLowStockProducts(data.products || [])
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error obteniendo productos con stock bajo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLowStockProducts()
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchLowStockProducts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const criticalProducts = lowStockProducts.filter(p => p.stock === 0)
  const lowProducts = lowStockProducts.filter(p => p.stock > 0 && p.stock <= 5)

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">{criticalProducts.length}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-orange-600">{lowProducts.length}</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                <TrendingDown className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alertas</p>
                <p className="text-2xl font-bold text-blue-600">{lowStockProducts.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de productos con stock bajo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📦 Productos con Stock Bajo
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastUpdate && (
                <span className="text-xs text-gray-500">
                  Actualizado: {lastUpdate.toLocaleTimeString('es-CL')}
                </span>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={fetchLowStockProducts}
                disabled={isLoading}
              >
                {isLoading ? '⟳' : '🔄'} Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando...</span>
            </div>
          ) : lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-gray-600">¡Todos los productos tienen stock suficiente!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Productos sin stock (crítico) */}
              {criticalProducts.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                    🚨 Crítico - Sin Stock
                  </h4>
                  <div className="space-y-2">
                    {criticalProducts.map(product => (
                      <div 
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🔴</span>
                          <div>
                            <p className="font-medium text-red-900">{product.name}</p>
                            <p className="text-sm text-red-700">
                              {product.isAvailable ? 'Visible en tienda' : 'Oculto de tienda'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            {product.stock} unidades
                          </Badge>
                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => window.open(`/admin/productos/${product.id}/editar`, '_blank')}
                          >
                            Reabastecer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Productos con stock bajo */}
              {lowProducts.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                    ⚠️ Stock Bajo (≤5 unidades)
                  </h4>
                  <div className="space-y-2">
                    {lowProducts.map(product => (
                      <div 
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {product.stock <= 2 ? '🟠' : '🟡'}
                          </span>
                          <div>
                            <p className="font-medium text-orange-900">{product.name}</p>
                            <p className="text-sm text-orange-700">
                              {product.isAvailable ? 'Visible en tienda' : 'Oculto de tienda'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            product.stock <= 2 
                              ? "bg-orange-100 text-orange-800 border-orange-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }>
                            {product.stock} unidades
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`/admin/productos/${product.id}/editar`, '_blank')}
                          >
                            Editar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
