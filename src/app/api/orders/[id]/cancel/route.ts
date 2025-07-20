import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { sendNotification } from '@/lib/notification-system'
import { z } from 'zod'

const cancelOrderSchema = z.object({
  reason: z.string().min(1, 'La razón es requerida'),
  adminCancel: z.boolean().default(false)
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id: orderId } = params
    const body = await request.json()
    const { reason, adminCancel } = cancelOrderSchema.parse(body)

    // Obtener usuario actual
    const currentUser = await getOrCreateUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener pedido con todos los datos necesarios
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variation: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    // Verificar permisos
    if (!adminCancel && order.userId !== currentUser.id) {
      return NextResponse.json({ error: 'No tienes permisos para cancelar este pedido' }, { status: 403 })
    }

    // Si no es admin, verificar que el usuario solo pueda cancelar sus propios pedidos
    if (!adminCancel && currentUser.role !== 'ADMIN' && order.userId !== currentUser.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Verificar estados válidos para cancelación
    const cancellableStates = ['PENDIENTE', 'PREPARANDO']
    if (!cancellableStates.includes(order.status)) {
      return NextResponse.json({ 
        error: `No se puede cancelar un pedido en estado ${order.status}` 
      }, { status: 400 })
    }

    // Iniciar transacción para cancelación
    const result = await prisma.$transaction(async (tx) => {
      // 1. Actualizar estado del pedido
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELADO',
          cancelledAt: new Date(),
          cancelReason: reason,
          cancelledBy: adminCancel ? 'ADMIN' : 'CUSTOMER'
        }
      })

      // 2. Restaurar stock para cada item
      for (const item of order.items) {
        // Incrementar stock del producto
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })

        // Registrar movimiento de stock
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'CANCEL',
            quantity: item.quantity,
            reference: `Cancelación pedido ${order.orderNumber}`,
            orderId: orderId,
            userId: currentUser.id
          }
        })
      }

      return updatedOrder
    })

    // 3. Enviar notificaciones
    try {
      // Notificar al cliente
      if (order.user) {
        await sendNotification(order.user.id, {
          type: 'ORDER_CANCELLED',
          orderId: order.id,
          orderNumber: order.orderNumber,
          reason: reason,
          cancelledBy: adminCancel ? 'admin' : 'customer'
        })
      }

      // Si fue cancelado por admin, notificar también por WhatsApp admin
      if (adminCancel) {
        await sendNotification('admin', {
          type: 'ADMIN_ORDER_CANCELLED',
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestEmail || 'Invitado',
          reason: reason,
          total: order.total
        })
      }
    } catch (notificationError) {
      console.error('Error sending cancellation notifications:', notificationError)
      // No fallar la cancelación si las notificaciones fallan
    }

    return NextResponse.json({
      success: true,
      order: result,
      message: 'Pedido cancelado exitosamente'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error cancelling order:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}