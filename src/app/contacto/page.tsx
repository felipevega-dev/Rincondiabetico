import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto - Rincón Diabético',
  description: 'Contáctanos para consultas, pedidos especiales o visítanos en nuestra tienda en Chiguayante, Chile.',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Visítanos en nuestra tienda o contáctanos 
            para consultas y pedidos especiales.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            {/* Tienda Física */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">🏪</span>
                Nuestra Tienda
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-500 mt-1 mr-3">📍</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Dirección</h3>
                    <p className="text-gray-600">
                      Avenida Principal 123<br />
                      Chiguayante, Región del Biobío<br />
                      Chile
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">🕒</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Horarios de Atención</h3>
                    <div className="text-gray-600">
                      <p><strong>Lunes a Viernes:</strong> 9:00 - 19:00</p>
                      <p><strong>Sábados:</strong> 9:00 - 17:00</p>
                      <p><strong>Domingos:</strong> 10:00 - 15:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">📞</span>
                Información de Contacto
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">📱</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                    <a href="https://wa.me/56912345678" className="text-blue-600 hover:underline">
                      +56 9 1234 5678
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">📧</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <a href="mailto:contacto@rincondiabetico.cl" className="text-blue-600 hover:underline">
                      contacto@rincondiabetico.cl
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3">📘</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Redes Sociales</h3>
                    <div className="space-x-4">
                      <a href="#" className="text-blue-600 hover:underline">Facebook</a>
                      <a href="#" className="text-pink-600 hover:underline">Instagram</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                <span className="mr-2">ℹ️</span>
                Información Importante
              </h3>
              <ul className="text-yellow-700 space-y-2 text-sm">
                <li>• Solo ofrecemos retiro en tienda, no hacemos delivery</li>
                <li>• Pedidos especiales requieren 48 horas de anticipación</li>
                <li>• Consulta disponibilidad antes de tu visita</li>
                <li>• Aceptamos pagos en efectivo y tarjetas</li>
              </ul>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Envíanos un Mensaje
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta-general">Consulta General</option>
                  <option value="pedido-especial">Pedido Especial</option>
                  <option value="informacion-productos">Información sobre Productos</option>
                  <option value="sugerencias">Sugerencias</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  id="acepto-privacidad"
                  name="acepto-privacidad"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="acepto-privacidad" className="ml-2 block text-sm text-gray-700">
                  Acepto la política de privacidad y el tratamiento de mis datos *
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>

        {/* Mapa o Imagen de Ubicación */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Encuéntranos en Chiguayante
            </h2>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <span className="text-4xl mb-4 block">🗺️</span>
                <p>Mapa de ubicación</p>
                <p className="text-sm">Avenida Principal 123, Chiguayante</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Ver en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 