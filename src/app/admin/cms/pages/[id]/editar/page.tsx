import { notFound } from 'next/navigation'
import { PageForm } from '@/components/admin/page-form'
import { prisma } from '@/lib/prisma'

type EditPagePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditPagePage({ params }: EditPagePageProps) {
  const { id } = await params
  const page = await prisma.page.findUnique({
    where: { id: id }
  })

  if (!page) {
    notFound()
  }

  return <PageForm page={page} isEditing />
} 