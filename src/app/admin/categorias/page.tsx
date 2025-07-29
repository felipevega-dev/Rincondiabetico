import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CategoriesTable } from '@/components/admin/categories-table'

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600">Gestiona las categorías de productos</p>
        </div>
        <Link href="/admin/categorias/nueva">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </Button>
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow">
        <Suspense fallback={
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando categorías...</p>
          </div>
        }>
          <CategoriesTable />
        </Suspense>
      </div>
    </div>
  )
} 