import { Suspense } from 'react'
import { ProductsGrid } from '@/components/client/products-grid'
import { AdvancedFilters } from '@/components/client/advanced-filters'
import { prisma } from '@/lib/prisma'

export default async function ProductsPage() {
  // Obtener categorías para los filtros
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nuestros Productos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra deliciosa variedad de postres artesanales, 
            hechos con amor y los mejores ingredientes.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtros */}
          <div className="lg:w-80">
            <AdvancedFilters categories={categories} />
          </div>

          {/* Main Content - Products Grid */}
          <div className="flex-1">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            }>
              <ProductsGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
} 