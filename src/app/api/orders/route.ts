import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'

interface CreateOrderRequest {
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total: number
  pickupDate: string
  pickupTime: string
  customerNotes?: string
  phone: string
}

// Generar número de orden único
function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `PP${year}${month}${day}${random}`
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Sincronizar usuario con BD
    const dbUser = await getOrCreateUser()
    
    const body: CreateOrderRequest = await request.json()
    
    // Validaciones
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe tener al menos un producto' },
        { status: 400 }
      )
    }

    if (!body.pickupDate || !body.pickupTime) {
      return NextResponse.json(
        { error: 'Fecha y hora de retiro son requeridas' },
        { status: 400 }
      )
    }

    if (!body.phone) {
      return NextResponse.json(
        { error: 'Número de teléfono es requerido' },
        { status: 400 }
      )
    }

    // Validar que los productos existan y estén disponibles
    const productIds = body.items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        isAvailable: true
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Algunos productos no están disponibles' },
        { status: 400 }
      )
    }

    // Validar precios
    const productPrices = new Map(products.map(p => [p.id, p.price]))
    for (const item of body.items) {
      const expectedPrice = productPrices.get(item.productId)
      if (expectedPrice !== item.price) {
        return NextResponse.json(
          { error: 'Los precios han cambiado. Actualiza tu carrito.' },
          { status: 400 }
        )
      }
    }

    // Calcular total
    const calculatedTotal = body.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )

    if (calculatedTotal !== body.total) {
      return NextResponse.json(
        { error: 'El total no coincide' },
        { status: 400 }
      )
    }

    // Crear fecha y hora de retiro
    const pickupDateTime = new Date(`${body.pickupDate}T${body.pickupTime}:00`)
    
    // Validar que la fecha sea futura
    if (pickupDateTime <= new Date()) {
      return NextResponse.json(
        { error: 'La fecha de retiro debe ser futura' },
        { status: 400 }
      )
    }

    // Generar número de orden único
    let orderNumber: string
    let attempts = 0
    do {
      orderNumber = generateOrderNumber()
      attempts++
      
      const existingOrder = await prisma.order.findUnique({
        where: { orderNumber }
      })
      
      if (!existingOrder) break
      
      if (attempts > 10) {
        throw new Error('No se pudo generar un número de orden único')
      }
    } while (true)

    // Crear pedido con items en una transacción
    const order = await prisma.$transaction(async (tx) => {
      // Crear el pedido
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: dbUser.id,
          total: calculatedTotal,
          pickupDate: pickupDateTime,
          pickupTime: body.pickupTime,
          customerNotes: body.customerNotes,
          status: 'PENDIENTE'
        }
      })

      // Crear los items del pedido
      await tx.orderItem.createMany({
        data: body.items.map(item => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      })

      // Actualizar teléfono del usuario si no lo tiene
      if (!dbUser.phone && body.phone) {
        await tx.user.update({
          where: { id: dbUser.id },
          data: { phone: body.phone }
        })
      }

      return newOrder
    })

    // Obtener el pedido completo con items y productos
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })

    return NextResponse.json(completeOrder, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const dbUser = await getOrCreateUser()

    // Obtener pedidos del usuario
    const orders = await prisma.order.findMany({
      where: { userId: dbUser.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 