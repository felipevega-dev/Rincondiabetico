'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Package, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface AdminOrderDetailProps {
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
    updatedAt: Date
    user: {
      firstName: string | null
      lastName: string | null
      email: string
      phone: string | null
    }
    items: Array<{
      id: string
      quantity: number
      price: number
      product: {
        id: string
        name: string
        images: string[]
        description: string | null
      }
    }>
    payment?: {
      id: string
      status: string
      amount: number
      method: string
    } | null
  }
}

const statusConfig = {
  PENDIENTE: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertCircle,
    nextStatus: 'PREPARANDO'
  },
  PAGADO: {
    label: 'Pagado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle,
    nextStatus: 'PREPARANDO'
  },
  PREPARANDO: {
    label: 'Preparando',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Package,
    nextStatus: 'LISTO'
  },
  LISTO: {
    label: 'Listo',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    nextStatus: 'RETIRADO'
  },
  RETIRADO: {
    label: 'Retirado',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: CheckCircle,
    nextStatus: null
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    nextStatus: null
  }
}

export function AdminOrderDetail({ order }: AdminOrderDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '')

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDIENTE
  const StatusIcon = status.icon
  const canAdvance = status.nextStatus && order.status !== 'RETIRADO' && order.status !== 'CANCELADO'

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPickupDate = (date: Date | null) => {
    if (!date) return 'No especificada'
    return new Date(date).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCustomerName = () => {
    const name = `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
    return name || 'Cliente'
  }

  const updateOrderStatus = async (newStatus: string) => {
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado')
      }

      toast.success(`Pedido actualizado a ${statusConfig[newStatus as keyof typeof statusConfig]?.label}`)
      
      // Recargar la página para mostrar los cambios
      window.location.reload()
      
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Error al actualizar el pedido')
    } finally {
      setIsUpdating(false)
    }
  }

  const saveAdminNotes = async () => {
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminNotes }),
      })

      if (!response.ok) {
        throw new Error('Error al guardar las notas')
      }

      toast.success('Notas guardadas exitosamente')
      setIsEditingNotes(false)
      
      // Recargar la página para mostrar los cambios
      window.location.reload()
      
    } catch (error) {
      console.error('Error saving notes:', error)
      toast.error('Error al guardar las notas')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/pedidos"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pedido #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Creado el {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${status.color}`}>
            <StatusIcon className="w-4 h-4 mr-2" />
            {status.label}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-3">
          {canAdvance && (
            <Button
              onClick={() => updateOrderStatus(status.nextStatus!)}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isUpdating ? (
                'Actualizando...'
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Marcar como {statusConfig[status.nextStatus as keyof typeof statusConfig]?.label}
                </>
              )}
            </Button>
          )}

          {order.status !== 'CANCELADO' && order.status !== 'RETIRADO' && (
            <Button
              onClick={() => updateOrderStatus('CANCELADO')}
              disabled={isUpdating}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar Pedido
            </Button>
          )}

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Imprimir
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Información del Cliente */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <User className="mr-2" />
            Información del Cliente
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nombre:</label>
              <p className="text-gray-900">{getCustomerName()}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Email:</label>
              <p className="text-gray-900 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {order.user.email}
              </p>
            </div>
            
            {order.user.phone && (
              <div>
                <label className="text-sm font-medium text-gray-700">Teléfono:</label>
                <p className="text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {order.user.phone}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Información de Retiro */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="mr-2" />
            Información de Retiro
          </h2>
          
          <div className="space-y-4">
            {order.pickupDate ? (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha:</label>
                  <p className="text-gray-900">{formatPickupDate(order.pickupDate)}</p>
                </div>
                
                {order.pickupTime && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hora:</label>
                    <p className="text-gray-900 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {order.pickupTime}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">Información de retiro no especificada</p>
            )}
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                <strong>Dirección de la tienda:</strong><br />
                Progreso 393, Chiguayante<br />
                Región del Biobío, Chile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos del Pedido */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Package className="mr-2" />
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
                {item.product.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.product.description}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.quantity} × ${item.price.toLocaleString('es-CL')}
                  </p>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total del Pedido:</span>
            <span className="text-pink-600">${order.total.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Notas del Cliente */}
        {order.customerNotes && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="mr-2" />
              Notas del Cliente
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-800">{order.customerNotes}</p>
            </div>
          </div>
        )}

        {/* Notas del Admin */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Edit className="mr-2" />
              Notas Administrativas
            </h2>
            {!isEditingNotes && (
              <Button
                onClick={() => setIsEditingNotes(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
          
          {isEditingNotes ? (
            <div className="space-y-3">
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Agregar notas administrativas..."
                rows={4}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={saveAdminNotes}
                  disabled={isUpdating}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  onClick={() => {
                    setIsEditingNotes(false)
                    setAdminNotes(order.adminNotes || '')
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              {order.adminNotes ? (
                <p className="text-gray-800">{order.adminNotes}</p>
              ) : (
                <p className="text-gray-500 italic">Sin notas administrativas</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Información de Pago */}
      {order.payment && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información de Pago
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Estado:</label>
              <p className="text-gray-900">{order.payment.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Método:</label>
              <p className="text-gray-900">{order.payment.method}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Monto:</label>
              <p className="text-gray-900">${order.payment.amount.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 