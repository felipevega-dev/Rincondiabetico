import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hasAvailableStock } from '@/lib/stock-reservation'

const validateCartSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive()
  }))
})

// POST - Validar disponibilidad de stock para todo el carrito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = validateCartSchema.parse(body)
    
    const results = []
    let allAvailable = true
    
    for (const item of validatedData.items) {
      const hasStock = await hasAvailableStock(item.productId, item.quantity)
      
      if (!hasStock) {
        allAvailable = false
      }
      
      results.push({
        productId: item.productId,
        requestedQuantity: item.quantity,
        available: hasStock
      })
    }
    
    return NextResponse.json({
      success: allAvailable,
      results
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    console.error('Error validating cart stock:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}