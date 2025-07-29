'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Home, 
  Monitor,
  Image,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  Store,
  PackageSearch,
  TrendingUp,
  Tag
} from 'lucide-react'

type User = {
  firstName?: string | null
  emailAddresses: { emailAddress: string }[]
}

type AdminSidebarProps = {
  user: User
}

type NavigationSection = {
  name: string
  icon: any
  items: {
    name: string
    href: string
    icon: any
  }[]
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['CMS', 'Gestión'])

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    )
  }

  const navigationSections: NavigationSection[] = [
    {
      name: 'CMS',
      icon: Monitor,
      items: [
        { name: 'Banners', href: '/admin/cms/banners', icon: Image },
        { name: 'Páginas', href: '/admin/cms/pages', icon: FileText },
        { name: 'Configuración', href: '/admin/cms/settings', icon: Store },
      ]
    },
    {
      name: 'Gestión',
      icon: Settings,
      items: [
        { name: 'Productos', href: '/admin/productos', icon: Package },
        { name: 'Categorías', href: '/admin/categorias', icon: FolderOpen },
        { name: 'Stock', href: '/admin/stock', icon: PackageSearch },
        { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart },
        { name: 'Cupones', href: '/admin/coupons', icon: Tag },
        { name: 'Clientes', href: '/admin/clientes', icon: Users },
        { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
      ]
    }
  ]

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const isSectionActive = (items: { href: string }[]) => {
    return items.some(item => isActiveLink(item.href))
  }

  return (
    <div className="w-64 bg-white shadow-lg flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-14 px-6 border-b">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">Panel Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          {/* Dashboard */}
          <div className="mb-4">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActiveLink('/admin') && pathname === '/admin'
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {navigationSections.map((section) => {
              const SectionIcon = section.icon
              const isExpanded = expandedSections.includes(section.name)
              const hasActiveItem = isSectionActive(section.items)

              return (
                <div key={section.name}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      hasActiveItem
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SectionIcon className="h-5 w-5" />
                      <span className="font-medium">{section.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {/* Section Items */}
                  {isExpanded && (
                    <div className="mt-2 ml-6 space-y-1">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActiveLink(item.href)
                                ? 'bg-primary-100 text-primary-800 font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <ItemIcon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Volver a la tienda */}
          <div className="mt-6 pt-4 border-t">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Home className="h-5 w-5" />
              Volver a la tienda
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName || user.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 