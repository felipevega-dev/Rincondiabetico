import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminOrdersList } from '@/components/admin/admin-orders-list'

export const metadata: Metadata = {
  title: 'Gestión de Pedidos - Admin - Postres Pasmiño',
  description: 'Panel de administración para gestionar todos los pedidos.',
}

export default async function AdminOrdersPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const userIsAdmin = await isAdmin()
  
  if (!userIsAdmin) {
    redirect('/')
  }

  // Obtener todos los pedidos con información completa
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true
        }
      },
      payment: true
    },
    orderBy: [
      { status: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  // Estadísticas rápidas
  const stats = {
    total: orders.length,
    pendientes: orders.filter(o => o.status === 'PENDIENTE').length,
    preparando: orders.filter(o => o.status === 'PREPARANDO').length,
    listos: orders.filter(o => o.status === 'LISTO').length,
    hoy: orders.filter(o => {
      const today = new Date()
      const orderDate = new Date(o.createdAt)
      return orderDate.toDateString() === today.toDateString()
    }).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Pedidos
          </h1>
          <p className="text-gray-600">
            Administra todos los pedidos de Postres Pasmiño
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Pedidos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.preparando}</div>
            <div className="text-sm text-gray-600">Preparando</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.listos}</div>
            <div className="text-sm text-gray-600">Listos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-pink-600">{stats.hoy}</div>
            <div className="text-sm text-gray-600">Hoy</div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <AdminOrdersList orders={orders} />
      </div>
    </div>
  )
} 