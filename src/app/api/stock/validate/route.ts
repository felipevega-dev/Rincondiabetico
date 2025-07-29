import { NextRequest, NextResponse } from 'next/server'
import { validateProductStock } from '@/lib/stock'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: 'Items requeridos como array' },
        { status: 400 }
      )
    }

    // Validar formato de items
    for (const item of body.items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Cada item debe tener productId y quantity válidos' },
          { status: 400 }
        )
      }
    }

    const validation = await validateProductStock(body.items)

    return NextResponse.json({
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings
    })

  } catch (error) {
    console.error('Error validando stock:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 