import { NextRequest, NextResponse } from 'next/server'
import { getAvailableStock, hasAvailableStock } from '@/lib/stock-reservation'

// GET - Obtener stock disponible
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const quantity = searchParams.get('quantity')
    
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID es requerido' 
      }, { status: 400 })
    }
    
    if (quantity) {
      // Verificar si hay suficiente stock para una cantidad específica
      const quantityNum = parseInt(quantity)
      if (isNaN(quantityNum) || quantityNum <= 0) {
        return NextResponse.json({ 
          error: 'Cantidad inválida' 
        }, { status: 400 })
      }
      
      const hasStock = await hasAvailableStock(productId, quantityNum)
      return NextResponse.json({ 
        productId,
        requestedQuantity: quantityNum,
        available: hasStock
      })
    } else {
      // Obtener cantidad disponible
      const availableStock = await getAvailableStock(productId)
      return NextResponse.json({ 
        productId,
        availableStock
      })
    }
  } catch (error) {
    console.error('Error checking available stock:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}