import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getLowStockProducts } from '@/lib/stock'
import { notifyLowStock } from '@/lib/notification-system'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener threshold de la query string (default: 5)
    const url = new URL(request.url)
    const threshold = parseInt(url.searchParams.get('threshold') || '5')

    const products = await getLowStockProducts(threshold)
    
    // Enviar notificación si hay productos críticos (stock 0 o ≤ 2)
    const criticalProducts = products.filter(p => p.currentStock <= 2)
    if (criticalProducts.length > 0) {
      try {
        await notifyLowStock(criticalProducts.map(p => ({
          name: p.name,
          stock: p.currentStock,
          category: 'General' // TODO: agregar categoría real
        })))
        
        console.log(`Notificación de stock bajo enviada para ${criticalProducts.length} productos`)
      } catch (notificationError) {
        console.error('Error enviando notificación de stock bajo:', notificationError)
      }
    }

    return NextResponse.json({
      products: products.map(product => ({
        id: product.productId,
        name: product.name,
        stock: product.currentStock,
        isAvailable: product.isAvailable
      })),
      threshold,
      total: products.length,
      critical: products.filter(p => p.currentStock === 0).length,
      warning: products.filter(p => p.currentStock > 0 && p.currentStock <= 2).length,
      low: products.filter(p => p.currentStock > 2 && p.currentStock <= threshold).length
    })

  } catch (error) {
    console.error('Error obteniendo productos con stock bajo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 