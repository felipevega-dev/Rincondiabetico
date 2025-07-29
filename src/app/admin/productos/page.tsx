import { Suspense } from 'react'
import { ProductsTable } from '@/components/admin/products-table'
import { ProductForm } from '@/components/admin/product-form'

async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function AdminProductsPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">
            Administra el catálogo de productos de la tienda
          </p>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Agregar Nuevo Producto</h2>
        </div>
        <div className="p-6">
          <ProductForm 
            categories={categories} 
            embedded={true}
            showHeader={false}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Lista de Productos</h2>
        </div>
        <Suspense fallback={
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        }>
          <ProductsTable />
        </Suspense>
      </div>
    </div>
  )
} 