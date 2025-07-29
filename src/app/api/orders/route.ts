import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { notifyOrderConfirmation } from '@/lib/notification-system'
import { confirmStockReservation } from '@/lib/stock-reservation'

interface CreateOrderRequest {
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total: number
  originalTotal?: number
  pickupDate: string
  pickupTime: string
  customerNotes?: string
  phone: string
  isDraft?: boolean
  paymentMethod?: string
  sessionId?: string
  appliedCoupons?: Array<{
    id: string
    code: string
    discountAmount: number
  }>
  totalDiscount?: number
  guestInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  } | null
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
    const body: CreateOrderRequest = await request.json()
    
    // Para invitados, verificar que se tenga la información necesaria
    if (!user && !body.guestInfo) {
      return NextResponse.json(
        { error: 'Información de contacto requerida para invitados' },
        { status: 400 }
      )
    }

    let dbUser = null
    
    // Si hay usuario autenticado, sincronizar con BD
    if (user) {
      dbUser = await getOrCreateUser()
    }
    
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

    // Validar que los productos existan, estén disponibles y tengan stock
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

    // Validar stock disponible
    const stockMap = new Map(products.map(p => [p.id, p.stock]))
    for (const item of body.items) {
      const availableStock = stockMap.get(item.productId)
      if (availableStock === undefined || availableStock < item.quantity) {
        const product = products.find(p => p.id === item.productId)
        return NextResponse.json(
          { error: `Stock insuficiente para ${product?.name}. Disponible: ${availableStock || 0}` },
          { status: 400 }
        )
      }
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

    // Calcular total antes de descuentos
    const calculatedSubtotal = body.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    )

    // Si no hay originalTotal, usamos el total como subtotal para compatibilidad
    const subtotal = body.originalTotal || body.total
    
    if (calculatedSubtotal !== subtotal) {
      return NextResponse.json(
        { error: 'Error en el cálculo del total' },
        { status: 400 }
      )
    }

    // Validar descuentos si hay cupones aplicados
    let finalTotal = calculatedSubtotal
    if (body.appliedCoupons && body.appliedCoupons.length > 0) {
      const totalDiscountFromCoupons = body.appliedCoupons.reduce(
        (sum, coupon) => sum + coupon.discountAmount,
        0
      )
      
      if (totalDiscountFromCoupons !== (body.totalDiscount || 0)) {
        return NextResponse.json(
          { error: 'Error en el cálculo de descuentos' },
          { status: 400 }
        )
      }
      
      finalTotal = Math.max(0, calculatedSubtotal - totalDiscountFromCoupons)
    }

    if (finalTotal !== body.total) {
      return NextResponse.json(
        { error: 'Error en el total final' },
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
          userId: dbUser?.id || null,
          total: body.total, // Total final con descuentos aplicados
          pickupDate: pickupDateTime,
          pickupTime: body.pickupTime,
          customerNotes: body.customerNotes,
          status: body.isDraft ? 'DRAFT' : 'PENDIENTE',
          paymentMethod: body.paymentMethod || null,
          // Información de descuentos
          discountAmount: body.totalDiscount || 0,
          subtotal: body.originalTotal || body.total,
          // Información de invitado si aplica
          guestEmail: body.guestInfo?.email || null
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

      // Solo reducir stock si no es borrador
      if (!body.isDraft) {
        for (const item of body.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          })
        }
      }

      // Crear registros de uso de cupones si existen
      if (body.appliedCoupons && body.appliedCoupons.length > 0 && dbUser) {
        for (const coupon of body.appliedCoupons) {
          await tx.couponUsage.create({
            data: {
              couponId: coupon.id,
              userId: dbUser.id,
              orderId: newOrder.id,
              discountAmount: coupon.discountAmount
            }
          })
        }
      }

      // Actualizar teléfono del usuario si no lo tiene
      if (dbUser && !dbUser.phone && body.phone) {
        await tx.user.update({
          where: { id: dbUser.id },
          data: { phone: body.phone }
        })
      }

      return newOrder
    })

    // Confirmar reservas de stock (eliminar reservas temporales)
    if (body.sessionId && !body.isDraft) {
      try {
        await confirmStockReservation(body.sessionId)
      } catch (error) {
        console.error('Error confirming stock reservation:', error)
      }
    }

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

    // Enviar email de confirmación si no es borrador
    if (!body.isDraft && completeOrder && completeOrder.pickupDate) {
      // Determinar email y nombre del cliente
      const customerEmail = user?.emailAddresses?.[0]?.emailAddress || body.guestInfo?.email
      const customerName = user ? 
        ((user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.username || 'Cliente') :
        body.guestInfo ? `${body.guestInfo.firstName} ${body.guestInfo.lastName}` : 'Cliente'
      
      if (customerEmail) {
        try {
          const notificationResult = await notifyOrderConfirmation({
            orderNumber: completeOrder.orderNumber,
            customerName,
            customerEmail,
            items: completeOrder.items.map(item => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price
            })),
            total: completeOrder.total,
            pickupDate: completeOrder.pickupDate.toLocaleDateString('es-CL'),
            pickupTime: completeOrder.pickupTime || '',
            paymentMethod: completeOrder.paymentMethod || 'PENDIENTE'
          })
        
          console.log(`Notificaciones enviadas para pedido ${completeOrder.orderNumber}:`, {
            email: notificationResult.email.success,
            whatsapp: notificationResult.whatsapp.success
          })
        } catch (notificationError) {
          console.error('Error enviando notificaciones:', notificationError)
          // No fallar la creación del pedido por error de notificaciones
        }
      }
    }

    return NextResponse.json(completeOrder, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(_request: NextRequest) {
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
      where: { userId: dbUser!.id },
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