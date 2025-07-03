import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  User, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  Settings,
  Bell
} from 'lucide-react'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in?redirect_url=/cuenta')
  }

  const tabs = [
    {
      value: 'perfil',
      label: 'Mi Perfil',
      icon: User,
      href: '/cuenta'
    },
    {
      value: 'pedidos',
      label: 'Mis Pedidos',
      icon: ShoppingBag,
      href: '/cuenta/pedidos'
    },
    {
      value: 'direcciones',
      label: 'Mis Direcciones',
      icon: MapPin,
      href: '/cuenta/direcciones'
    },
    {
      value: 'pagos',
      label: 'Métodos de Pago',
      icon: CreditCard,
      href: '/cuenta/pagos'
    },
    {
      value: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      href: '/cuenta/notificaciones'
    },
    {
      value: 'ajustes',
      label: 'Ajustes',
      icon: Settings,
      href: '/cuenta/ajustes'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mi Cuenta
            </h1>
            <p className="text-lg text-gray-600">
              Gestiona tu perfil y preferencias
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-1 mb-8">
            <Tabs defaultValue="perfil" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Link key={tab.value} href={tab.href} className="w-full">
                      <TabsTrigger 
                        value={tab.value}
                        className="w-full data-[state=active]:bg-primary-100 data-[state=active]:text-primary-900"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="hidden md:inline">{tab.label}</span>
                        </div>
                      </TabsTrigger>
                    </Link>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 