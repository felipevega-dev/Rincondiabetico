import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoClient } from '@/lib/mercadopago'
import { PaymentMethod } from 'mercadopago'

const paymentMethod = new PaymentMethod(mercadoPagoClient)

export async function GET(_request: NextRequest) {
  try {
    const paymentMethods = await paymentMethod.get()
    
    // Filtrar solo tarjetas de crédito y débito para Chile
    const creditCards = paymentMethods.filter(method => 
      method.payment_type_id === 'credit_card' || method.payment_type_id === 'debit_card'
    )

    return NextResponse.json(creditCards)
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { error: 'Error al obtener métodos de pago' },
      { status: 500 }
    )
  }
} 