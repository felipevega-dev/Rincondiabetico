import { notFound } from 'next/navigation'
import { PageForm } from '@/components/admin/page-form'
import { prisma } from '@/lib/prisma'

type EditPagePageProps = {
  params: {
    id: string
  }
}

export default async function EditPagePage({ params }: EditPagePageProps) {
  const page = await prisma.page.findUnique({
    where: { id: params.id }
  })

  if (!page) {
    notFound()
  }

  return <PageForm page={page} isEditing />
} 