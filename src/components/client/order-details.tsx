'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Package, MapPin, Phone, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { OrderActions } from '@/components/client/order-actions'

interface OrderDetailsProps {
  order: {
    id: string
    orderNumber: string
    status: string
    total: number
    pickupDate: Date | null
    pickupTime: string | null
    customerNotes: string | null
    adminNotes: string | null
    createdAt: Date
    userId?: string | null
    items: Array<{
      id: string
      productId: string
      variationId?: string | null
      quantity: number
      price: number
      product: {
        id: string
        name: string
        images: string[]
        stock: number
      }
      variation?: {
        id: string
        name: string
        priceChange: number
      } | null
    }>
    payment: {
      status: string
    } | null
    user?: {
      id: string
      firstName: string | null
      lastName: string | null
    } | null
  }
  isOwner: boolean
  isAdmin: boolean
}

const statusConfig = {
  PENDIENTE: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
    description: 'Tu pedido está pendiente de confirmación'
  },
  PAGADO: {
    label: 'Pagado',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    description: 'Pago confirmado, preparando tu pedido'
  },
  PREPARANDO: {
    label: 'Preparando',
    color: 'bg-purple-100 text-purple-800',
    icon: Package,
    description: 'Tu pedido se está preparando'
  },
  LISTO: {
    label: 'Listo para Retiro',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'Tu pedido está listo para retirar'
  },
  RETIRADO: {
    label: 'Retirado',
    color: 'bg-gray-100 text-gray-800',
    icon: CheckCircle,
    description: 'Pedido retirado exitosamente'
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    description: 'Este pedido ha sido cancelado'
  }
}

export function OrderDetails({ order, isOwner, isAdmin }: OrderDetailsProps) {
  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDIENTE
  const StatusIcon = status.icon

  const formatDate = (date: Date | null) => {
    if (!date) return 'No especificada'
    return new Date(date).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string | null) => {
    if (!time) return 'No especificada'
    return time
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Pedido #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Realizado el {new Date(order.createdAt).toLocaleDateString('es-CL')} a las{' '}
              {new Date(order.createdAt).toLocaleTimeString('es-CL', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            {isAdmin && order.user && (
              <p className="text-sm text-blue-600 mt-1">
                Cliente: {order.user.firstName} {order.user.lastName}
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${status.color}`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {status.label}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{status.description}</p>
        </div>
        
        {/* Order Actions - Show if user can cancel or modify */}
        <div className="mt-6">
          <OrderActions 
            order={order}
            isOwner={isOwner}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      {/* Información de Retiro */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Información de Retiro
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Fecha de Retiro</h3>
                <p className="text-gray-600">{formatDate(order.pickupDate)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-green-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Hora de Retiro</h3>
                <p className="text-gray-600">{formatTime(order.pickupTime)}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Ubicación de Retiro</h4>
            <p className="text-blue-800 text-sm">
              <strong>Postres Pasmiño</strong><br />
              Progreso 393<br />
              Chiguayante, Región del Biobío<br />
              Chile
            </p>
            <div className="mt-3">
              <a
                href="https://wa.me/56912345678"
                className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
              >
                <Phone className="w-4 h-4 mr-1" />
                +56 9 1234 5678
              </a>
            </div>
          </div>
        </div>

        {order.customerNotes && (
          <div className="mt-6 bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Notas del Pedido
            </h4>
            <p className="text-yellow-800 text-sm">{order.customerNotes}</p>
          </div>
        )}

        {order.adminNotes && (
          <div className="mt-4 bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Notas del Admin</h4>
            <p className="text-purple-800 text-sm">{order.adminNotes}</p>
          </div>
        )}
      </div>

      {/* Productos del Pedido */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Productos del Pedido
        </h2>
        
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {item.product.images && item.product.images.length > 0 ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🍰</span>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                {item.variation && (
                  <p className="text-sm text-blue-600">{item.variation.name}</p>
                )}
                <p className="text-sm text-gray-600">
                  Cantidad: {item.quantity} × ${item.price.toLocaleString('es-CL')}
                </p>
                {isAdmin && (
                  <p className="text-xs text-gray-500">
                    Stock actual: {item.product.stock}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toLocaleString('es-CL')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="text-pink-600">${order.total.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/pedidos"
            className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
          >
            Ver Todos los Pedidos
          </Link>
          
          <Link
            href="/productos"
            className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-pink-700 transition-colors"
          >
            Hacer Otro Pedido
          </Link>
          
          <a
            href="https://wa.me/56912345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-green-700 transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
} 