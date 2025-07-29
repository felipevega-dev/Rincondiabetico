import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getStockMovementStats } from '@/lib/stock-history'

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si es admin
    const user = await prisma?.user.findUnique({
      where: { clerkId: userId },
      select: { email: true }
    })

    if (!user?.email?.endsWith('@rincondiabetico.cl')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')

    const result = await getStockMovementStats(days)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Error al obtener estadísticas' },
        { status: 500 }
      )
    }

    return NextResponse.json(result.stats)

  } catch (error) {
    console.error('Error in stock history API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}