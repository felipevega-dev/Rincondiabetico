import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { OrderDetails } from '@/components/client/order-details'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Pedido ${params.id} - Postres Pasmiño`,
    description: 'Detalles de tu pedido en Postres Pasmiño',
  }
}

export default async function OrderPage({ params }: PageProps) {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await getOrCreateUser()
  
  if (!dbUser) {
    redirect('/sign-in')
  }

  // Obtener el pedido
  const order = await prisma.order.findUnique({
    where: { 
      id: params.id,
      userId: dbUser.id // Solo el usuario propietario puede ver el pedido
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      payment: true
    }
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <OrderDetails order={order} />
        </div>
      </div>
    </div>
  )
} 