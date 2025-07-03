import { NextRequest, NextResponse } from 'next/server'
import { getProductStock } from '@/lib/stock'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    if (!productId) {
      return NextResponse.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      )
    }

    const stockInfo = await getProductStock(productId)

    if (!stockInfo) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      productId: stockInfo.productId,
      stock: stockInfo.currentStock,
      isAvailable: stockInfo.isAvailable,
      name: stockInfo.name
    })

  } catch (error) {
    console.error('Error obteniendo stock del producto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 