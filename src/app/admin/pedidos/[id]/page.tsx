import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminOrderDetail } from '@/components/admin/admin-order-detail'

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Pedido ${id} - Admin - Postres Pasmiño`,
    description: 'Detalle del pedido para administradores.',
  }
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const userIsAdmin = await isAdmin()
  
  if (!userIsAdmin) {
    redirect('/')
  }

  // Obtener el pedido con toda la información
  const order = await prisma.order.findUnique({
    where: { id: id },
    include: {
      user: true,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminOrderDetail order={order} />
      </div>
    </div>
  )
} 