import { notFound } from 'next/navigation'
import { BannerForm } from '@/components/admin/banner-form'
import { prisma } from '@/lib/prisma'

type EditBannerPageProps = {
  params: {
    id: string
  }
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const banner = await prisma.banner.findUnique({
    where: { id: params.id }
  })

  if (!banner) {
    notFound()
  }

  return <BannerForm banner={banner} isEditing />
} 