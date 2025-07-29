import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      token, 
      orderId, 
      paymentMethodId, 
      installments = 1
    } = body

    if (!token || !orderId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    // Obtener datos de la orden
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    if (order.status !== OrderStatus.PENDIENTE) {
      return NextResponse.json(
        { error: 'La orden ya fue procesada' },
        { status: 400 }
      )
    }

    // Crear el pago en MercadoPago - payload mínimo
    const paymentData = {
      transaction_amount: order.total,
      token,
      description: `Pedido #${order.orderNumber} - Postres Pasmiño`,
      installments: Number(installments),
      payment_method_id: paymentMethodId,
      payer: {
        email: order.user.email
      },
      external_reference: orderId
    }

    console.log('Creating payment with data:', {
      ...paymentData,
      token: 'HIDDEN'
    })

    const result = await payment.create({ body: paymentData })

    console.log('Payment result:', {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail
    })

    // Actualizar el estado de la orden según el resultado
    let orderStatus: 'PENDIENTE' | 'PAGADO' | 'CANCELADO' = 'PENDIENTE'
    
    if (result.status === 'approved') {
      orderStatus = 'PAGADO'
      // Nota: El stock se reducirá cuando llegue el webhook de confirmación
      // Esto evita doble reducción y garantiza consistencia con MercadoPago
    } else if (result.status === 'rejected') {
      orderStatus = 'CANCELADO'
    }

    // Actualizar la orden con información del pago
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
        paymentMethod: 'MERCADOPAGO',
        updatedAt: new Date()
      }
    })

    // Crear o actualizar el registro de pago
    await prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        status: result.status === 'approved' ? 'PAID' : 
                result.status === 'rejected' ? 'FAILED' : 'PENDING',
        amount: order.total,
        currency: 'CLP',
        transactionId: result.id?.toString(),
        responseCode: result.status
      },
      update: {
        status: result.status === 'approved' ? 'PAID' : 
                result.status === 'rejected' ? 'FAILED' : 'PENDING',
        transactionId: result.id?.toString(),
        responseCode: result.status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      id: result.id,
      status: result.status,
      detail: result.status_detail,
      orderId,
      message: getStatusMessage(result.status, result.status_detail)
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    
    // Intentar extraer información útil del error de MercadoPago
    let errorMessage = 'Error interno del servidor'
    let statusCode = 500

    if (error && typeof error === 'object') {
      const mpError = error as any
      
      if (mpError.cause) {
        // Error de la API de MercadoPago
        const causes = Array.isArray(mpError.cause) ? mpError.cause : [mpError.cause]
        errorMessage = causes.map((c: any) => c.description || c.message).join(', ')
        statusCode = mpError.status || 400
      } else if (mpError.message) {
        errorMessage = mpError.message
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: statusCode }
    )
  }
}

function getStatusMessage(status: string | undefined, statusDetail: string | undefined): string {
  switch (status) {
    case 'approved':
      return 'Pago aprobado exitosamente'
    case 'pending':
      switch (statusDetail) {
        case 'pending_contingency':
          return 'Pago en proceso de verificación'
        case 'pending_review_manual':
          return 'Pago en revisión manual'
        default:
          return 'Pago pendiente de confirmación'
      }
    case 'rejected':
      switch (statusDetail) {
        case 'cc_rejected_insufficient_amount':
          return 'Fondos insuficientes'
        case 'cc_rejected_bad_filled_card_number':
          return 'Número de tarjeta incorrecto'
        case 'cc_rejected_bad_filled_date':
          return 'Fecha de vencimiento incorrecta'
        case 'cc_rejected_bad_filled_security_code':
          return 'Código de seguridad incorrecto'
        case 'cc_rejected_bad_filled_other':
          return 'Error en los datos de la tarjeta'
        case 'cc_rejected_blacklist':
          return 'Tarjeta no autorizada'
        case 'cc_rejected_call_for_authorize':
          return 'Contacta a tu banco para autorizar el pago'
        case 'cc_rejected_card_disabled':
          return 'Tarjeta deshabilitada'
        case 'cc_rejected_duplicated_payment':
          return 'Pago duplicado'
        case 'cc_rejected_high_risk':
          return 'Pago rechazado por riesgo'
        case 'cc_rejected_max_attempts':
          return 'Máximo de intentos alcanzado'
        default:
          return 'Pago rechazado'
      }
    default:
      return 'Estado de pago desconocido'
  }
} 