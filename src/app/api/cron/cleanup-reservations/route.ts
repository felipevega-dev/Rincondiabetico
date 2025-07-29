import { NextRequest, NextResponse } from 'next/server'
import { cleanupExpiredReservations } from '@/lib/stock-reservation'

// GET - Limpiar reservas expiradas (llamado por cron)
export async function GET(request: NextRequest) {
  try {
    // Verificar si es una llamada de cron (opcional: agregar auth token)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const deletedCount = await cleanupExpiredReservations()
    
    return NextResponse.json({ 
      success: true,
      deletedReservations: deletedCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in cleanup cron job:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}