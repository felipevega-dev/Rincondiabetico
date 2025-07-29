import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
// Removed unused imports
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  const userIsAdmin = await isAdmin()

  if (!user) {
    redirect('/sign-in')
  }

  if (!userIsAdmin) {
    redirect('/dashboard')
  }

  // Extract only needed user data for Client Component
  const userData = {
    firstName: user.firstName,
    emailAddresses: user.emailAddresses.map(email => ({
      emailAddress: email.emailAddress
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar user={userData} />

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 