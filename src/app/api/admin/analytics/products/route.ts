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

    // 1. Performance de productos
    const productPerformance = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        p.images[1] as image,
        c.name as category_name,
        COALESCE(SUM(oi.quantity), 0)::int as total_sold,
        COALESCE(COUNT(DISTINCT o.id), 0)::int as orders_count,
        COALESCE(SUM(oi.price * oi.quantity), 0)::int as revenue,
        COALESCE(AVG(oi.quantity), 0)::float as avg_quantity_per_order
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id 
        AND o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
        AND o.created_at >= ${since}
      WHERE p.is_active = true
      GROUP BY p.id, p.name, p.price, p.stock, p.images, c.name
      ORDER BY total_sold DESC
    `

    // 2. Productos con bajo stock
    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { stock: { lte: prisma.$queryRaw`COALESCE(min_stock, 5)` } },
          { stock: 0 }
        ]
      },
      include: {
        category: true
      },
      orderBy: [
        { stock: 'asc' },
        { name: 'asc' }
      ],
      take: 20
    })

    // 3. Productos nunca vendidos
    const neverSoldProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        orderItems: {
          none: {}
        }
      },
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // 4. Análisis de stock movement
    const stockMovements = await prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: since
        }
      },
      include: {
        product: {
          select: { name: true, images: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // 5. Stock value analysis
    const stockValue = await prisma.product.aggregate({
      where: {
        isActive: true
      },
      _sum: {
        stock: true
      }
    })

    const totalStockValue = await prisma.$queryRaw`
      SELECT SUM(stock * price)::int as total_value
      FROM products
      WHERE is_active = true
    `

    // 6. Categorías performance
    const categoryPerformance = await prisma.$queryRaw`
      SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT p.id)::int as products_count,
        COALESCE(SUM(oi.quantity), 0)::int as total_sold,
        COALESCE(SUM(oi.price * oi.quantity), 0)::int as revenue,
        COALESCE(AVG(p.stock), 0)::float as avg_stock
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id 
        AND o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
        AND o.created_at >= ${since}
      WHERE c.is_active = true
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `

    // 7. Trends analysis - productos que están ganando/perdiendo popularidad
    const trendAnalysis = await prisma.$queryRaw`
      WITH recent_sales AS (
        SELECT 
          p.id,
          p.name,
          SUM(oi.quantity) as recent_quantity
        FROM products p
        JOIN order_items oi ON oi.product_id = p.id
        JOIN orders o ON o.id = oi.order_id
        WHERE o.created_at >= ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
          AND o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
        GROUP BY p.id, p.name
      ),
      previous_sales AS (
        SELECT 
          p.id,
          p.name,
          SUM(oi.quantity) as previous_quantity
        FROM products p
        JOIN order_items oi ON oi.product_id = p.id
        JOIN orders o ON o.id = oi.order_id
        WHERE o.created_at >= ${new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)}
          AND o.created_at < ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
          AND o.status IN ('PAGADO', 'PREPARANDO', 'LISTO', 'RETIRADO')
        GROUP BY p.id, p.name
      )
      SELECT 
        p.id,
        p.name,
        p.images[1] as image,
        COALESCE(r.recent_quantity, 0)::int as recent_sales,
        COALESCE(pr.previous_quantity, 0)::int as previous_sales,
        CASE 
          WHEN pr.previous_quantity > 0 THEN 
            ((r.recent_quantity::float - pr.previous_quantity::float) / pr.previous_quantity::float * 100)
          ELSE 0
        END::float as trend_percentage
      FROM products p
      LEFT JOIN recent_sales r ON r.id = p.id
      LEFT JOIN previous_sales pr ON pr.id = p.id
      WHERE p.is_active = true
        AND (r.recent_quantity > 0 OR pr.previous_quantity > 0)
      ORDER BY trend_percentage DESC
      LIMIT 20
    `

    const analytics = {
      productPerformance,
      lowStockProducts,
      neverSoldProducts,
      stockMovements,
      stockValue: {
        totalUnits: stockValue._sum.stock || 0,
        totalValue: (totalStockValue as any)[0]?.total_value || 0
      },
      categoryPerformance,
      trendAnalysis,
      period: parseInt(period)
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching product analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}