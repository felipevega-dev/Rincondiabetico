import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ArrowRight, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pago Pendiente - Postres Pasmiño',
  description: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
}

export default function PaymentPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icono de pendiente */}
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pago en Proceso
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos por email 
          cuando se confirme la transacción.
        </p>

        {/* Estado del proceso */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">¿Qué está pasando?</h3>
          <div className="text-sm text-yellow-700 space-y-1 text-left">
            <p>• Tu pago está siendo verificado</p>
            <p>• Puede tomar entre 5 minutos y 24 horas</p>
            <p>• Recibirás un email con la confirmación</p>
            <p>• No es necesario que hagas nada más</p>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">Información importante:</h3>
          <div className="text-sm text-blue-700 space-y-1 text-left">
            <p>• Tu pedido se reservará hasta que se confirme el pago</p>
            <p>• Si el pago es rechazado, te notificaremos inmediatamente</p>
            <p>• Puedes verificar el estado en "Mis Pedidos"</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link href="/pedidos" className="block">
            <Button className="w-full bg-pink-600 hover:bg-pink-700">
              Ver Estado del Pedido
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Link href="/productos" className="block">
            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
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
          <p className="text-sm text-gray-500 mb-2">
            ¿Tienes dudas sobre tu pago?
          </p>
          <a 
            href="https://wa.me/56912345678" 
            className="text-pink-600 hover:text-pink-700 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contáctanos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
} 