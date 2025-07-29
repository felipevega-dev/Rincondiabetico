import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { OrdersList } from '@/components/client/orders-list'

export const metadata: Metadata = {
  title: 'Mis Pedidos - Postres Pasmiño',
  description: 'Revisa el estado de todos tus pedidos en Postres Pasmiño',
}

export default async function OrdersPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in?redirect_url=/pedidos')
  }

  const dbUser = await getOrCreateUser()
  
  if (!dbUser) {
    redirect('/sign-in')
  }

  // Obtener todos los pedidos del usuario
  const orders = await prisma.order.findMany({
    where: { userId: dbUser.id },
    include: {
      items: {
        include: {
          product: true
        }
      },
      payment: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mis Pedidos
            </h1>
            <p className="text-lg text-gray-600">
              Revisa el estado y detalles de todos tus pedidos
            </p>
          </div>

          {/* Orders List */}
          <OrdersList orders={orders} />
        </div>
      </div>
    </div>
  )
} 