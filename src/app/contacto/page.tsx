import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatOpeningHours } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contacto - Postres Pasmiño',
  description: 'Contáctanos para consultas, pedidos especiales o visítanos en nuestra tienda en Chiguayante, Chile.',
}

async function getStoreSettings() {
  try {
    const settings = await prisma.storeSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    return settings
  } catch (error) {
    console.error('Error fetching store settings:', error)
    return null
  }
}

export default async function ContactoPage() {
  const storeSettings = await getStoreSettings()

  // Valores por defecto si no hay configuración
  const storeName = storeSettings?.storeName || 'Postres Pasmiño'
  const address = storeSettings?.address || 'Progreso 393, Chiguayante, Región del Biobío, Chile'
  const phone = storeSettings?.phone || '+56 9 8687 4406'
  const email = storeSettings?.email || 'dulcespasmino@gmail.com'
  const whatsapp = storeSettings?.whatsapp || '+56 9 8687 4406'
  
  // Formatear horarios dinámicos
  const formattedHours = storeSettings?.openingHours 
    ? formatOpeningHours(storeSettings.openingHours)
    : [
        'Lunes a Viernes: 9:00 - 19:00',
        'Sábados: 9:00 - 17:00', 
        'Domingos: 10:00 - 15:00'
      ]

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
                {storeName}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-500 mt-1 mr-3">📍</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Dirección</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {address}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-500 mt-1 mr-3">🕒</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Horarios de Atención</h3>
                    <div className="text-gray-600">
                      {formattedHours.map((hour, index) => (
                        <p key={index}><strong>{hour.split(':')[0]}:</strong> {hour.split(': ')[1]}</p>
                      ))}
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
                    <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} className="text-blue-600 hover:underline">
                      {whatsapp}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">📞</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Teléfono</h3>
                    <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
                      {phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">📧</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                      {email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-purple-500 mr-3">📘</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Redes Sociales</h3>
                    <div className="space-x-4">
                      <a href="https://facebook.com/dulcespasmino" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>
                      <a href="https://instagram.com/dulcespasmino" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Instagram</a>
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
                  placeholder={phone}
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
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
              >
                Enviar Mensaje
              </button>
            </form>

            {/* Acceso Directo a WhatsApp */}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">¿Prefieres WhatsApp?</h3>
              <p className="text-green-700 text-sm mb-3">
                Para una respuesta más rápida, puedes escribirnos directamente por WhatsApp
              </p>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hola, me gustaría hacer una consulta sobre los productos de ${storeName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                <span className="mr-2">📱</span>
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Mapa Placeholder */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ubicación
            </h2>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📍</span>
                <p className="text-gray-600">Mapa de ubicación</p>
                <p className="text-sm text-gray-500 whitespace-pre-line">{address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 