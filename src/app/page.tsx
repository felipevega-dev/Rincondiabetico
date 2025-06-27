import { currentUser } from '@clerk/nextjs/server'
import { isAdmin, getOrCreateUser } from '@/lib/auth'
import Link from 'next/link'

export default async function Home() {
  const user = await currentUser()
  let userIsAdmin = false
  
  // Solo verificar admin si hay usuario
  if (user) {
    userIsAdmin = await isAdmin()
    // Sincronizar usuario con BD
    await getOrCreateUser()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Deliciosos Postres Artesanales
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            En Chiguayante, Chile - Solo retiro en tienda
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/sign-up"
                className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                Crear Cuenta
              </Link>
              <Link 
                href="/productos"
                className="border border-pink-600 text-pink-600 px-8 py-3 rounded-lg font-medium hover:bg-pink-50 transition-colors"
              >
                Ver Productos
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nuestras Especialidades
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tortas */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🍰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tortas</h3>
              <p className="text-gray-700 mb-6">
                Tortas personalizadas para toda ocasión
              </p>
              <Link 
                href="/productos?categoria=tortas"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ver Tortas
              </Link>
            </div>

            {/* Cupcakes */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🧁</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cupcakes</h3>
              <p className="text-gray-700 mb-6">
                Deliciosos cupcakes con decoraciones únicas
              </p>
              <Link 
                href="/productos?categoria=cupcakes"
                className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Ver Cupcakes
              </Link>
            </div>

            {/* Dulces */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🍭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dulces</h3>
              <p className="text-gray-700 mb-6">
                Variedad de dulces y postres artesanales
              </p>
              <Link 
                href="/productos?categoria=dulces"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ver Dulces
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ¿Por qué elegirnos?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">Artesanal</h3>
              <p className="text-gray-600">Todos nuestros productos son hechos a mano con amor</p>
            </div>
            
            <div className="p-6">
              <div className="text-4xl mb-4">🥇</div>
              <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Ingredientes de primera calidad en cada receta</p>
            </div>
            
            <div className="p-6">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2">Retiro en Tienda</h3>
              <p className="text-gray-600">Ubicados en Chiguayante para tu comodidad</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
