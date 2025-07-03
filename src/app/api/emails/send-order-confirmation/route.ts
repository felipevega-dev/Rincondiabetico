import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail, OrderEmailData } from '@/lib/email'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const emailData: OrderEmailData = body

    // Validar datos requeridos
    if (!emailData.orderNumber || !emailData.customerName || !emailData.customerEmail) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos: orderNumber, customerName, customerEmail' },
        { status: 400 }
      )
    }

    if (!emailData.items || emailData.items.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe tener al menos un producto' },
        { status: 400 }
      )
    }

    // Enviar email
    const result = await sendOrderConfirmationEmail(emailData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email enviado correctamente',
        emailId: result.id
      })
    } else {
      return NextResponse.json(
        { error: 'Error enviando email', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error en API de emails:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 