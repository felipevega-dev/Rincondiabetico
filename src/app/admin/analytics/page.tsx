'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

interface SalesAnalytics {
  summary: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    revenueChange: number
    orderCountChange: number
  }
  ordersByStatus: Array<Record<string, unknown>>
  dailySales: Array<Record<string, unknown>>
  topProducts: Array<Record<string, unknown>>
  topCategories: Array<Record<string, unknown>>
  paymentMethods: Array<Record<string, unknown>>
  customerAnalysis: Array<Record<string, unknown>>
  hourlyActivity: Array<Record<string, unknown>>
  period: number
}

interface ProductAnalytics {
  productPerformance: Array<Record<string, unknown>>
  lowStockProducts: Array<Record<string, unknown>>
  neverSoldProducts: Array<Record<string, unknown>>
  stockValue: {
    totalUnits: number
    totalValue: number
  }
  categoryPerformance: Array<Record<string, unknown>>
  trendAnalysis: Array<Record<string, unknown>>
}

interface CustomerAnalytics {
  summary: {
    totalCustomers: number
    activeCustomers: number
    newCustomers: number
    retentionRate: number
  }
  customerSegmentation: Array<Record<string, unknown>>
  topCustomers: Array<Record<string, unknown>>
  retentionAnalysis: Array<Record<string, unknown>>
  customerType: Array<Record<string, unknown>>
  geographicAnalysis: Array<Record<string, unknown>>
  inactiveCustomers: Array<Record<string, unknown>>
  wishlistAnalysis: Record<string, unknown>
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'products' | 'customers'>('sales')
  const [period, setPeriod] = useState('30')
  const [isLoading, setIsLoading] = useState(true)
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null)
  const [productsData, setProductsData] = useState<ProductAnalytics | null>(null)
  const [customersData, setCustomersData] = useState<CustomerAnalytics | null>(null)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const endpoints = [
        `/api/admin/analytics/sales?period=${period}`,
        `/api/admin/analytics/products?period=${period}`,
        `/api/admin/analytics/customers?period=${period}`
      ]

      const [salesRes, productsRes, customersRes] = await Promise.all(
        endpoints.map(endpoint => fetch(endpoint))
      )

      if (salesRes.ok) setSalesData(await salesRes.json())
      if (productsRes.ok) setProductsData(await productsRes.json())
      if (customersRes.ok) setCustomersData(await customersRes.json())

    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Error al cargar las métricas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const exportData = async () => {
    try {
      const data = {
        sales: salesData,
        products: productsData,
        customers: customersData,
        exportedAt: new Date().toISOString(),
        period: period
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${period}days-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Datos exportados exitosamente')
    } catch (error) {
      toast.error('Error al exportar datos')
    }
  }

  const renderTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const renderTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Análisis y Métricas</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Análisis y Métricas</h1>
        <div className="flex items-center gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'sales', label: 'Ventas', icon: BarChart3 },
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'customers', label: 'Clientes', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Sales Analytics */}
      {activeTab === 'sales' && salesData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(salesData.summary.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {renderTrendIcon(salesData.summary.revenueChange)}
                  <span className={`text-sm font-medium ml-2 ${renderTrendColor(salesData.summary.revenueChange)}`}>
                    {salesData.summary.revenueChange > 0 ? '+' : ''}{salesData.summary.revenueChange.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {salesData.summary.totalOrders}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {renderTrendIcon(salesData.summary.orderCountChange)}
                  <span className={`text-sm font-medium ml-2 ${renderTrendColor(salesData.summary.orderCountChange)}`}>
                    {salesData.summary.orderCountChange > 0 ? '+' : ''}{salesData.summary.orderCountChange.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs período anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valor Promedio Pedido</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(salesData.summary.averageOrderValue)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Período Analizado</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {period} días
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.topProducts.slice(0, 10).map((item, index) => (
                  <div key={item.product?.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                      {item.product?.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.product?.name || 'Producto sin nombre'}</p>
                        <p className="text-sm text-gray-600">{item.quantity} unidades vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.revenue)}</p>
                      <p className="text-sm text-gray-600">{item.orders} pedidos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.paymentMethods.map((method) => (
                    <div key={method.paymentMethod} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          {method.paymentMethod === 'MERCADOPAGO' ? 'MercadoPago' : 
                           method.paymentMethod === 'TRANSFER' ? 'Transferencia' : 
                           method.paymentMethod || 'Sin especificar'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatPrice(method._sum.total || 0)}</p>
                        <p className="text-xs text-gray-500">{method._count.id} pedidos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorías Más Vendidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.topCategories.slice(0, 5).map((category: Record<string, unknown>, index) => (
                    <div key={category.id || index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatPrice(Number(category.revenue) || 0)}</p>
                        <p className="text-xs text-gray-500">{Number(category.quantity) || 0} unidades</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Products Analytics */}
      {activeTab === 'products' && productsData && (
        <div className="space-y-6">
          {/* Stock Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valor Total Stock</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(productsData.stockValue.totalValue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unidades en Stock</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productsData.stockValue.totalUnits}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Productos con Stock Bajo</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productsData.lowStockProducts.length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Activity className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance de Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productsData.productPerformance.slice(0, 10).map((product: Record<string, unknown>, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                      {product.image && (
                        <Image
                          src={String(product.image)}
                          alt={String(product.name)}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{String(product.name)}</p>
                        <p className="text-sm text-gray-600">{String(product.category_name)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-right">
                      <div>
                        <p className="text-sm font-medium">{Number(product.total_sold)}</p>
                        <p className="text-xs text-gray-500">Vendidos</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{formatPrice(Number(product.revenue))}</p>
                        <p className="text-xs text-gray-500">Ingresos</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{Number(product.stock)}</p>
                        <p className="text-xs text-gray-500">Stock actual</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          {productsData.lowStockProducts.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">⚠️ Productos con Stock Bajo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productsData.lowStockProducts.slice(0, 10).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{product.name}</span>
                        <Badge variant="outline">{product.category.name}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">Stock: {product.stock}</p>
                        <p className="text-xs text-gray-500">Mínimo: {product.minStock || 5}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Customers Analytics */}
      {activeTab === 'customers' && customersData && (
        <div className="space-y-6">
          {/* Customer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {customersData.summary.totalCustomers}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {customersData.summary.activeCustomers}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nuevos Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {customersData.summary.newCustomers}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tasa Retención</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {customersData.summary.retentionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <PieChart className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Clientes por Valor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customersData.topCustomers.slice(0, 10).map((customer: Record<string, unknown>, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.first_name && customer.last_name 
                            ? `${String(customer.first_name)} ${String(customer.last_name)}`
                            : String(customer.email)
                          }
                        </p>
                        <p className="text-sm text-gray-600">{String(customer.email)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-right">
                      <div>
                        <p className="text-sm font-medium">{Number(customer.order_count)}</p>
                        <p className="text-xs text-gray-500">Pedidos</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{formatPrice(Number(customer.total_spent))}</p>
                        <p className="text-xs text-gray-500">Total gastado</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{formatPrice(Number(customer.avg_order_value))}</p>
                        <p className="text-xs text-gray-500">Promedio/pedido</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Segmentation */}
          <Card>
            <CardHeader>
              <CardTitle>Segmentación de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {customersData.customerSegmentation.map((segment: Record<string, unknown>) => (
                  <div key={segment.segment} className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium text-gray-900">{String(segment.segment)}</p>
                    <p className="text-2xl font-bold text-pink-600">{Number(segment.customers)}</p>
                    <p className="text-sm text-gray-600">Promedio: {formatPrice(Number(segment.avg_spent))}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}