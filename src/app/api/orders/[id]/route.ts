import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { notifyStatusChange } from '@/lib/notification-system'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const dbUser = await getOrCreateUser()
    const body = await request.json()

    // Verificar que el pedido pertenece al usuario
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    if (order.userId !== dbUser!.id) {
      return NextResponse.json(
        { error: 'No autorizado para modificar este pedido' },
        { status: 403 }
      )
    }

    // Guardar el estado anterior para notificaciones
    const previousStatus = order.status
    const newStatus = body.status || order.status

    // Actualizar el pedido
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
        paymentMethod: body.paymentMethod || order.paymentMethod,
        adminNotes: body.adminNotes || order.adminNotes,
        updatedAt: new Date()
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })

    // Enviar notificaciones si el estado cambió
    if (body.status && previousStatus !== newStatus) {
      try {
        const notificationResult = await notifyStatusChange({
          orderNumber: updatedOrder.orderNumber,
          customerName: `${updatedOrder.user.firstName} ${updatedOrder.user.lastName}`.trim(),
          customerEmail: updatedOrder.user.email,
          total: updatedOrder.total,
          items: updatedOrder.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price
          })),
          paymentMethod: updatedOrder.paymentMethod || 'PENDIENTE',
          pickupDate: updatedOrder.pickupDate?.toLocaleDateString('es-CL') || '',
          pickupTime: updatedOrder.pickupTime || '',
          newStatus,
          previousStatus
        })

        console.log(`Notificaciones de cambio de estado enviadas para pedido ${updatedOrder.orderNumber}:`, {
          from: previousStatus,
          to: newStatus,
          email: notificationResult.email.success,
          whatsapp: notificationResult.whatsapp.success
        })
      } catch (notificationError) {
        console.error('Error enviando notificaciones de cambio de estado:', notificationError)
        // No fallar la actualización por error de notificaciones
      }
    }

    return NextResponse.json(updatedOrder)

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const dbUser = await getOrCreateUser()

    // Obtener el pedido
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        payment: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el pedido pertenece al usuario
    if (order.userId !== dbUser!.id) {
      return NextResponse.json(
        { error: 'No autorizado para ver este pedido' },
        { status: 403 }
      )
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 