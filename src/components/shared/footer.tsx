import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Instagram, Facebook, MapPin, Mail, Clock, Heart } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatOpeningHours } from '@/lib/utils'

async function getStoreBasicInfo() {
  try {
    const settings = await prisma.storeSettings.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        storeName: true,
        address: true,
        phone: true,
        email: true,
        whatsapp: true,
        description: true,
        openingHours: true,
        isOpen: true
      }
    })
    return settings
  } catch (error) {
    console.error('Error fetching store settings:', error)
    return null
  }
}

async function getMenuPages() {
  try {
    const pages = await prisma.page.findMany({
      where: { 
        isActive: true,
        showInMenu: true 
      },
      orderBy: { order: 'asc' },
      select: {
        slug: true,
        title: true
      }
    })
    return pages
  } catch (error) {
    console.error('Error fetching menu pages:', error)
    return []
  }
}

export async function Footer() {
  const storeInfo = await getStoreBasicInfo()
  const menuPages = await getMenuPages()

  // Valores por defecto
  const storeName = storeInfo?.storeName || 'Postres Pasmiño'
  const address = storeInfo?.address || 'Progreso 393, Chiguayante, Región del Biobío, Chile'
  const _phone = storeInfo?.phone || '+56 9 8687 4406'
  const email = storeInfo?.email || 'dulcespasmino@gmail.com'
  const whatsapp = storeInfo?.whatsapp || '+56 9 8687 4406'
  const description = storeInfo?.description || 'Dulces artesanales especialmente diseñados para personas con diabetes. Sin azúcar refinada, con todo el sabor que mereces.'
  
  // Formatear horarios dinámicos
  const formattedHours = storeInfo?.openingHours 
    ? formatOpeningHours(storeInfo.openingHours)
    : [
        'Lunes a Viernes: 9:00 - 19:00',
        'Sábados: 9:00 - 17:00', 
        'Domingos: 10:00 - 15:00'
      ]

  return (
    <footer className="bg-gradient-to-br from-primary-50 via-cream-50 to-accent-50 border-t border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contact Info - Left */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Contacto</h4>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Dirección</p>
                  <p className="text-xs leading-relaxed whitespace-pre-line">
                    {address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">WhatsApp</p>
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} className="text-xs hover:text-primary-600 transition-colors">
                    {whatsapp}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Email</p>
                  <a href={`mailto:${email}`} className="text-xs hover:text-primary-600 transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Brand & Description - Center */}
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Image 
                src="/logo.png" 
                alt={storeName} 
                width={100} 
                height={100}
                className="object-contain h-auto w-auto rounded-md shadow-sm"
              />
            </div>
            <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed text-sm">
              {description}
            </p>
            
            {/* Social Media - Centered */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 mb-3">Síguenos</h4>
              <div className="flex justify-center space-x-4">
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors group bg-white/50 px-3 py-2 rounded-lg hover:bg-white/80"
                >
                  <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
                <a
                  href="https://instagram.com/dulcespasmino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors group bg-white/50 px-3 py-2 rounded-lg hover:bg-white/80"
                >
                  <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a
                  href="https://facebook.com/dulcespasmino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group bg-white/50 px-3 py-2 rounded-lg hover:bg-white/80"
                >
                  <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links - Right */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-600 hover:text-primary-600 transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-600 hover:text-primary-600 transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-600 hover:text-primary-600 transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-gray-600 hover:text-primary-600 transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm">
                  Carrito
                </Link>
              </li>
              {/* Páginas dinámicas del CMS */}
              {menuPages.map((page) => (
                <li key={page.slug}>
                  <Link 
                    href={`/${page.slug}`} 
                    className="text-gray-600 hover:text-primary-600 transition-colors hover:translate-x-1 transform duration-200 inline-block text-sm"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Store Hours & Important Info */}
        <div className="border-t border-primary-200/50 mt-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent-500" />
                Horarios de Atención
              </h4>
              <div className="text-gray-600 space-y-1 text-sm">
                {formattedHours.map((hour, index) => (
                  <p key={index}>{hour}</p>
                ))}
              </div>
            </div>
            
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-primary-100/50">
              <h4 className="font-semibold text-gray-800 mb-3">Información Importante</h4>
              <div className="text-gray-600 space-y-1 text-xs">
                <p>• Solo retiro en tienda</p>
                <p>• Pedidos especiales con 48h de anticipación</p>
                <p>• Aceptamos efectivo y tarjetas</p>
                <p>• Productos sin azúcar refinada</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-200/50 mt-6 pt-6 text-center">
          <p className="text-gray-600 text-sm">&copy; 2024 {storeName}. Todos los derechos reservados.</p>
          <p className="text-xs mt-2 flex items-center justify-center gap-1 text-gray-500">
            Hecho con <Heart className="h-3 w-3 text-primary-400 animate-pulse" fill="currentColor" /> en Chiguayante, Chile
          </p>
          <p className="text-xs mt-1 text-gray-400">
            By: <a 
              href="https://felipevegadev.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 transition-colors font-medium"
            >
              Felipe Vega
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
} 