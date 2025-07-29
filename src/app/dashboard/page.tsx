import { currentUser } from '@clerk/nextjs/server'
import { isAdmin, getCurrentUser, getOrCreateUser } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await currentUser()
  const userIsAdmin = await isAdmin()
  
  // Verificar si usuario existe en BD, crear solo si es necesario
  let dbUser = await getCurrentUser()
  if (!dbUser && user) {
    dbUser = await getOrCreateUser()
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Hola, {user.firstName || user.emailAddresses[0]?.emailAddress}!
            </h1>
            <p className="text-gray-600">Bienvenido a tu panel de control</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Catálogo de productos */}
          <Link href="/productos" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🍰</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600">
                    Ver Productos
                  </h3>
                  <p className="text-gray-500">Explora nuestro catálogo</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Mis pedidos */}
          <Link href="/pedidos" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600">
                    Mis Pedidos
                  </h3>
                  <p className="text-gray-500">Historial y estado</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Mis favoritos */}
          <Link href="/favoritos" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">❤️</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600">
                    Mis Favoritos
                  </h3>
                  <p className="text-gray-500">Productos guardados</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Carrito */}
          <Link href="/carrito" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🛒</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600">
                    Mi Carrito
                  </h3>
                  <p className="text-gray-500">Productos seleccionados</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Panel de Admin (solo si es admin) */}
          {userIsAdmin && (
            <Link href="/admin" className="group md:col-span-2 lg:col-span-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">
                      Panel de Administración
                    </h3>
                    <p className="text-pink-100">Gestionar productos, pedidos y usuarios</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Información del usuario */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Información de tu cuenta
            </h3>
            <div className="mt-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.emailAddresses[0]?.emailAddress}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rol</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userIsAdmin 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {userIsAdmin ? 'Administrador' : 'Cliente'}
                    </span>
                  </dd>
                </div>
                {user.firstName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 