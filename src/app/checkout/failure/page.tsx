import { Metadata } from 'next'
import Link from 'next/link'
import { XCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pago Fallido - Postres Pasmiño',
  description: 'Hubo un problema con tu pago. Puedes intentar nuevamente.',
}

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icono de error */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pago No Procesado
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          Hubo un problema al procesar tu pago. No te preocupes, 
          no se realizó ningún cargo a tu tarjeta.
        </p>

        {/* Razones posibles */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">Posibles causas:</h3>
          <div className="text-sm text-yellow-700 space-y-1 text-left">
            <p>• Fondos insuficientes</p>
            <p>• Datos de tarjeta incorrectos</p>
            <p>• Límite de compra excedido</p>
            <p>• Problemas de conexión</p>
          </div>
        </div>

        {/* Qué hacer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">¿Qué puedes hacer?</h3>
          <div className="text-sm text-blue-700 space-y-1 text-left">
            <p>• Verificar los datos de tu tarjeta</p>
            <p>• Intentar con otra tarjeta</p>
            <p>• Contactar a tu banco</p>
            <p>• Intentar nuevamente más tarde</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link href="/carrito" className="block">
            <Button className="w-full bg-pink-600 hover:bg-pink-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar Nuevamente
            </Button>
          </Link>
          
          <Link href="/productos" className="block">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Seguir Comprando
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="ghost" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Contacto */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Contáctanos por WhatsApp:
          </p>
          <a 
            href="https://wa.me/56912345678" 
            className="text-pink-600 hover:text-pink-700 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            +56 9 1234 5678
          </a>
        </div>
      </div>
    </div>
  )
} 