import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🧁</span>
              <span className="font-bold text-2xl">Postres Pasmiño</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Postres artesanales especialmente diseñados para personas con diabetes. 
              Sin azúcar refinada, con todo el sabor que mereces.
            </p>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg mb-3">Síguenos</h4>
              <div className="flex space-x-4">
                <a
                  href="https://wa.me/56912345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <span className="text-xl">📱</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href="https://instagram.com/rincondiabetico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <span className="text-xl">📷</span>
                  <span>Instagram</span>
                </a>
                <a
                  href="https://facebook.com/rincondiabetico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="text-xl">📘</span>
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
                <Link href="/productos" className="text-gray-300 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-gray-300 hover:text-white transition-colors">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">📍</span>
                <div>
                  <p className="font-medium">Dirección</p>
                  <p className="text-sm">
                    Progreso 393<br />
                    Chiguayante, Región del Biobío<br />
                    Chile
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-green-400">📱</span>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <a href="https://wa.me/56912345678" className="text-sm hover:text-white transition-colors">
                    +56 9 1234 5678
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-blue-400">📧</span>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:contacto@rincondiabetico.cl" className="text-sm hover:text-white transition-colors">
                    contacto@rincondiabetico.cl
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Hours */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4">Horarios de Atención</h4>
              <div className="text-gray-300 space-y-1">
                <p><span className="font-medium">Lunes a Viernes:</span> 9:00 - 19:00</p>
                <p><span className="font-medium">Sábados:</span> 9:00 - 17:00</p>
                <p><span className="font-medium">Domingos:</span> 10:00 - 15:00</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Información Importante</h4>
              <div className="text-gray-300 space-y-1 text-sm">
                <p>• Solo retiro en tienda</p>
                <p>• Pedidos especiales con 48h de anticipación</p>
                <p>• Aceptamos efectivo y tarjetas</p>
                <p>• Productos sin azúcar refinada</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Postres Pasmiño. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">
            Hecho con ❤️ en Chiguayante, Chile
          </p>
        </div>
      </div>
    </footer>
  )
} 