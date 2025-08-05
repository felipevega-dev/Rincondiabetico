import { notFound } from 'next/navigation'
import { BannerForm } from '@/components/admin/banner-form'
import { prisma } from '@/lib/prisma'

type EditBannerPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params
  const banner = await prisma.banner.findUnique({
    where: { id: id }
  })

  if (!banner) {
    notFound()
  }

  return <BannerForm banner={banner} isEditing />
} 