'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, Copy, Phone, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TransferPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isReady, setIsReady] = useState(false)
  const [orderUpdated, setOrderUpdated] = useState(false)

  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push('/sign-in?redirect_url=/checkout')
        return
      }

      if (!orderId || !amount) {
        router.push('/checkout')
        return
      }

      setIsReady(true)
      updateOrderStatus()
    }
  }, [isLoaded, user, orderId, amount, router])

  const updateOrderStatus = async () => {
    if (!orderId) return

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'ESPERANDO_CONFIRMACION',
          paymentMethod: 'TRANSFER' 
        })
      })
      setOrderUpdated(true)
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const copyTransferData = () => {
    const transferData = `Transferencia a Dulces Pasmiño
Banco Estado - Cuenta Rut
RUT: 10813404-6
Monto: $${parseInt(amount!).toLocaleString('es-CL')}
Referencia: #${orderId!.slice(-8).toUpperCase()}`
    
    navigator.clipboard.writeText(transferData)
    alert('Datos copiados al portapapeles')
  }

  const sendWhatsApp = () => {
    const message = `Hola! Realicé una transferencia para el pedido #${orderId!.slice(-8).toUpperCase()} por $${parseInt(amount!).toLocaleString('es-CL')}. Adjunto el comprobante.`
    const whatsappUrl = `https://wa.me/56986874406?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const goToOrders = () => {
    router.push('/pedidos')
  }

  if (!isLoaded || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando pedido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¡Pedido Creado!
            </h1>
            <p className="text-lg text-gray-600">
              Completa tu transferencia para confirmar el pedido
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Pedido #{orderId?.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Transfer Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <Building2 className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Datos para Transferencia</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Información Bancaria:</h3>
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
                  <li>Realiza la transferencia por el monto exacto: <strong>${parseInt(amount!).toLocaleString('es-CL')}</strong></li>
                  <li>Usa como referencia: <strong>#{orderId?.slice(-8).toUpperCase()}</strong></li>
                  <li>Envía el comprobante por WhatsApp</li>
                  <li>Tu pedido se confirmará al recibir el comprobante</li>
                </ol>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total a Transferir:</span>
                  <span className="text-green-600">${parseInt(amount!).toLocaleString('es-CL')}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={copyTransferData}
                  className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Datos
                </Button>
                
                <Button
                  onClick={sendWhatsApp}
                  className="flex-1 bg-green-500 hover:bg-green-600 flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Enviar Comprobante
                </Button>
              </div>
            </div>
          </div>

          {/* Status */}
          {orderUpdated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Pedido registrado exitosamente</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Tu pedido está esperando la confirmación del pago
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="text-center">
            <Button
              onClick={goToOrders}
              variant="outline"
              className="mr-4"
            >
              Ver Mis Pedidos
            </Button>
            <Button
              onClick={() => router.push('/productos')}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Seguir Comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 