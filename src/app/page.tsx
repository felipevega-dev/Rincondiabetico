import { currentUser } from '@clerk/nextjs/server'
import { isAdmin, getOrCreateUser } from '@/lib/auth'
import Link from 'next/link'
import { HeroCarousel } from '@/components/client/hero-carousel'
import { FeaturedProducts } from '@/components/client/featured-products'

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
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="py-8">
        <HeroCarousel />
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Nuestras Especialidades
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tortas */}
            <div className="bg-white p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-6xl mb-4">🍰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tortas</h3>
              <p className="text-gray-700 mb-6">
                Tortas personalizadas para toda ocasión, sin azúcar refinada
              </p>
              <Link 
                href="/productos?categoria=tortas"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Ver Tortas
              </Link>
            </div>

            {/* Cupcakes */}
            <div className="bg-white p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-6xl mb-4">🧁</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cupcakes</h3>
              <p className="text-gray-700 mb-6">
                Deliciosos cupcakes con decoraciones únicas y sabores especiales
              </p>
              <Link 
                href="/productos?categoria=cupcakes"
                className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold"
              >
                Ver Cupcakes
              </Link>
            </div>

            {/* Dulces */}
            <div className="bg-white p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-6xl mb-4">🍭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dulces</h3>
              <p className="text-gray-700 mb-6">
                Variedad de dulces y postres artesanales para diabéticos
              </p>
              <Link 
                href="/productos?categoria=dulces"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Ver Dulces
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para endulzar tu día?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre nuestros postres sin azúcar refinada, perfectos para personas con diabetes. 
            ¡Visítanos en Chiguayante!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/productos"
              className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver Productos
            </Link>
            <Link
              href="/contacto"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegirnos?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Artesanal</h3>
              <p className="text-gray-600">Todos nuestros productos son hechos a mano con amor y técnicas tradicionales</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">💚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Para Diabéticos</h3>
              <p className="text-gray-600">Postres especialmente diseñados sin azúcar refinada, seguros y deliciosos</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Retiro en Tienda</h3>
              <p className="text-gray-600">Ubicados en Progreso 393, Chiguayante para tu comodidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conéctate con nosotros
            </h2>
            <p className="text-xl text-gray-600">
              Síguenos en redes sociales y mantente al día con nuestras novedades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* WhatsApp */}
            <a
              href="https://wa.me/56912345678"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📱</div>
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600 text-sm">Contáctanos directamente</p>
              <p className="text-green-600 font-medium mt-2">+56 9 1234 5678</p>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/rincondiabetico"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📷</div>
              <h3 className="font-semibold text-gray-900 mb-2">Instagram</h3>
              <p className="text-gray-600 text-sm">Ve nuestras creaciones</p>
              <p className="text-pink-600 font-medium mt-2">@rincondiabetico</p>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/rincondiabetico"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📘</div>
              <h3 className="font-semibold text-gray-900 mb-2">Facebook</h3>
              <p className="text-gray-600 text-sm">Únete a nuestra comunidad</p>
              <p className="text-blue-600 font-medium mt-2">Rincón Diabético</p>
            </a>

            {/* Ubicación */}
            <div className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600 text-sm">Visítanos en nuestra tienda</p>
              <p className="text-gray-800 font-medium mt-2">
                Progreso 393<br />
                Chiguayante
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
