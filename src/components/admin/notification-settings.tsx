'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface NotificationSettings {
  email: {
    orderConfirmation: boolean
    statusUpdates: boolean
    pickupReminders: boolean
  }
  whatsapp: {
    adminNewOrders: boolean
    adminStatusUpdates: boolean
    adminLowStock: boolean
  }
}

interface NotificationStats {
  emailsSentToday: number
  whatsappSentToday: number
  lastEmail: string | null
  lastWhatsapp: string | null
  systemHealth: {
    email: boolean
    whatsapp: boolean
  }
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      orderConfirmation: true,
      statusUpdates: true,
      pickupReminders: true
    },
    whatsapp: {
      adminNewOrders: true,
      adminStatusUpdates: true,
      adminLowStock: true
    }
  })
  
  const [stats, setStats] = useState<NotificationStats>({
    emailsSentToday: 0,
    whatsappSentToday: 0,
    lastEmail: null,
    lastWhatsapp: null,
    systemHealth: {
      email: true,
      whatsapp: true
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Simular carga de configuración desde API
  useEffect(() => {
    loadSettings()
    loadStats()
  }, [])

  const loadSettings = async () => {
    try {
      // En producción cargaría desde API
      // const response = await fetch('/api/admin/notifications/settings')
      // const data = await response.json()
      // setSettings(data.settings)
      
      console.log('Configuración de notificaciones cargada')
    } catch (error) {
      console.error('Error cargando configuración:', error)
    }
  }

  const loadStats = async () => {
    try {
      // En producción cargaría estadísticas reales
      setStats({
        emailsSentToday: 23,
        whatsappSentToday: 15,
        lastEmail: new Date(Date.now() - 30 * 60 * 1000).toLocaleString('es-CL'),
        lastWhatsapp: new Date(Date.now() - 5 * 60 * 1000).toLocaleString('es-CL'),
        systemHealth: {
          email: true,
          whatsapp: true
        }
      })
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    setSaved(false)
    
    try {
      // En producción enviaría a API
      // await fetch('/api/admin/notifications/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })
      
      console.log('Configuración guardada:', settings)
      setSaved(true)
      
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error guardando configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEmailSetting = (key: keyof NotificationSettings['email'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value
      }
    }))
  }

  const updateWhatsAppSetting = (key: keyof NotificationSettings['whatsapp'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      whatsapp: {
        ...prev.whatsapp,
        [key]: value
      }
    }))
  }

  const testNotifications = async () => {
    try {
      console.log('Enviando notificaciones de prueba...')
      // En producción enviaría notificaciones de prueba
      alert('Notificaciones de prueba enviadas')
    } catch (error) {
      console.error('Error enviando notificaciones de prueba:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estado del Sistema de Notificaciones
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Emails Hoy</p>
            <p className="text-2xl font-bold text-blue-900">{stats.emailsSentToday}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">WhatsApp Hoy</p>
            <p className="text-2xl font-bold text-green-900">{stats.whatsappSentToday}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-600">Estado Email</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${stats.systemHealth.email ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">{stats.systemHealth.email ? 'Activo' : 'Error'}</span>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-orange-600">Estado WhatsApp</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${stats.systemHealth.whatsapp ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">{stats.systemHealth.whatsapp ? 'Activo' : 'Error'}</span>
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Último email:</strong> {stats.lastEmail || 'Ninguno'}
          </div>
          <div>
            <strong>Último WhatsApp:</strong> {stats.lastWhatsapp || 'Ninguno'}
          </div>
        </div>
      </Card>

      {/* Email Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📧 Configuración de Emails
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-confirmation" className="text-sm font-medium">
                Confirmación de Pedidos
              </Label>
              <p className="text-sm text-gray-600">
                Enviar email de confirmación cuando se crea un pedido
              </p>
            </div>
            <Switch
              id="email-confirmation"
              checked={settings.email.orderConfirmation}
              onCheckedChange={(checked) => updateEmailSetting('orderConfirmation', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-status" className="text-sm font-medium">
                Cambios de Estado
              </Label>
              <p className="text-sm text-gray-600">
                Notificar al cliente cuando cambia el estado del pedido
              </p>
            </div>
            <Switch
              id="email-status"
              checked={settings.email.statusUpdates}
              onCheckedChange={(checked) => updateEmailSetting('statusUpdates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-reminders" className="text-sm font-medium">
                Recordatorios de Retiro
              </Label>
              <p className="text-sm text-gray-600">
                Recordar al cliente retirar su pedido (1 hora antes)
              </p>
            </div>
            <Switch
              id="email-reminders"
              checked={settings.email.pickupReminders}
              onCheckedChange={(checked) => updateEmailSetting('pickupReminders', checked)}
            />
          </div>
        </div>
      </Card>

      {/* WhatsApp Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📱 Configuración de WhatsApp (Admin)
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="whatsapp-orders" className="text-sm font-medium">
                Nuevos Pedidos
              </Label>
              <p className="text-sm text-gray-600">
                Notificar al admin cuando llega un nuevo pedido
              </p>
            </div>
            <Switch
              id="whatsapp-orders"
              checked={settings.whatsapp.adminNewOrders}
              onCheckedChange={(checked) => updateWhatsAppSetting('adminNewOrders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="whatsapp-status" className="text-sm font-medium">
                Cambios de Estado
              </Label>
              <p className="text-sm text-gray-600">
                Notificar al admin sobre cambios de estado de pedidos
              </p>
            </div>
            <Switch
              id="whatsapp-status"
              checked={settings.whatsapp.adminStatusUpdates}
              onCheckedChange={(checked) => updateWhatsAppSetting('adminStatusUpdates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="whatsapp-stock" className="text-sm font-medium">
                Alertas de Stock
              </Label>
              <p className="text-sm text-gray-600">
                Alertar cuando productos tienen stock bajo
              </p>
            </div>
            <Switch
              id="whatsapp-stock"
              checked={settings.whatsapp.adminLowStock}
              onCheckedChange={(checked) => updateWhatsAppSetting('adminLowStock', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones
        </h3>
        
        <div className="flex gap-4">
          <Button 
            onClick={saveSettings}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={testNotifications}
          >
            Enviar Prueba
          </Button>
          
          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm font-medium">Configuración guardada</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}