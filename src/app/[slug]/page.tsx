import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

type PageProps = {
  params: {
    slug: string
  }
}

// Generar metadata dinámicamente
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: { 
      slug: params.slug,
      isActive: true 
    }
  })

  if (!page) {
    return {
      title: 'Página no encontrada - Postres Pasmiño'
    }
  }

  return {
    title: page.metaTitle || `${page.title} - Postres Pasmiño`,
    description: page.metaDescription || page.excerpt || page.title,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt || page.title,
      type: 'article',
    }
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await prisma.page.findUnique({
    where: { 
      slug: params.slug,
      isActive: true 
    }
  })

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-cream-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent mb-6">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {page.excerpt}
            </p>
          )}
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-lg border border-border p-8 lg:p-12">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:hover:text-primary-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>

        {/* Footer de página */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Última actualización: {new Date(page.updatedAt).toLocaleDateString('es-CL')}</p>
        </div>
      </div>
    </div>
  )
}

// Generar rutas estáticas para páginas activas
export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { isActive: true },
    select: { slug: true }
  })

  return pages.map((page) => ({
    slug: page.slug
  }))
} 