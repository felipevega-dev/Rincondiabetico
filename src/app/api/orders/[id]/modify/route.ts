import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { sendNotification } from '@/lib/notification-system'
import { z } from 'zod'

const modifyOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variationId: z.string().optional(),
    quantity: z.number().min(1),
    price: z.number()
  })),
  reason: z.string().min(1, 'La razón es requerida')
})

export async function PUT(
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
    const { items: newItems, reason } = modifyOrderSchema.parse(body)

    // Obtener usuario actual
    const currentUser = await getOrCreateUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener pedido con items actuales
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

    // Verificar permisos - solo el dueño del pedido o admin
    if (order.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No tienes permisos para modificar este pedido' }, { status: 403 })
    }

    // Solo se puede modificar antes de PREPARANDO
    if (!['PENDIENTE'].includes(order.status)) {
      return NextResponse.json({ 
        error: `No se puede modificar un pedido en estado ${order.status}` 
      }, { status: 400 })
    }

    // Validar stock disponible para los nuevos items
    for (const newItem of newItems) {
      const product = await prisma.product.findUnique({
        where: { id: newItem.productId }
      })

      if (!product || !product.isAvailable) {
        return NextResponse.json({ 
          error: `Producto ${newItem.productId} no disponible` 
        }, { status: 400 })
      }

      // Calcular cuánto stock necesitamos adicional
      const currentItem = order.items.find(item => 
        item.productId === newItem.productId && 
        item.variationId === newItem.variationId
      )
      
      const currentQuantity = currentItem ? currentItem.quantity : 0
      const additionalNeeded = newItem.quantity - currentQuantity

      if (additionalNeeded > 0 && product.stock < additionalNeeded) {
        return NextResponse.json({ 
          error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Necesario: ${additionalNeeded}` 
        }, { status: 400 })
      }
    }

    // Ejecutar modificación en transacción
    const result = await prisma.$transaction(async (tx) => {
      // 1. Restaurar stock de items actuales
      for (const currentItem of order.items) {
        await tx.product.update({
          where: { id: currentItem.productId },
          data: {
            stock: {
              increment: currentItem.quantity
            }
          }
        })

        // Registrar movimiento de stock
        await tx.stockMovement.create({
          data: {
            productId: currentItem.productId,
            type: 'MANUAL_INCREASE',
            quantity: currentItem.quantity,
            reference: `Modificación pedido ${order.orderNumber} - Restauración`,
            orderId: orderId,
            userId: currentUser.id
          }
        })
      }

      // 2. Eliminar items actuales
      await tx.orderItem.deleteMany({
        where: { orderId: orderId }
      })

      // 3. Crear nuevos items y reservar stock
      let newTotal = 0
      
      for (const newItem of newItems) {
        // Crear item
        await tx.orderItem.create({
          data: {
            orderId: orderId,
            productId: newItem.productId,
            variationId: newItem.variationId,
            quantity: newItem.quantity,
            price: newItem.price
          }
        })

        // Reducir stock
        await tx.product.update({
          where: { id: newItem.productId },
          data: {
            stock: {
              decrement: newItem.quantity
            }
          }
        })

        // Registrar movimiento de stock
        await tx.stockMovement.create({
          data: {
            productId: newItem.productId,
            type: 'RESERVE',
            quantity: -newItem.quantity,
            reference: `Modificación pedido ${order.orderNumber} - Nueva reserva`,
            orderId: orderId,
            userId: currentUser.id
          }
        })

        newTotal += newItem.price * newItem.quantity
      }

      // 4. Actualizar pedido con nuevo total y agregar nota
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          total: newTotal,
          notes: order.notes 
            ? `${order.notes}\n\n[Modificado]: ${reason}`
            : `[Modificado]: ${reason}`,
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: true,
              variation: true
            }
          },
          user: true
        }
      })

      return updatedOrder
    })

    // 5. Enviar notificaciones
    try {
      // Notificar al cliente
      if (order.user) {
        await sendNotification(order.user.id, {
          type: 'ORDER_MODIFIED',
          orderId: order.id,
          orderNumber: order.orderNumber,
          reason: reason,
          newTotal: result.total
        })
      }

      // Notificar admin
      await sendNotification('admin', {
        type: 'ADMIN_ORDER_MODIFIED',
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestEmail || 'Invitado',
        reason: reason,
        oldTotal: order.total,
        newTotal: result.total
      })
    } catch (notificationError) {
      console.error('Error sending modification notifications:', notificationError)
      // No fallar la modificación si las notificaciones fallan
    }

    return NextResponse.json({
      success: true,
      order: result,
      message: 'Pedido modificado exitosamente'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error modifying order:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}