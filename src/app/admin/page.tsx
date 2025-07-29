import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, ShoppingCart, FolderOpen, Users, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react'
import OrderCleanup from '@/components/admin/order-cleanup'
import NotificationSettings from '@/components/admin/notification-settings'

export default async function AdminDashboard() {
  const user = await currentUser()
  const userIsAdmin = await isAdmin()

  if (!user) {
    redirect('/sign-in')
  }

  if (!userIsAdmin) {
    redirect('/dashboard')
  }

  // Obtener estadísticas
  const [
    totalProducts,
    totalCategories,
    totalOrders,
    pendingOrders,
    lowStockProducts,
    outOfStockProducts,
    totalRevenue
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ['PENDIENTE', 'PREPARANDO'] } } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        stock: { gt: 0, lte: 5 }
      },
      select: {
        id: true,
        name: true,
        stock: true,
        category: { select: { name: true } }
      },
      orderBy: { stock: 'asc' }
    }),
    prisma.product.count({
      where: {
        isActive: true,
        stock: 0
      }
    }),
    prisma.order.aggregate({
      where: { status: { not: 'CANCELADO' } },
      _sum: { total: true }
    })
  ])

  const stats = [
    {
      title: 'Productos Activos',
      value: totalProducts.toString(),
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/productos'
    },
    {
      title: 'Categorías',
      value: totalCategories.toString(),
      icon: FolderOpen,
      color: 'bg-green-500',
      href: '/admin/categorias'
    },
    {
      title: 'Pedidos Totales',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-purple-500',
      href: '/admin/pedidos'
    },
    {
      title: 'Pedidos Pendientes',
      value: pendingOrders.toString(),
      icon: AlertTriangle,
      color: 'bg-orange-500',
      href: '/admin/pedidos?status=pending'
    },
    {
      title: 'Sin Stock',
      value: outOfStockProducts.toString(),
      icon: Package,
      color: 'bg-red-500',
      href: '/admin/productos?filter=out-of-stock'
    },
    {
      title: 'Ingresos Totales',
      value: `$${(totalRevenue._sum.total || 0).toLocaleString('es-CL')}`,
      icon: TrendingUp,
      color: 'bg-pink-500',
      href: '/admin/pedidos'
    }
  ]

  const quickActions = [
    {
      title: 'Analytics y Métricas',
      description: 'Ver reportes detallados de ventas, productos y clientes',
      icon: BarChart3,
      color: 'bg-indigo-500',
      href: '/admin/analytics'
    },
    {
      title: 'Gestión de Stock',
      description: 'Monitorear inventario y movimientos de stock',
      icon: Package,
      color: 'bg-emerald-500',
      href: '/admin/stock'
    },
    {
      title: 'Pedidos Recientes',
      description: 'Gestionar y procesar pedidos pendientes',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      href: '/admin/pedidos'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al panel de control de Postres Pasmiño
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all group border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-start">
                  <div className={`${action.color} rounded-lg p-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Alertas y Gestión - Layout mejorado */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Alertas de Stock */}
        {(lowStockProducts.length > 0 || outOfStockProducts > 0) && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Alertas de Inventario
                </h2>
              </div>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {outOfStockProducts > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-red-500 mr-2" />
                    <span className="font-medium text-red-800 text-sm">
                      {outOfStockProducts} producto{outOfStockProducts !== 1 ? 's' : ''} sin stock
                    </span>
                  </div>
                </div>
              )}

              {lowStockProducts.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 text-sm">
                    Productos con Stock Bajo (≤ 5 unidades)
                  </h3>
                  <div className="space-y-2">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.category.name}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock <= 2 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {product.stock}
                        </span>
                      </div>
                    ))}
                    {lowStockProducts.length > 5 && (
                      <Link 
                        href="/admin/stock" 
                        className="block text-center text-sm text-blue-600 hover:text-blue-800 py-2"
                      >
                        Ver {lowStockProducts.length - 5} más...
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Cleanup */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Limpieza de Pedidos
            </h2>
          </div>
          <div className="p-4">
            <OrderCleanup />
          </div>
        </div>
      </div>

      {/* Notification Settings - Layout optimizado */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Sistema de Notificaciones
          </h2>
        </div>
        <div className="p-4">
          <NotificationSettings />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Acciones Rápidas
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/productos/nuevo"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Nuevo Producto</p>
                <p className="text-sm text-gray-600">Agregar producto</p>
              </div>
            </Link>
            
            <Link
              href="/admin/categorias/nueva"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Nueva Categoría</p>
                <p className="text-sm text-gray-600">Crear categoría</p>
              </div>
            </Link>
            
            <Link
              href="/admin/pedidos"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Ver Pedidos</p>
                <p className="text-sm text-gray-600">Gestionar pedidos</p>
              </div>
            </Link>
            
            <Link
              href="/"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-pink-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Ver Tienda</p>
                <p className="text-sm text-gray-600">Vista del cliente</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 