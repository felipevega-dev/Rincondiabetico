import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Home, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pago Exitoso - Postres Pasmiño',
  description: 'Tu pago ha sido procesado exitosamente. Tu pedido está siendo preparado.',
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icono de éxito */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación 
          con los detalles de tu pedido.
        </p>

        {/* Estado del pedido */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center text-green-700 mb-2">
            <Package className="w-5 h-5 mr-2" />
            <span className="font-medium">Tu pedido está siendo preparado</span>
          </div>
          <p className="text-sm text-green-600">
            Te notificaremos cuando esté listo para retirar
          </p>
        </div>

        {/* Información importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">Información de Retiro:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>📍 Progreso 393, Chiguayante</p>
            <p>🕒 Lun-Vie: 9:00-19:00</p>
            <p>🕒 Sáb: 9:00-17:00, Dom: 10:00-15:00</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link href="/pedidos" className="block">
            <Button className="w-full bg-pink-600 hover:bg-pink-700">
              Ver Mis Pedidos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 