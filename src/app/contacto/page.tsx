import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatOpeningHours } from '@/lib/utils'
import Image from 'next/image'
import { MapPin, Clock, Phone, Mail, MessageCircle, Facebook, Instagram, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto - Dulces Pasmiño',
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
  const storeName = storeSettings?.storeName || 'Dulces Pasmiño'
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section con Parallax */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/uploads/products/209d9797-1ea7-4a8e-9c6b-e6de937105a5.png"
            alt="Contacto Dulces Pasmiño"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-50/90" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-up">
              Contáctanos
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto animate-fade-up animation-delay-100">
              Estamos aquí para ayudarte. ¿Tienes alguna pregunta o pedido especial?
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        {/* Tarjetas de Contacto Rápido */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                <MapPin className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Visítanos</h3>
            </div>
            <p className="text-gray-600">{address}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <MessageCircle className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
            </div>
            <a 
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              className="text-purple-600 hover:underline"
            >
              {whatsapp}
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Horarios</h3>
            </div>
            <div className="text-gray-600 text-sm">
              {formattedHours.map((hour, index) => (
                <p key={index} className="mb-1">{hour}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulario de Contacto */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Mail className="h-6 w-6 mr-3 text-pink-500" />
              Envíanos un Mensaje
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-700">
                  Asunto *
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta-general">Consulta General</option>
                  <option value="pedido-especial">Pedido Especial</option>
                  <option value="informacion-productos">Información sobre Productos</option>
                  <option value="sugerencias">Sugerencias</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-6 rounded-lg transition duration-300 font-semibold shadow-lg shadow-pink-200 transform hover:scale-[1.02]"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Información Adicional */}
          <div className="space-y-6">
            {/* Redes Sociales */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Síguenos</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://facebook.com/dulcespasmino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Facebook className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-blue-600 font-medium">Facebook</span>
                </a>
                <a
                  href="https://instagram.com/dulcespasmino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <Instagram className="h-6 w-6 text-pink-600 mr-3" />
                  <span className="text-pink-600 font-medium">Instagram</span>
                </a>
              </div>
            </div>

            {/* Información Importante */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <AlertCircle className="h-6 w-6 mr-3 text-yellow-500" />
                Información Importante
              </h2>
              <div className="grid gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Retiro en Tienda</h3>
                  <p className="text-yellow-700 text-sm">
                    Solo ofrecemos retiro en tienda, no realizamos delivery.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Pedidos Especiales</h3>
                  <p className="text-blue-700 text-sm">
                    Los pedidos especiales requieren 48 horas de anticipación.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Medios de Pago</h3>
                  <p className="text-green-700 text-sm">
                    Aceptamos efectivo, tarjetas de débito y crédito.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">¿Prefieres WhatsApp?</h2>
              <p className="mb-6 opacity-90">
                Escríbenos directamente por WhatsApp para una respuesta más rápida
              </p>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hola, me gustaría hacer una consulta sobre los productos de ${storeName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition duration-300 font-semibold"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-3 text-pink-500" />
              Nuestra Ubicación
            </h2>
            <div className="bg-gray-100 h-[400px] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">Encuéntranos en</p>
                <p className="text-gray-500">{address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 