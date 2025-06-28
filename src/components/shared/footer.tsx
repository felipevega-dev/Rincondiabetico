import Link from 'next/link'
import { Cake, MessageCircle, Instagram, Facebook, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-primary">
                <Cake className="h-8 w-8 text-white" />
              </div>
              <span className="font-bold text-2xl">Dulces Pasmiño</span>
            </div>
            <p className="text-neutral-300 mb-6 max-w-md leading-relaxed">
              Dulces artesanales especialmente diseñados para personas con diabetes. 
              Sin azúcar refinada, con todo el sabor que mereces.
            </p>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg mb-3">Síguenos</h4>
              <div className="flex space-x-4">
                <a
                  href="https://wa.me/56986874406"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-success-400 hover:text-success-300 transition-colors group"
                >
                  <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://instagram.com/dulcespasmino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors group"
                >
                  <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://facebook.com/dulcespasmino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
                >
                  <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-neutral-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-neutral-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-neutral-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-neutral-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <div className="space-y-3 text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Dirección</p>
                  <p className="text-sm">
                    Progreso 393<br />
                    Chiguayante, Región del Biobío<br />
                    Chile
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-success-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">WhatsApp</p>
                  <a href="https://wa.me/56986874406" className="text-sm hover:text-white transition-colors">
                    +56 9 8687 4406
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <a href="mailto:dulcespasmino@gmail.com" className="text-sm hover:text-white transition-colors">
                    dulcespasmino@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Hours & Important Info */}
        <div className="border-t border-neutral-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent-400" />
                Horarios de Atención
              </h4>
              <div className="text-neutral-300 space-y-1">
                <p><span className="font-medium text-white">Lunes a Viernes:</span> 9:00 - 19:00</p>
                <p><span className="font-medium text-white">Sábados:</span> 9:00 - 17:00</p>
                <p><span className="font-medium text-white">Domingos:</span> 10:00 - 15:00</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Información Importante</h4>
              <div className="text-neutral-300 space-y-1 text-sm">
                <p>• Solo retiro en tienda</p>
                <p>• Pedidos especiales con 48h de anticipación</p>
                <p>• Aceptamos efectivo y tarjetas</p>
                <p>• Productos sin azúcar refinada</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 Dulces Pasmiño. Todos los derechos reservados.</p>
          <p className="text-sm mt-2 flex items-center justify-center gap-1">
            Hecho con <Heart className="h-4 w-4 text-red-400 animate-pulse" fill="currentColor" /> en Chiguayante, Chile
          </p>
        </div>
      </div>
    </footer>
  )
} 