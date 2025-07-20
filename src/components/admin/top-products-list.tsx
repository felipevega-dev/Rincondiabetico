'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { Package } from 'lucide-react'

interface TopProductsListProps {
  products: Array<{
    product?: {
      id: string
      name: string
      images?: string[]
    }
    quantity: number
    revenue: number
    orders: number
  }>
  title?: string
  limit?: number
  showRevenue?: boolean
  showOrders?: boolean
}

export function TopProductsList({ 
  products, 
  title = "Productos Más Vendidos",
  limit = 10,
  showRevenue = true,
  showOrders = true 
}: TopProductsListProps) {
  const displayProducts = products.slice(0, limit)

  if (displayProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay datos de productos disponibles</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="secondary">{displayProducts.length} productos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayProducts.map((item, index) => (
            <div 
              key={item.product?.id || index} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                  #{index + 1}
                </div>
                
                {item.product?.images?.[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name || 'Producto'}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                
                <div>
                  <p className="font-medium text-gray-900">
                    {item.product?.name || 'Producto sin nombre'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} unidades vendidas
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 text-right">
                {showRevenue && (
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.revenue)}
                    </p>
                    <p className="text-xs text-gray-500">Ingresos</p>
                  </div>
                )}
                
                {showOrders && (
                  <div>
                    <p className="font-medium text-gray-700">
                      {item.orders}
                    </p>
                    <p className="text-xs text-gray-500">Pedidos</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {products.length > limit && (
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-sm text-gray-500">
              Mostrando {limit} de {products.length} productos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}