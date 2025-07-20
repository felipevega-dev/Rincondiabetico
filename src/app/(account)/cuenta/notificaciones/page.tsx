'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Mail, 
  MessageCircle, 
  Settings, 
  CheckCircle,
  Package,
  Heart
} from 'lucide-react'
import { toast } from 'sonner'

interface NotificationSettings {
  email: {
    orderConfirmation: boolean
    orderStatusUpdate: boolean
    orderReady: boolean
    promotions: boolean
    newsletter: boolean
  }
  whatsapp: {
    orderConfirmation: boolean
    orderStatusUpdate: boolean
    orderReady: boolean
    promotions: boolean
  }
  push: {
    orderStatusUpdate: boolean
    promotions: boolean
    newProducts: boolean
  }
}

interface NotificationHistory {
  id: string
  type: 'order' | 'promotion' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  channel: 'email' | 'whatsapp' | 'push'
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      orderConfirmation: true,
      orderStatusUpdate: true,
      orderReady: true,
      promotions: false,
      newsletter: false
    },
    whatsapp: {
      orderConfirmation: true,
      orderStatusUpdate: true,
      orderReady: true,
      promotions: false
    },
    push: {
      orderStatusUpdate: true,
      promotions: false,
      newProducts: false
    }
  })

  const [history, setHistory] = useState<NotificationHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de configuración y historial
    const mockHistory: NotificationHistory[] = [
      {
        id: '1',
        type: 'order',
        title: 'Pedido confirmado',
        message: 'Tu pedido #PP240115001 ha sido confirmado y está siendo preparado.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: true,
        channel: 'email'
      },
      {
        id: '2',
        type: 'system',
        title: 'Bienvenido a Rincón Diabético',
        message: 'Gracias por registrarte. ¡Disfruta de nuestros deliciosos postres!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
        read: true,
        channel: 'email'
      },
      {
        id: '3',
        type: 'promotion',
        title: 'Nueva promoción disponible',
        message: '20% de descuento en tortas familiares este fin de semana.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
        read: false,
        channel: 'whatsapp'
      }
    ]

    setTimeout(() => {
      setHistory(mockHistory)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSettingChange = async (
    channel: keyof NotificationSettings,
    setting: string,
    value: boolean
  ) => {
    try {
      const newSettings = {
        ...settings,
        [channel]: {
          ...settings[channel],
          [setting]: value
        }
      }
      setSettings(newSettings)
      
      // Aquí enviarías la actualización a la API
      toast.success('Preferencias de notificación actualizadas')
    } catch {
      toast.error('Error al actualizar preferencias')
    }
  }

  const markAsRead = (notificationId: string) => {
    setHistory(history.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return Package
      case 'promotion':
        return Heart
      case 'system':
        return Settings
      default:
        return Bell
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return Mail
      case 'whatsapp':
        return MessageCircle
      case 'push':
        return Bell
      default:
        return Bell
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `Hace ${days} día${days > 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
    } else {
      return 'Hace menos de 1 hora'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
        <div className="animate-pulse space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>

      {/* Configuración de notificaciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {key === 'orderConfirmation' && 'Confirmación de pedido'}
                  {key === 'orderStatusUpdate' && 'Actualización de estado'}
                  {key === 'orderReady' && 'Pedido listo'}
                  {key === 'promotions' && 'Promociones'}
                  {key === 'newsletter' && 'Newsletter'}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleSettingChange('email', key, e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.whatsapp).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {key === 'orderConfirmation' && 'Confirmación de pedido'}
                  {key === 'orderStatusUpdate' && 'Actualización de estado'}
                  {key === 'orderReady' && 'Pedido listo'}
                  {key === 'promotions' && 'Promociones'}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleSettingChange('whatsapp', key, e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Push */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Navegador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.push).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {key === 'orderStatusUpdate' && 'Actualización de estado'}
                  {key === 'promotions' && 'Promociones'}
                  {key === 'newProducts' && 'Nuevos productos'}
                </span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleSettingChange('push', key, e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Historial de notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Historial de Notificaciones</span>
            <Badge variant="secondary">
              {history.filter(n => !n.read).length} sin leer
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No tienes notificaciones aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((notification) => {
                const TypeIcon = getNotificationIcon(notification.type)
                const ChannelIcon = getChannelIcon(notification.channel)
                
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      notification.read 
                        ? 'bg-white border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'order' ? 'bg-green-100' :
                      notification.type === 'promotion' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      <TypeIcon className={`h-5 w-5 ${
                        notification.type === 'order' ? 'text-green-600' :
                        notification.type === 'promotion' ? 'text-purple-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${
                          notification.read ? 'text-gray-900' : 'text-blue-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <ChannelIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => {
            const unreadNotifications = history.filter(n => !n.read)
            if (unreadNotifications.length > 0) {
              setHistory(history.map(n => ({ ...n, read: true })))
              toast.success('Todas las notificaciones marcadas como leídas')
            } else {
              toast.info('No tienes notificaciones sin leer')
            }
          }}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Marcar todas como leídas
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            // Aquí podrías implementar la funcionalidad de test
            toast.success('Notificación de prueba enviada')
          }}
        >
          <Bell className="h-4 w-4 mr-2" />
          Enviar notificación de prueba
        </Button>
      </div>
    </div>
  )
}