import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { adjustProductStock } from '@/lib/stock-history'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const adjustStockSchema = z.object({
  productId: z.string().min(1, 'ID del producto requerido'),
  newStock: z.number().int().min(0, 'El stock no puede ser negativo'),
  reason: z.string().min(1, 'Motivo requerido')
})

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar si es admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true }
    })

    if (!user?.email?.endsWith('@rincondiabetico.cl')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = adjustStockSchema.parse(body)

    const result = await adjustProductStock(
      validatedData.productId,
      validatedData.newStock,
      validatedData.reason,
      user.id
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Error al ajustar stock' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Stock ajustado correctamente',
      movement: result.movement
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error in adjust stock API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}