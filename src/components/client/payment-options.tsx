'use client'

import { useState } from 'react'
import { MercadoPagoPayment } from './mercadopago-payment'
import { CreditCard, Building2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaymentOptionsProps {
  orderId: string
  amount: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

type PaymentMethod = 'mercadopago' | 'transfer' | null

export function PaymentOptions({ orderId, amount, onSuccess, onError }: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null)

  if (selectedMethod === 'mercadopago') {
    return (
      <div>
        <Button
          onClick={() => setSelectedMethod(null)}
          variant="outline"
          className="mb-4 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a opciones de pago
        </Button>
        <MercadoPagoPayment
          orderId={orderId}
          amount={amount}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    )
  }

  if (selectedMethod === 'transfer') {
    return (
      <div>
        <Button
          onClick={() => setSelectedMethod(null)}
          variant="outline"
          className="mb-4 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a opciones de pago
        </Button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Building2 className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Transferencia Bancaria</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Datos para Transferencia:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Banco:</strong> Banco Estado</p>
                <p><strong>Tipo de Cuenta:</strong> Cuenta Rut</p>
                <p><strong>RUT:</strong> 10813404-6</p>
                <p><strong>Titular:</strong> Dulces Pasmiño</p>
                <p><strong>Email:</strong> dulcespasmino@gmail.com</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Instrucciones:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-amber-700">
                <li>Realiza la transferencia por el monto exacto: <strong>${amount.toLocaleString('es-CL')}</strong></li>
                <li>Usa como referencia el número de pedido: <strong>#{orderId.slice(-8).toUpperCase()}</strong></li>
                <li>Envía el comprobante por WhatsApp al +56 9 8687 4406</li>
                <li>Tu pedido se confirmará al recibir el comprobante</li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total a Transferir:</span>
                <span className="text-green-600">${amount.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  const transferData = `Transferencia a Dulces Pasmiño
Banco Estado - Cuenta Rut
RUT: 10813404-6
Monto: $${amount.toLocaleString('es-CL')}
Referencia: #${orderId.slice(-8).toUpperCase()}`
                  
                  navigator.clipboard.writeText(transferData)
                  alert('Datos copiados al portapapeles')
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Copiar Datos
              </Button>
              
              <Button
                onClick={async () => {
                  // Marcar pedido como "esperando confirmación"
                  try {
                    await fetch(`/api/orders/${orderId}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        status: 'ESPERANDO_CONFIRMACION',
                        paymentMethod: 'TRANSFER' 
                      })
                    })
                  } catch (error) {
                    console.error('Error updating order:', error)
                  }

                  const message = `Hola! Realicé una transferencia para el pedido #${orderId.slice(-8).toUpperCase()} por $${amount.toLocaleString('es-CL')}. Adjunto el comprobante.`
                  const whatsappUrl = `https://wa.me/56986874406?text=${encodeURIComponent(message)}`
                  window.open(whatsappUrl, '_blank')
                  
                  // Redirigir a página de confirmación
                  setTimeout(() => {
                    onSuccess('transfer-pending')
                  }, 1000)
                }}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Enviar Comprobante
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Elige tu método de pago</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div 
          className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
          onClick={() => setSelectedMethod('mercadopago')}
        >
          <div className="flex items-center mb-4">
            <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Tarjeta de Crédito/Débito</h3>
              <p className="text-sm text-gray-600">Pago inmediato y seguro</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Powered by</span>
            <img 
              src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.92/mercadolibre/logo_small.png" 
              alt="MercadoPago" 
              className="h-5"
            />
          </div>
          
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Confirmación inmediata</li>
            <li>✓ Visa, Mastercard, American Express</li>
            <li>✓ Hasta 12 cuotas sin interés</li>
            <li>✓ 100% seguro</li>
          </ul>
        </div>

        <div 
          className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
          onClick={() => setSelectedMethod('transfer')}
        >
          <div className="flex items-center mb-4">
            <Building2 className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Transferencia Bancaria</h3>
              <p className="text-sm text-gray-600">Pago directo desde tu banco</p>
            </div>
          </div>
          
          <div className="mb-3">
            <span className="text-sm font-medium text-green-600">Sin comisiones adicionales</span>
          </div>
          
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Sin comisiones extras</li>
            <li>✓ Desde cualquier banco</li>
            <li>✓ Confirmación manual</li>
            <li>✓ Envío de comprobante por WhatsApp</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total a Pagar:</span>
          <span className="text-pink-600">${amount.toLocaleString('es-CL')}</span>
        </div>
      </div>
    </div>
  )
} 