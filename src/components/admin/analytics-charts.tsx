'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

interface PaymentMethodData {
  paymentMethod: string
  _sum: { total: number }
  _count: { id: number }
}

interface CategoryData {
  id: string
  name: string
  revenue: number
  quantity: number
  orders: number
}

interface AnalyticsChartsProps {
  paymentMethods: PaymentMethodData[]
  categories: CategoryData[]
  className?: string
}

export function AnalyticsCharts({ 
  paymentMethods, 
  categories,
  className = ""
}: AnalyticsChartsProps) {
  // Calcular total para porcentajes
  const totalPaymentRevenue = paymentMethods.reduce((sum, method) => sum + (method._sum.total || 0), 0)
  const totalCategoryRevenue = categories.reduce((sum, cat) => sum + (cat.revenue || 0), 0)

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'MERCADOPAGO':
        return 'MercadoPago'
      case 'TRANSFER':
        return 'Transferencia'
      default:
        return method || 'Sin especificar'
    }
  }

  const getPaymentMethodColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500'
    ]
    return colors[index % colors.length]
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-teal-500',
      'bg-rose-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Payment Methods Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Métodos de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay datos de métodos de pago</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method, index) => {
                const percentage = totalPaymentRevenue > 0 
                  ? ((method._sum.total || 0) / totalPaymentRevenue * 100)
                  : 0
                
                return (
                  <div key={method.paymentMethod || index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getPaymentMethodColor(index)}`}></div>
                        <span className="text-sm font-medium">
                          {getPaymentMethodLabel(method.paymentMethod)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatPrice(method._sum.total || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {method._count.id} pedidos
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getPaymentMethodColor(index)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{percentage.toFixed(1)}% del total</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Categorías Más Vendidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay datos de categorías</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.slice(0, 5).map((category, index) => {
                const percentage = totalCategoryRevenue > 0 
                  ? ((category.revenue || 0) / totalCategoryRevenue * 100)
                  : 0
                
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium">
                          #{index + 1}
                        </div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatPrice(category.revenue || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.quantity || 0} unidades
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCategoryColor(index)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{percentage.toFixed(1)}% del total</span>
                      <span>{category.orders || 0} pedidos</span>
                    </div>
                  </div>
                )
              })}
              
              {categories.length > 5 && (
                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-sm text-gray-500">
                    Mostrando top 5 de {categories.length} categorías
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}