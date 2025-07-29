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
    const period = searchParams.get('period') || '30'
    
    // Calcular fecha de inicio
    const daysAgo = parseInt(period)
    const since = new Date()
    since.setDate(since.getDate() - daysAgo)

    // 1. Estadísticas generales de clientes
    const totalCustomers = await prisma.user.count()
    const activeCustomers = await prisma.user.count({
      where: {
        orders: {
          some: {
            createdAt: { gte: since },
            status: { in: ['PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO'] }
          }
        }
      }
    })

    const newCustomers = await prisma.user.count({
      where: {
        createdAt: { gte: since }
      }
    })

    // 2. Análisis de segmentación de clientes
    const customerSegmentation = await prisma.$queryRaw`
      WITH customer_stats AS (
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.created_at,
          COUNT(o.id) as order_count,
          COALESCE(SUM(o.total), 0) as total_spent,
          MAX(o.created_at) as last_order_date,
          MIN(o.created_at) as first_order_date
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id 
          AND o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.created_at
      )
      SELECT 
        CASE 
          WHEN total_spent = 0 THEN 'No comprador'
          WHEN total_spent < 10000 THEN 'Bajo valor'
          WHEN total_spent < 50000 THEN 'Medio valor'
          WHEN total_spent < 100000 THEN 'Alto valor'
          ELSE 'VIP'
        END as segment,
        COUNT(*)::int as customers,
        COALESCE(AVG(total_spent), 0)::int as avg_spent,
        COALESCE(AVG(order_count), 0)::float as avg_orders
      FROM customer_stats
      GROUP BY segment
      ORDER BY 
        CASE segment
          WHEN 'VIP' THEN 1
          WHEN 'Alto valor' THEN 2
          WHEN 'Medio valor' THEN 3
          WHEN 'Bajo valor' THEN 4
          ELSE 5
        END
    `

    // 3. Top clientes por valor
    const topCustomers = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.created_at,
        COUNT(o.id)::int as order_count,
        COALESCE(SUM(o.total), 0)::int as total_spent,
        COALESCE(AVG(o.total), 0)::int as avg_order_value,
        MAX(o.created_at) as last_order_date
      FROM users u
      JOIN orders o ON o.user_id = u.id 
        AND o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
      GROUP BY u.id, u.first_name, u.last_name, u.email, u.created_at
      HAVING SUM(o.total) > 0
      ORDER BY total_spent DESC
      LIMIT 20
    `

    // 4. Análisis de retención (customers que han vuelto a comprar)
    const retentionAnalysis = await prisma.$queryRaw`
      WITH customer_orders AS (
        SELECT 
          user_id,
          COUNT(*) as order_count,
          MIN(created_at) as first_order,
          MAX(created_at) as last_order,
          EXTRACT(DAYS FROM MAX(created_at) - MIN(created_at)) as days_between_first_last
        FROM orders 
        WHERE status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
        GROUP BY user_id
        HAVING COUNT(*) > 1
      )
      SELECT 
        CASE 
          WHEN days_between_first_last <= 7 THEN 'Dentro de 1 semana'
          WHEN days_between_first_last <= 30 THEN 'Dentro de 1 mes'
          WHEN days_between_first_last <= 90 THEN 'Dentro de 3 meses'
          ELSE 'Más de 3 meses'
        END as retention_period,
        COUNT(*)::int as customers,
        AVG(order_count)::float as avg_orders
      FROM customer_orders
      GROUP BY retention_period
      ORDER BY 
        CASE retention_period
          WHEN 'Dentro de 1 semana' THEN 1
          WHEN 'Dentro de 1 mes' THEN 2
          WHEN 'Dentro de 3 meses' THEN 3
          ELSE 4
        END
    `

    // 5. Nuevos clientes vs clientes recurrentes (últimos 30 días)
    const customerType = await prisma.$queryRaw`
      WITH customer_orders AS (
        SELECT 
          o.user_id,
          COUNT(*) as order_count,
          MIN(o.created_at) as first_order,
          SUM(o.total) as total_spent
        FROM orders o
        WHERE o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
          AND o.created_at >= ${since}
        GROUP BY o.user_id
      )
      SELECT 
        CASE 
          WHEN first_order >= ${since} THEN 'Nuevo'
          ELSE 'Recurrente'
        END as customer_type,
        COUNT(*)::int as customers,
        SUM(total_spent)::int as revenue,
        AVG(total_spent)::int as avg_spent
      FROM customer_orders
      GROUP BY customer_type
    `

    // 6. Análisis geográfico (por región/ciudad)
    const geographicAnalysis = await prisma.$queryRaw`
      SELECT 
        COALESCE(u.region, 'Sin especificar') as region,
        COALESCE(u.city, 'Sin especificar') as city,
        COUNT(DISTINCT u.id)::int as customers,
        COUNT(o.id)::int as orders,
        COALESCE(SUM(o.total), 0)::int as revenue
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id 
        AND o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
        AND o.created_at >= ${since}
      GROUP BY u.region, u.city
      HAVING COUNT(DISTINCT u.id) > 0
      ORDER BY revenue DESC
      LIMIT 20
    `

    // 7. Clientes inactivos (hace más de 60 días sin comprar)
    const inactiveCustomers = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(o.id)::int as total_orders,
        SUM(o.total)::int as total_spent,
        MAX(o.created_at) as last_order_date,
        EXTRACT(DAYS FROM NOW() - MAX(o.created_at))::int as days_since_last_order
      FROM users u
      JOIN orders o ON o.user_id = u.id 
        AND o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
      GROUP BY u.id, u.first_name, u.last_name, u.email
      HAVING MAX(o.created_at) < NOW() - INTERVAL '60 days'
      ORDER BY total_spent DESC, last_order_date DESC
      LIMIT 50
    `

    // 8. Análisis de engagement - clientes con wishlist activo
    const wishlistAnalysis = await prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT wi.user_id)::int as customers_with_wishlist,
        COUNT(wi.id)::int as total_wishlist_items,
        AVG(user_items.item_count)::float as avg_items_per_user
      FROM wishlist_items wi
      JOIN (
        SELECT user_id, COUNT(*) as item_count
        FROM wishlist_items
        GROUP BY user_id
      ) user_items ON user_items.user_id = wi.user_id
    `

    const analytics = {
      summary: {
        totalCustomers,
        activeCustomers,
        newCustomers,
        retentionRate: totalCustomers > 0 ? (activeCustomers / totalCustomers * 100) : 0
      },
      customerSegmentation,
      topCustomers,
      retentionAnalysis,
      customerType,
      geographicAnalysis,
      inactiveCustomers,
      wishlistAnalysis: (wishlistAnalysis as any)[0] || {
        customers_with_wishlist: 0,
        total_wishlist_items: 0,
        avg_items_per_user: 0
      },
      period: parseInt(period)
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching customer analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}