import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const relations = await prisma.productRelation.findMany({
      where: { sourceProductId: params.id },
      include: {
        relatedProduct: {
          include: {
            category: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ relations })

  } catch (error) {
    console.error('Error fetching product relations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}