'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Calendar, 
  Clock, 
  Package, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  User,
  Phone,
  MessageSquare,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AdminOrdersListProps {
  orders: Array<{
    id: string
    orderNumber: string
    status: string
    total: number
    pickupDate: Date | null
    pickupTime: string | null
    customerNotes: string | null
    adminNotes: string | null
    createdAt: Date
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
      }
    }>
  }>
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

export function AdminOrdersList({ orders }: AdminOrdersListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('TODOS')
  const [dateFilter, setDateFilter] = useState<string>('TODOS')
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter === 'TODOS' || order.status === statusFilter
    
    let dateMatch = true
    if (dateFilter === 'HOY') {
      const today = new Date()
      const orderDate = new Date(order.createdAt)
      dateMatch = orderDate.toDateString() === today.toDateString()
    } else if (dateFilter === 'ESTA_SEMANA') {
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const orderDate = new Date(order.createdAt)
      dateMatch = orderDate >= weekAgo
    }
    
    return statusMatch && dateMatch
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPickupDate = (date: Date | null) => {
    if (!date) return 'No especificada'
    return new Date(date).toLocaleDateString('es-CL', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId)
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
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
      setIsUpdating(null)
    }
  }

  const getCustomerName = (user: AdminOrdersListProps['orders'][0]['user']) => {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim()
    return name || 'Cliente'
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No hay pedidos aún
        </h2>
        <p className="text-gray-600">
          Los pedidos aparecerán aquí cuando los clientes hagan compras
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Filtrar por Estado</h3>
            <div className="flex flex-wrap gap-2">
              {['TODOS', 'PENDIENTE', 'PREPARANDO', 'LISTO', 'RETIRADO', 'CANCELADO'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'TODOS' ? 'Todos' : statusConfig[status as keyof typeof statusConfig]?.label || status}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Filtrar por Fecha</h3>
            <div className="flex flex-wrap gap-2">
              {['TODOS', 'HOY', 'ESTA_SEMANA'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDateFilter(filter)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'TODOS' ? 'Todos' : filter === 'HOY' ? 'Hoy' : 'Esta Semana'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDIENTE
          const StatusIcon = status.icon
          const canAdvance = status.nextStatus && order.status !== 'RETIRADO' && order.status !== 'CANCELADO'

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Información del Pedido */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {status.label}
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">{getCustomerName(order.user)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="ml-6">{order.user.email}</span>
                    </div>
                    {order.user.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{order.user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Productos */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Productos:</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 text-sm">
                          {item.product.images && item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              width={32}
                              height={32}
                              className="rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs">🍰</span>
                            </div>
                          )}
                          <span className="text-gray-700">
                            {item.quantity}x {item.product.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-lg font-bold text-pink-600">
                    Total: ${order.total.toLocaleString('es-CL')}
                  </div>
                </div>

                {/* Información de Retiro */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Retiro Programado</h4>
                  {order.pickupDate ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatPickupDate(order.pickupDate)}</span>
                      </div>
                      {order.pickupTime && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{order.pickupTime}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No especificado</p>
                  )}

                  {order.customerNotes && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Notas del Cliente:
                      </h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {order.customerNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="space-y-3">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Link>

                  {canAdvance && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, status.nextStatus!)}
                      disabled={isUpdating === order.id}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isUpdating === order.id ? (
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
                      onClick={() => updateOrderStatus(order.id, 'CANCELADO')}
                      disabled={isUpdating === order.id}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay pedidos con estos filtros
          </h3>
          <p className="text-gray-600">
            Intenta con otros filtros o espera nuevos pedidos
          </p>
        </div>
      )}
    </div>
  )
} 