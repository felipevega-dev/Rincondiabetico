import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const dbUser = await getOrCreateUser()
    const { id } = params
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

    // Actualizar el pedido
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: body.status || order.status,
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
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const dbUser = await getOrCreateUser()
    const { id } = params

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