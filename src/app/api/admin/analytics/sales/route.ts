import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user || user.publicMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // días
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Calcular rango de fechas
    let dateFilter: any = {}
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    } else {
      const daysAgo = parseInt(period)
      const since = new Date()
      since.setDate(since.getDate() - daysAgo)
      
      dateFilter = {
        createdAt: {
          gte: since
        }
      }
    }

    // 1. Resumen general de ventas
    const totalSales = await prisma.order.aggregate({
      where: {
        status: { in: ['PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO'] },
        ...dateFilter
      },
      _sum: { total: true },
      _count: { id: true }
    })

    // 2. Órdenes por estado
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { id: true },
      _sum: { total: true }
    })

    // 3. Ventas por día (últimos 30 días)
    const dailySales = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*)::int as orders,
        SUM(total)::int as revenue
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '30 days'
        AND status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `

    // 4. Productos más vendidos
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: { in: ['PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO'] },
          ...dateFilter
        }
      },
      _sum: { quantity: true, price: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    })

    // Obtener información de productos
    const productIds = topProducts.map(p => p.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, images: true }
    })

    const topProductsWithDetails = topProducts.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        product,
        quantity: item._sum.quantity || 0,
        revenue: item._sum.price || 0,
        orders: item._count.id
      }
    })

    // 5. Categorías más vendidas
    const topCategories = await prisma.$queryRaw`
      SELECT 
        c.name,
        c.id,
        COUNT(oi.id)::int as orders,
        SUM(oi.quantity)::int as quantity,
        SUM(oi.price * oi.quantity)::int as revenue
      FROM categories c
      JOIN products p ON p.category_id = c.id
      JOIN order_items oi ON oi.product_id = p.id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
        AND o.created_at >= ${dateFilter.createdAt?.gte || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
      LIMIT 10
    `

    // 6. Métodos de pago
    const paymentMethods = await prisma.order.groupBy({
      by: ['paymentMethod'],
      where: {
        status: { in: ['PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO'] },
        ...dateFilter
      },
      _count: { id: true },
      _sum: { total: true }
    })

    // 7. Clientes nuevos vs recurrentes
    const customerAnalysis = await prisma.$queryRaw`
      WITH customer_orders AS (
        SELECT 
          user_id,
          COUNT(*) as order_count,
          MIN(created_at) as first_order,
          MAX(created_at) as last_order,
          SUM(total) as total_spent
        FROM orders 
        WHERE status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
          AND created_at >= ${dateFilter.createdAt?.gte || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        GROUP BY user_id
      )
      SELECT 
        CASE 
          WHEN order_count = 1 THEN 'new'
          ELSE 'returning'
        END as customer_type,
        COUNT(*)::int as customers,
        SUM(total_spent)::int as revenue
      FROM customer_orders
      GROUP BY customer_type
    `

    // 8. Horarios de mayor actividad
    const hourlyActivity = await prisma.$queryRaw`
      SELECT 
        EXTRACT(HOUR FROM created_at)::int as hour,
        COUNT(*)::int as orders,
        SUM(total)::int as revenue
      FROM orders 
      WHERE created_at >= ${dateFilter.createdAt?.gte || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        AND status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `

    // 9. Cálculo de período anterior para comparación
    const previousPeriod = new Date(dateFilter.createdAt?.gte || new Date())
    if (startDate && endDate) {
      const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      previousPeriod.setDate(previousPeriod.getDate() - daysDiff)
    } else {
      previousPeriod.setDate(previousPeriod.getDate() - parseInt(period))
    }

    const previousSales = await prisma.order.aggregate({
      where: {
        status: { in: ['PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO'] },
        createdAt: {
          gte: previousPeriod,
          lt: dateFilter.createdAt?.gte || new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000)
        }
      },
      _sum: { total: true },
      _count: { id: true }
    })

    // Calcular porcentajes de cambio
    const revenueChange = previousSales._sum.total 
      ? ((totalSales._sum.total || 0) - (previousSales._sum.total || 0)) / (previousSales._sum.total || 1) * 100
      : 0

    const orderCountChange = previousSales._count.id 
      ? ((totalSales._count.id || 0) - (previousSales._count.id || 0)) / (previousSales._count.id || 1) * 100
      : 0

    const analytics = {
      summary: {
        totalRevenue: totalSales._sum.total || 0,
        totalOrders: totalSales._count.id || 0,
        averageOrderValue: totalSales._count.id ? (totalSales._sum.total || 0) / totalSales._count.id : 0,
        revenueChange,
        orderCountChange
      },
      ordersByStatus,
      dailySales,
      topProducts: topProductsWithDetails,
      topCategories,
      paymentMethods,
      customerAnalysis,
      hourlyActivity,
      period: parseInt(period),
      dateRange: {
        start: dateFilter.createdAt?.gte || new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000),
        end: dateFilter.createdAt?.lte || new Date()
      }
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching sales analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}