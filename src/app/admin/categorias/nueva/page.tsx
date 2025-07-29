import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CategoryForm } from '@/components/admin/category-form'

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/categorias">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Categoría</h1>
          <p className="text-gray-600">Crea una nueva categoría para organizar tus productos</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <CategoryForm />
      </div>
    </div>
  )
} 