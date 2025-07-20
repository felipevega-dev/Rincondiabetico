import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in?redirect_url=/cuenta')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
} 