'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Package, Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  pickupDate: Date | null
  pickupTime: string | null
  createdAt: Date
  items: Array<{
    id: string
    quantity: number
    product: {
      id: string
      name: string
      images: string[]
    }
  }>
}

const statusConfig = {
  PENDIENTE: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertCircle
  },
  PAGADO: {
    label: 'Pagado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle
  },
  PREPARANDO: {
    label: 'Preparando',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Package
  },
  LISTO: {
    label: 'Listo',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  RETIRADO: {
    label: 'Retirado',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: CheckCircle
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  }
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('TODOS')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/orders')
        
        if (!response.ok) {
          throw new Error('Error al cargar pedidos')
        }
        
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError('Error al cargar los pedidos')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => 
    statusFilter === 'TODOS' || order.status === statusFilter
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string | null) => {
    if (!time) return 'No especificada'
    return time
  }

  const getItemsPreview = (items: Order['items']) => {
    const firstThree = items.slice(0, 3)
    const remaining = items.length - 3
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-2">
          {firstThree.map((item) => (
            <div key={item.id} className="relative">
              {item.product.images && item.product.images.length > 0 ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs">🍰</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {items.length} producto{items.length !== 1 ? 's' : ''}
          {remaining > 0 && ` (+${remaining} más)`}
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar pedidos
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Reintentar
          </button>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No tienes pedidos aún
          </h2>
          <p className="text-gray-600 mb-8">
            ¡Haz tu primer pedido y disfruta de nuestros deliciosos postres!
          </p>
          <Link
            href="/productos"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Ver Productos
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Estado</h2>
          <div className="flex flex-wrap gap-2">
            {['TODOS', 'PENDIENTE', 'PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO', 'CANCELADO'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'TODOS' ? 'Todos' : statusConfig[status as keyof typeof statusConfig]?.label || status}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDIENTE
          const StatusIcon = status.icon

          return (
            <Card key={order.id} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Información Principal */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Pedido #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Realizado el {formatDate(order.createdAt)}
                      </p>
                    </div>
                    
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 sm:mt-0 ${status.color}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {status.label}
                    </div>
                  </div>

                  {/* Productos Preview */}
                  <div className="mb-4">
                    {getItemsPreview(order.items)}
                  </div>

                  {/* Información de Retiro */}
                  {order.pickupDate && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Retiro: {formatDate(order.pickupDate)}</span>
                      </div>
                      {order.pickupTime && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{formatTime(order.pickupTime)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total */}
                  <div className="text-lg font-bold text-pink-600">
                    Total: ${order.total.toLocaleString('es-CL')}
                  </div>
                </div>

                {/* Acciones */}
                <div className="mt-4 lg:mt-0 lg:ml-6">
                  <Link
                    href={`/pedidos/${order.id}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Link>
                </div>
              </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOrders.length === 0 && statusFilter !== 'TODOS' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay pedidos con este estado
            </h3>
            <p className="text-gray-600">
              Intenta con otro filtro o realiza un nuevo pedido
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 