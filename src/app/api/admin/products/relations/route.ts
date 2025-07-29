import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { addProductRelation } from '@/lib/recommendations'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addRelationSchema = z.object({
  sourceProductId: z.string().min(1, 'ID del producto fuente requerido'),
  relatedProductId: z.string().min(1, 'ID del producto relacionado requerido'),
  type: z.string().default('RELATED'),
  order: z.number().default(0)
})

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const validatedData = addRelationSchema.parse(body)

    const result = await addProductRelation(
      validatedData.sourceProductId,
      validatedData.relatedProductId,
      validatedData.type,
      validatedData.order
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Error al agregar relación' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Relación agregada correctamente' })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error adding product relation:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}