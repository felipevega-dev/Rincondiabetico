import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { isAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = {
  title: 'Nuevo Producto - Admin - Postres Pasmiño',
  description: 'Crear un nuevo producto para la tienda.',
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

export default async function NewProductPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const userIsAdmin = await isAdmin()
  
  if (!userIsAdmin) {
    redirect('/')
  }

  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  )
} 