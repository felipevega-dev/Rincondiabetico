import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
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

    await prisma.productRelation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Relación eliminada correctamente' })

  } catch (error) {
    console.error('Error deleting product relation:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}