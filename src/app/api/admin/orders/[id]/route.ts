import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'

interface UpdateOrderRequest {
  status?: string
  adminNotes?: string
}

const validStatuses = ['PENDIENTE', 'PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO', 'CANCELADO']

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

    // Verificar que es admin
    const userIsAdmin = await isAdmin()
    
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      )
    }

    const body: UpdateOrderRequest = await request.json()
    
    // Validar estado si se proporciona
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      )
    }

    // Verificar que el pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar el pedido con manejo de stock
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Si se está cancelando el pedido, restaurar stock
      if (body.status === 'CANCELADO' && existingOrder.status !== 'CANCELADO') {
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: id },
          include: { product: true }
        })

        // Restaurar stock de cada producto
        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          })
        }
      }

      // Actualizar el pedido
      return await tx.order.update({
        where: { id: id },
        data: {
          ...(body.status && { status: body.status as any }),
          ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
          updatedAt: new Date()
        },
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
    })

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

    // Verificar que es admin
    const userIsAdmin = await isAdmin()
    
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      )
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
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
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