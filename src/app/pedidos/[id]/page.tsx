import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { OrderDetails } from '@/components/client/order-details'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Pedido ${id} - Postres Pasmiño`,
    description: 'Detalles de tu pedido en Postres Pasmiño',
  }
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await getOrCreateUser()
  
  if (!dbUser) {
    redirect('/sign-in')
  }

  // Obtener el pedido - permitir que admin vea cualquier pedido
  const order = await prisma.order.findUnique({
    where: { 
      id: id,
      ...(dbUser.role !== 'ADMIN' && { userId: dbUser.id }) // Solo filtrar por userId si no es admin
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
          variation: true
        }
      },
      payment: true
    }
  })

  if (!order) {
    notFound()
  }

  // Determinar permisos
  const isOwner = order.userId === dbUser.id
  const isAdmin = dbUser.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <OrderDetails 
            order={order} 
            isOwner={isOwner}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  )
} 