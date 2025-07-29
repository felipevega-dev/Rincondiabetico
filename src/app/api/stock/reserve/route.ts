import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { reserveStock, releaseStockReservation } from '@/lib/stock-reservation'

const reserveSchema = z.object({
  productId: z.string().min(1, 'Product ID es requerido'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  sessionId: z.string().min(1, 'Session ID es requerido'),
})

const releaseSchema = z.object({
  sessionId: z.string().min(1, 'Session ID es requerido'),
  productId: z.string().optional(),
})

// POST - Reservar stock temporalmente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = reserveSchema.parse(body)
    
    const success = await reserveStock(validatedData)
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Stock reservado exitosamente' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Stock insuficiente' 
      }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error reserving stock:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// DELETE - Liberar reserva de stock
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = releaseSchema.parse(body)
    
    await releaseStockReservation(validatedData.sessionId, validatedData.productId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Reserva liberada exitosamente' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error releasing stock reservation:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}