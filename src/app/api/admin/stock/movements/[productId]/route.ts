import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProductStockHistory } from '@/lib/stock-history'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si es admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { email: true }
    })

    if (!user?.email?.endsWith('@rincondiabetico.cl')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const result = await getProductStockHistory(productId, limit)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Error al obtener historial' },
        { status: 500 }
      )
    }

    return NextResponse.json({ movements: result.movements })

  } catch (error) {
    console.error('Error in product stock history API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}