import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminDashboard() {
  const user = await currentUser()
  const userIsAdmin = await isAdmin()

  if (!user) {
    redirect('/sign-in')
  }

  if (!userIsAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600">Gestiona tu tienda desde aquí</p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pedidos Hoy</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">$0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🍰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/categorias" className="group">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📁</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600">
                  Gestionar Categorías
                </h3>
                <p className="text-gray-500">Ver y administrar categorías</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/productos" className="group">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🍰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600">
                  Gestionar Productos
                </h3>
                <p className="text-gray-500">Ver y administrar productos</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/pedidos" className="group">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600">
                  Ver Pedidos
                </h3>
                <p className="text-gray-500">Gestionar pedidos pendientes</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/categorias/nueva" className="group">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">➕</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-blue-700 group-hover:text-blue-800">
                  Nueva Categoría
                </h3>
                <p className="text-blue-600">Crear categoría de productos</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/productos/nuevo" className="group">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-dashed border-pink-300 rounded-lg p-6 hover:border-pink-400 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🆕</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-pink-700 group-hover:text-pink-800">
                  Nuevo Producto
                </h3>
                <p className="text-pink-600">Agregar producto al catálogo</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">📝</span>
              <p>No hay actividad reciente</p>
              <p className="text-sm">Los pedidos y cambios aparecerán aquí</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 