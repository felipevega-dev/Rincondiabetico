'use client'

import { useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { ProfileForm } from '@/components/client/profile-form'
import { OrdersList } from '@/components/client/orders-list'
import { LoyaltyDashboard } from '@/components/client/loyalty-dashboard'
import { useWishlist } from '@/hooks/use-wishlist'
import { useCart } from '@/components/providers/cart-provider'
import { WishlistButton } from '@/components/client/wishlist-button'
import { AddToCartButton } from '@/components/client/add-to-cart-button'
import { User, Package2, Heart, LogOut, ShoppingBag, Package, Bell, Shield, Trash2, Tag, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AccountPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { items: wishlistItems, isLoading: wishlistLoading } = useWishlist()
  const { items: cartItems, clearCart } = useCart()
  const [activeTab, setActiveTab] = useState('profile')
  const [dbUser, setDbUser] = useState(null)
  const [notificationSettings, setNotificationSettings] = useState({
    notifyEmail: true,
    notifyWhatsapp: true
  })
  const [userCoupons, setUserCoupons] = useState([])
  const [couponsLoading, setCouponsLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const userData = await response.json()
          setDbUser(userData)
          setNotificationSettings({
            notifyEmail: userData.notifyEmail ?? true,
            notifyWhatsapp: userData.notifyWhatsapp ?? true
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    if (user) {
      fetchUser()
    }
  }, [user])

  const fetchUserCoupons = async () => {
    setCouponsLoading(true)
    try {
      const response = await fetch('/api/user/coupons')
      if (response.ok) {
        const data = await response.json()
        setUserCoupons(data.coupons || [])
      }
    } catch (error) {
      console.error('Error fetching user coupons:', error)
      toast.error('Error al cargar cupones')
    } finally {
      setCouponsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'coupons' && user) {
      fetchUserCoupons()
    }
  }, [activeTab, user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso Requerido
            </h2>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para acceder a tu cuenta.
            </p>
            <Button asChild className="w-full">
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'orders', label: 'Mis Pedidos', icon: Package2 },
    { id: 'wishlist', label: 'Favoritos', icon: Heart },
    { id: 'cart', label: 'Carrito', icon: ShoppingBag },
    { id: 'coupons', label: 'Mis Cupones', icon: Tag },
    { id: 'loyalty', label: 'Puntos de Lealtad', icon: Star },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Sesión cerrada exitosamente')
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  const handleClearCart = async () => {
    if (cartItems.length === 0) {
      toast.info('Tu carrito ya está vacío')
      return
    }
    
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      await clearCart()
    }
  }

  const handleNotificationChange = async (key: 'notifyEmail' | 'notifyWhatsapp', value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value }
    setNotificationSettings(newSettings)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: dbUser?.firstName || '',
          lastName: dbUser?.lastName || '',
          phone: dbUser?.phone || '',
          birthDate: dbUser?.birthDate || '',
          address: dbUser?.address || '',
          city: dbUser?.city || '',
          region: dbUser?.region || '',
          notifyEmail: key === 'notifyEmail' ? value : dbUser?.notifyEmail || true,
          notifyWhatsapp: key === 'notifyWhatsapp' ? value : dbUser?.notifyWhatsapp || true,
        }),
      })

      if (response.ok) {
        toast.success('Preferencias de notificación actualizadas')
      } else {
        throw new Error('Error al actualizar preferencias')
      }
    } catch (error) {
      console.error('Error updating notification settings:', error)
      toast.error('Error al actualizar preferencias')
      // Revert the change
      setNotificationSettings(notificationSettings)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>
            {dbUser ? (
              <ProfileForm user={dbUser} />
            ) : (
              <div className="animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            )}
          </div>
        )

      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>
            <OrdersList />
          </div>
        )

      case 'wishlist':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mis Favoritos</h2>
              <Badge variant="secondary">
                {wishlistItems.length} productos
              </Badge>
            </div>
            
            {wishlistLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-48 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes productos favoritos
                </h3>
                <p className="text-gray-600 mb-6">
                  Explora nuestros productos y guarda tus favoritos.
                </p>
                <Button asChild>
                  <Link href="/productos">Explorar productos</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Link href={`/productos/${item.product.slug}`}>
                        <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                          {item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <WishlistButton
                        productId={item.product.id}
                        variant="icon"
                        size="sm"
                        className="absolute top-3 right-3"
                      />
                    </div>
                    
                    <CardContent className="p-4">
                      <Link href={`/productos/${item.product.slug}`}>
                        <h3 className="font-medium text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(item.product.price)}
                        </span>
                        <Badge variant="outline">
                          {item.product.category.name}
                        </Badge>
                      </div>

                      {item.product.variations && item.product.variations.length > 0 ? (
                        <Button asChild className="w-full" variant="outline">
                          <Link href={`/productos/${item.product.slug}`}>
                            Ver opciones
                          </Link>
                        </Button>
                      ) : (
                        <AddToCartButton
                          productId={item.product.id}
                          productName={item.product.name}
                          productPrice={item.product.price}
                          productImage={item.product.images[0]}
                          productStock={item.product.stock}
                          className="w-full"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 'cart':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mi Carrito</h2>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {cartItems.length} productos
                </Badge>
                {cartItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vaciar carrito
                  </Button>
                )}
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-600 mb-6">
                  Agrega productos a tu carrito para continuar.
                </p>
                <Button asChild>
                  <Link href="/productos">Explorar productos</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(cartItems.reduce((total, item) => total + (item.price * item.quantity), 0))}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/carrito">Ver carrito completo</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/checkout">Proceder al checkout</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'notifications':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Notificaciones por email</h3>
                      <p className="text-sm text-gray-600">
                        Recibe actualizaciones sobre tus pedidos por correo electrónico
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyEmail}
                      onChange={(e) => handleNotificationChange('notifyEmail', e.target.checked)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Notificaciones por WhatsApp</h3>
                      <p className="text-sm text-gray-600">
                        Recibe recordatorios y actualizaciones por WhatsApp
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.notifyWhatsapp}
                      onChange={(e) => handleNotificationChange('notifyWhatsapp', e.target.checked)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-900 mb-4">Historial de notificaciones</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Bell className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Bienvenido a Rincón Diabético</p>
                          <p className="text-xs text-gray-600">Hace 2 días</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'coupons':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Cupones</h2>
            
            {couponsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userCoupons.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tienes cupones disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  Los cupones aparecerán aquí cuando tengas descuentos disponibles.
                </p>
                <Button asChild>
                  <Link href="/productos">Explorar productos</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {userCoupons.map((coupon) => (
                  <Card key={coupon.id} className="border-2 border-dashed border-pink-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-pink-600" />
                          <Badge variant="outline" className="font-mono">
                            {coupon.code}
                          </Badge>
                        </div>
                        <Badge className={
                          coupon.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          coupon.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {coupon.status === 'ACTIVE' ? 'Activo' : 
                           coupon.status === 'EXPIRED' ? 'Expirado' : coupon.status}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{coupon.name}</h3>
                      
                      {coupon.description && (
                        <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Descuento:</span>
                          <span className="font-medium">
                            {coupon.type === 'PERCENTAGE' 
                              ? `${coupon.discountValue}%`
                              : formatPrice(coupon.discountValue)
                            }
                          </span>
                        </div>
                        
                        {coupon.minOrderAmount && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mínimo:</span>
                            <span className="font-medium">{formatPrice(coupon.minOrderAmount)}</span>
                          </div>
                        )}
                        
                        {coupon.maxUses && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Usos:</span>
                            <span className="font-medium">
                              {coupon.usedCount || 0} / {coupon.maxUses}
                            </span>
                          </div>
                        )}
                        
                        {coupon.validUntil && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Válido hasta:</span>
                            <span className="font-medium">
                              {new Date(coupon.validUntil).toLocaleDateString('es-CL')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {coupon.status === 'ACTIVE' && (
                        <div className="mt-4 pt-4 border-t">
                          <Button 
                            asChild 
                            className="w-full" 
                            variant="outline"
                          >
                            <Link href="/carrito">
                              Usar en mi carrito
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 'loyalty':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Puntos de Lealtad</h2>
            <LoyaltyDashboard />
          </div>
        )

      case 'security':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seguridad</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Información de la cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.emailAddresses[0]?.emailAddress}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Última conexión</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString('es-CL') : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cuenta creada</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CL') : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones de cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user.emailAddresses[0]?.emailAddress
                        }
                      </h3>
                      <p className="text-sm text-gray-600">Cliente</p>
                    </div>
                  </div>
                </div>
                
                <nav className="p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-pink-50 text-pink-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 