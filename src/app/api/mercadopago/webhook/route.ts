import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoClient } from '@/lib/mercadopago'
import { prisma } from '@/lib/prisma'
import { Payment } from 'mercadopago'

const payment = new Payment(mercadoPagoClient)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('MercadoPago Webhook received:', body)

    // Verificar que es una notificación de pago
    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'Not a payment notification' })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 })
    }

    // Obtener información del pago desde MercadoPago
    const paymentInfo = await payment.get({ id: paymentId })
    
    if (!paymentInfo) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const externalReference = paymentInfo.external_reference
    if (!externalReference) {
      console.log('No external reference found')
      return NextResponse.json({ message: 'No external reference' })
    }

    // Buscar el pedido en la base de datos
    const order = await prisma.order.findUnique({
      where: { id: externalReference },
      include: { items: true }
    })

    if (!order) {
      console.log('Order not found:', externalReference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Mapear estados de MercadoPago a nuestros estados
    let orderStatus: 'PENDIENTE' | 'PAGADO' | 'PREPARANDO' | 'LISTO' | 'RETIRADO' | 'CANCELADO'
    switch (paymentInfo.status) {
      case 'approved':
        orderStatus = 'PAGADO'
        break
      case 'pending':
      case 'in_process':
        orderStatus = 'PENDIENTE'
        break
      case 'rejected':
      case 'cancelled':
        orderStatus = 'CANCELADO'
        break
      default:
        orderStatus = 'PENDIENTE'
    }

    // Actualizar el pedido
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: orderStatus,
        updatedAt: new Date()
      }
    })

    // Crear o actualizar el registro de pago
    await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        status: paymentInfo.status === 'approved' ? 'PAID' : 
                paymentInfo.status === 'rejected' || paymentInfo.status === 'cancelled' ? 'FAILED' : 'PENDING',
        transactionId: paymentId.toString(),
        responseCode: paymentInfo.status,
        updatedAt: new Date()
      },
      create: {
        orderId: order.id,
        status: paymentInfo.status === 'approved' ? 'PAID' : 
                paymentInfo.status === 'rejected' || paymentInfo.status === 'cancelled' ? 'FAILED' : 'PENDING',
        amount: order.total,
        currency: 'CLP',
        transactionId: paymentId.toString(),
        responseCode: paymentInfo.status
      }
    })

    // Si el pago fue aprobado, reducir stock
    if (paymentInfo.status === 'approved' && order.status !== 'PAGADO') {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      console.log(`Payment approved for order ${order.id}, stock updated`)
    }

    console.log(`Order ${order.id} updated to status: ${orderStatus}`)

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      orderId: order.id,
      status: orderStatus
    })

  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}

// GET para verificación de MercadoPago (opcional)
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const topic = url.searchParams.get('topic')
  const id = url.searchParams.get('id')

  if (topic === 'payment' && id) {
    try {
      const paymentInfo = await payment.get({ id: parseInt(id) })
      return NextResponse.json(paymentInfo)
    } catch (error) {
      console.error('Error getting payment info:', error)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
  }

  return NextResponse.json({ message: 'Webhook endpoint active' })
} 