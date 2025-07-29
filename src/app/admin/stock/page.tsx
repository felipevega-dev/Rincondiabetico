import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PackageSearch, TrendingDown, AlertTriangle, Activity } from 'lucide-react'
import Link from 'next/link'

async function getStockStats() {
  try {
    // Obtener productos con stock bajo
    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        stock: true,
        minStock: true,
        category: {
          select: { name: true }
        }
      }
    })

    const criticalStock = lowStockProducts.filter(p => p.stock <= p.minStock)

    // Estadísticas generales
    const totalProducts = await prisma.product.count({
      where: { isActive: true }
    })

    const outOfStock = await prisma.product.count({
      where: {
        isActive: true,
        stock: 0
      }
    })

    // Movimientos recientes (últimos 7 días)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentMovements = await prisma.stockMovement.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    return {
      totalProducts,
      outOfStock,
      criticalStock: criticalStock.length,
      recentMovements,
      lowStockProducts: criticalStock
    }
  } catch (error) {
    console.error('Error fetching stock stats:', error)
    return {
      totalProducts: 0,
      outOfStock: 0,
      criticalStock: 0,
      recentMovements: 0,
      lowStockProducts: []
    }
  }
}

async function getRecentMovements() {
  try {
    const movements = await prisma.stockMovement.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            name: true,
            stock: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return movements
  } catch (error) {
    console.error('Error fetching recent movements:', error)
    return []
  }
}

const movementTypeLabels: Record<string, string> = {
  MANUAL_INCREASE: 'Incremento Manual',
  MANUAL_DECREASE: 'Decremento Manual',
  PURCHASE: 'Compra',
  CANCEL: 'Cancelación',
  ADJUSTMENT: 'Ajuste',
  RESERVATION: 'Reserva',
  RELEASE: 'Liberación',
  RETURN: 'Devolución'
}

export default async function StockPage() {
  const stats = await getStockStats()
  const recentMovements = await getRecentMovements()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Stock</h1>
        <p className="text-gray-600">
          Control y seguimiento del inventario
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PackageSearch className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sin Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900">{stats.criticalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Movimientos (7d)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentMovements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos con Stock Bajo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Productos con Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay productos con stock bajo
              </p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.category?.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">
                        {product.stock} / {product.minStock}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Stock actual / mínimo</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Movimientos Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Movimientos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMovements.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay movimientos recientes
              </p>
            ) : (
              <div className="space-y-3">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{movement.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {movementTypeLabels[movement.type] || movement.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(movement.createdAt).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stock: {movement.newStock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ver Historial Detallado */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/stock/history"
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <div className="text-center">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium">Ver Historial Completo</p>
                <p className="text-sm text-gray-600">Todos los movimientos de stock</p>
              </div>
            </Link>

            <Link
              href="/admin/productos"
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <div className="text-center">
                <PackageSearch className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium">Gestionar Productos</p>
                <p className="text-sm text-gray-600">Editar stock y configuración</p>
              </div>
            </Link>

            <Link
              href="/admin/stock/analytics"
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <div className="text-center">
                <TrendingDown className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium">Analytics de Stock</p>
                <p className="text-sm text-gray-600">Reportes y estadísticas</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}