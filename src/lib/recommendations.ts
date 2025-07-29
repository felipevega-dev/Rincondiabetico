import { prisma } from '@/lib/prisma'

export interface ProductRecommendation {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category: {
    id: string
    name: string
  }
  isAvailable: boolean
  stock: number
}

export interface RecommendationResult {
  success: boolean
  products: ProductRecommendation[]
  message?: string
}

/**
 * Obtiene productos relacionados para un producto específico
 */
export async function getRelatedProducts(productId: string, limit = 4): Promise<RecommendationResult> {
  try {
    // Primero buscar relaciones manuales definidas por el admin
    const manualRelations = await prisma.productRelation.findMany({
      where: { sourceProductId: productId },
      include: {
        relatedProduct: {
          include: {
            category: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { order: 'asc' },
      take: limit
    })

    let relatedProducts = manualRelations
      .filter(relation => relation.relatedProduct.isActive && relation.relatedProduct.isAvailable)
      .map(relation => ({
        id: relation.relatedProduct.id,
        name: relation.relatedProduct.name,
        slug: relation.relatedProduct.slug,
        price: relation.relatedProduct.price,
        images: relation.relatedProduct.images,
        category: relation.relatedProduct.category,
        isAvailable: relation.relatedProduct.isAvailable,
        stock: relation.relatedProduct.stock
      }))

    // Si no hay suficientes productos relacionados manualmente, llenar con automáticos
    if (relatedProducts.length < limit) {
      const remainingSlots = limit - relatedProducts.length
      const excludeIds = [productId, ...relatedProducts.map(p => p.id)]

      const automaticProducts = await getAutomaticRecommendations(productId, excludeIds, remainingSlots)
      relatedProducts = [...relatedProducts, ...automaticProducts]
    }

    return {
      success: true,
      products: relatedProducts.slice(0, limit)
    }
  } catch (error) {
    console.error('Error getting related products:', error)
    return {
      success: false,
      products: [],
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Genera recomendaciones automáticas basadas en categoría y popularidad
 */
async function getAutomaticRecommendations(
  productId: string, 
  excludeIds: string[], 
  limit: number
): Promise<ProductRecommendation[]> {
  try {
    // Obtener el producto actual para conocer su categoría
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true }
    })

    if (!currentProduct) return []

    // Buscar productos de la misma categoría
    const categoryProducts = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        id: { notIn: excludeIds },
        isActive: true,
        isAvailable: true
      },
      include: {
        category: {
          select: { id: true, name: true }
        },
        orderItems: {
          select: { quantity: true }
        }
      },
      take: limit * 2 // Obtener más para poder ordenar por popularidad
    })

    // Calcular popularidad (total de items vendidos)
    const productsWithPopularity = categoryProducts.map(product => {
      const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      return {
        ...product,
        popularity: totalSold
      }
    })

    // Ordenar por popularidad (descendente) y luego por fecha de creación (reciente primero)
    const sortedProducts = productsWithPopularity
      .sort((a, b) => {
        if (b.popularity !== a.popularity) {
          return b.popularity - a.popularity
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, limit)

    return sortedProducts.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: product.images,
      category: product.category,
      isAvailable: product.isAvailable,
      stock: product.stock
    }))
  } catch (error) {
    console.error('Error getting automatic recommendations:', error)
    return []
  }
}

/**
 * Obtiene los productos más vendidos (para recomendaciones generales)
 */
export async function getPopularProducts(limit = 8): Promise<RecommendationResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isAvailable: true
      },
      include: {
        category: {
          select: { id: true, name: true }
        },
        orderItems: {
          select: { quantity: true }
        }
      }
    })

    // Calcular popularidad y ordenar
    const productsWithPopularity = products.map(product => {
      const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images,
        category: product.category,
        isAvailable: product.isAvailable,
        stock: product.stock,
        popularity: totalSold
      }
    })

    const sortedProducts = productsWithPopularity
      .sort((a, b) => {
        if (b.popularity !== a.popularity) {
          return b.popularity - a.popularity
        }
        // Si tienen la misma popularidad, ordenar por fecha (más recientes primero)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, limit)

    return {
      success: true,
      products: sortedProducts
    }
  } catch (error) {
    console.error('Error getting popular products:', error)
    return {
      success: false,
      products: [],
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Agrega una relación manual entre productos (para admin)
 */
export async function addProductRelation(
  sourceProductId: string,
  relatedProductId: string,
  type: string = 'RELATED',
  order: number = 0
): Promise<{ success: boolean; message?: string }> {
  try {
    // Verificar que ambos productos existen
    const [sourceProduct, relatedProduct] = await Promise.all([
      prisma.product.findUnique({ where: { id: sourceProductId } }),
      prisma.product.findUnique({ where: { id: relatedProductId } })
    ])

    if (!sourceProduct || !relatedProduct) {
      return {
        success: false,
        message: 'Uno o ambos productos no existen'
      }
    }

    if (sourceProductId === relatedProductId) {
      return {
        success: false,
        message: 'Un producto no puede estar relacionado consigo mismo'
      }
    }

    // Crear la relación
    await prisma.productRelation.create({
      data: {
        sourceProductId,
        relatedProductId,
        type,
        order
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error adding product relation:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Elimina una relación entre productos
 */
export async function removeProductRelation(
  sourceProductId: string,
  relatedProductId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    await prisma.productRelation.delete({
      where: {
        sourceProductId_relatedProductId: {
          sourceProductId,
          relatedProductId
        }
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error removing product relation:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}