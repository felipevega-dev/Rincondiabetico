import { NextRequest, NextResponse } from 'next/server'
import { getRelatedProducts } from '@/lib/recommendations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4')

    const result = await getRelatedProducts(params.id, limit)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Error al obtener productos relacionados' },
        { status: 500 }
      )
    }

    return NextResponse.json({ products: result.products })

  } catch (error) {
    console.error('Error in related products API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}