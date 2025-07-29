import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { cleanupAbandonedOrders, getCleanupStats } from '@/lib/order-cleanup'

// GET: Obtener estadísticas de limpieza
export async function GET() {
  try {
    // Verificar que el usuario sea admin
    const userIsAdmin = await isAdmin()
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const stats = await getCleanupStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error obteniendo estadísticas de limpieza:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST: Ejecutar limpieza manual
export async function POST() {
  try {
    // Verificar que el usuario sea admin
    const userIsAdmin = await isAdmin()
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const result = await cleanupAbandonedOrders()
    
    return NextResponse.json({
      success: true,
      message: 'Limpieza ejecutada exitosamente',
      data: result
    })
  } catch (error) {
    console.error('Error ejecutando limpieza:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}