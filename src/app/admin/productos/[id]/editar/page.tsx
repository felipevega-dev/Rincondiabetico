import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'
import { StockHistory } from '@/components/admin/stock-history'
import { ProductRelations } from '@/components/admin/product-relations'

interface EditProductPageProps {
  params: { id: string }
}

export const metadata: Metadata = {
  title: 'Editar Producto - Admin - Postres Pasmiño',
  description: 'Editar información y stock del producto.',
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variations: {
          orderBy: { order: 'asc' }
        }
      }
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const userIsAdmin = await isAdmin()
  
  if (!userIsAdmin) {
    redirect('/')
  }

  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories()
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Producto
          </h1>
          <p className="text-gray-600">
            Actualiza la información, stock y disponibilidad del producto
          </p>
        </div>

        <div className="space-y-8">
          {/* Formulario de edición */}
          <ProductForm 
            product={product}
            categories={categories}
            isEditing={true}
            embedded={true}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Historial de stock */}
            <div>
              <StockHistory 
                productId={product.id}
                productName={product.name}
              />
            </div>

            {/* Productos relacionados */}
            <div>
              <ProductRelations 
                productId={product.id}
                productName={product.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 