import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/lib/auth'
import { ProfileForm } from '@/components/client/profile-form'

export default async function ProfilePage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await getOrCreateUser()
  
  if (!dbUser) {
    redirect('/sign-in')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileForm user={dbUser} />
    </div>
  )
} 