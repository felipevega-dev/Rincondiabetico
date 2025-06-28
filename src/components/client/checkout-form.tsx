'use client'

import { useState } from 'react'
import { useCart } from '@/components/providers/cart-provider'
import { useToast } from '@/components/providers/toast-provider'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ShoppingBag, User, Phone, MessageSquare } from 'lucide-react'

interface OrderData {
  pickupDate: string
  pickupTime: string
  customerNotes: string
  phone: string
}

export function CheckoutForm() {
  const { items, total, clearCart } = useCart()
  const { showToast } = useToast()
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderData, setOrderData] = useState<OrderData>({
    pickupDate: '',
    pickupTime: '',
    customerNotes: '',
    phone: user?.phoneNumbers?.[0]?.phoneNumber || ''
  })

  // Generar horarios disponibles
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeString)
      }
    }
    return slots
  }

  // Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validaciones
      if (!orderData.pickupDate || !orderData.pickupTime) {
        showToast('Por favor selecciona fecha y hora de retiro', 'error')
        return
      }

      if (!orderData.phone) {
        showToast('Por favor ingresa tu número de teléfono', 'error')
        return
      }

      // Crear pedido temporal (status: DRAFT)
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          total,
          pickupDate: orderData.pickupDate,
          pickupTime: orderData.pickupTime,
          customerNotes: orderData.customerNotes,
          phone: orderData.phone,
          isDraft: true // Marcar como borrador hasta que se confirme el pago
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Error al crear el pedido')
      }

      const order = await orderResponse.json()
      
      // Redirigir a la página de pago integrada
      window.location.href = `/checkout/payment?orderId=${order.id}&amount=${total}`
      
    } catch (error) {
      console.error('Error creating order:', error)
      showToast('Error al procesar el pedido. Inténtalo nuevamente.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-600 mb-6">
          Agrega algunos productos antes de hacer un pedido
        </p>
        <Link
          href="/productos"
          className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Ver Productos
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Resumen del Pedido */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <ShoppingBag className="mr-2" />
          Resumen del Pedido
        </h2>
        
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🍰</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Cantidad: {item.quantity} × ${item.price.toLocaleString('es-CL')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toLocaleString('es-CL')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="text-pink-600">${total.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      {/* Formulario de Pedido */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="mr-2" />
          Información del Pedido
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <Input
              type="text"
              value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={user?.emailAddresses?.[0]?.emailAddress || ''}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              Teléfono *
            </label>
            <Input
              id="phone"
              type="tel"
              value={orderData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+56 9 1234 5678"
              required
            />
          </div>

          {/* Fecha y Hora de Retiro */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Fecha de Retiro *
              </label>
              <Input
                id="pickupDate"
                type="date"
                value={orderData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                min={getMinDate()}
                required
              />
            </div>

            <div>
              <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Hora de Retiro *
              </label>
              <select
                id="pickupTime"
                value={orderData.pickupTime}
                onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar hora</option>
                {generateTimeSlots().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notas del Cliente */}
          <div>
            <label htmlFor="customerNotes" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Notas Adicionales (Opcional)
            </label>
            <Textarea
              id="customerNotes"
              value={orderData.customerNotes}
              onChange={(e) => handleInputChange('customerNotes', e.target.value)}
              placeholder="Instrucciones especiales, alergias, etc."
              rows={3}
            />
          </div>

          {/* Información Importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Información del Pedido:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Solo retiro en tienda: Progreso 393, Chiguayante</li>
              <li>• Horario de atención: Lun-Vie 9:00-19:00, Sáb 9:00-17:00, Dom 10:00-15:00</li>
              <li>• El pedido se reservará por 24 horas después de la hora programada</li>
            </ul>
          </div>

          {/* Información de Pago */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">💳 Pago Seguro con MercadoPago:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Pago con tarjeta de crédito, débito o transferencia</li>
              <li>• Transacción 100% segura y encriptada</li>
              <li>• Recibirás confirmación inmediata por email</li>
              <li>• Tu pedido se preparará una vez confirmado el pago</li>
            </ul>
          </div>

          {/* Botón de Envío */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg font-semibold"
          >
            {isSubmitting ? 'Creando pedido...' : 'Continuar al Pago'}
          </Button>
        </form>
      </div>
    </div>
  )
} 