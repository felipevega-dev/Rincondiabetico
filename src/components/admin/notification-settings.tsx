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

  useEffect(() => {
    // Simular carga de datos
    setStats({
      emailsSentToday: 12,
      whatsappSentToday: 8,
      lastEmail: '2025-01-20 14:30',
      lastWhatsapp: '2025-01-20 15:45',
      systemHealth: {
        email: true,
        whatsapp: true
      }
    })
  }, [])

  const saveSettings = async () => {
    setLoading(true)
    setSaved(false)
    
    try {
      // En producción enviaría a API
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
      email: { ...prev.email, [key]: value }
    }))
  }

  const updateWhatsAppSetting = (key: keyof NotificationSettings['whatsapp'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, [key]: value }
    }))
  }

  const testNotifications = async () => {
    try {
      console.log('Enviando notificaciones de prueba...')
      alert('Notificaciones de prueba enviadas')
    } catch (error) {
      console.error('Error enviando notificaciones de prueba:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Settings */}
      <div className="space-y-4">
        {/* Email Settings */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            📧 Configuración de Emails
          </h3>
          <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Confirmación de Pedidos</Label>
                <p className="text-xs text-gray-600">Email automático al crear pedido</p>
              </div>
              <Switch
                checked={settings.email.orderConfirmation}
                onCheckedChange={(checked) => updateEmailSetting('orderConfirmation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Cambios de Estado</Label>
                <p className="text-xs text-gray-600">Notificar cambios de estado</p>
              </div>
              <Switch
                checked={settings.email.statusUpdates}
                onCheckedChange={(checked) => updateEmailSetting('statusUpdates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Recordatorios</Label>
                <p className="text-xs text-gray-600">Recordar retiro (1h antes)</p>
              </div>
              <Switch
                checked={settings.email.pickupReminders}
                onCheckedChange={(checked) => updateEmailSetting('pickupReminders', checked)}
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Settings */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            📱 WhatsApp (Admin)
          </h3>
          <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Nuevos Pedidos</Label>
                <p className="text-xs text-gray-600">Notificar pedidos nuevos</p>
              </div>
              <Switch
                checked={settings.whatsapp.adminNewOrders}
                onCheckedChange={(checked) => updateWhatsAppSetting('adminNewOrders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Cambios de Estado</Label>
                <p className="text-xs text-gray-600">Notificar cambios</p>
              </div>
              <Switch
                checked={settings.whatsapp.adminStatusUpdates}
                onCheckedChange={(checked) => updateWhatsAppSetting('adminStatusUpdates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Alertas Stock</Label>
                <p className="text-xs text-gray-600">Stock bajo</p>
              </div>
              <Switch
                checked={settings.whatsapp.adminLowStock}
                onCheckedChange={(checked) => updateWhatsAppSetting('adminLowStock', checked)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={saveSettings}
            disabled={loading}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={testNotifications}
            size="sm"
          >
            Probar
          </Button>
          
          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-xs font-medium">Guardado</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Stats */}
      <div className="space-y-4">
        {/* Stats Overview */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            📊 Estadísticas de Hoy
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-blue-600">Emails</p>
              <p className="text-xl font-bold text-blue-900">{stats.emailsSentToday}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-green-600">WhatsApp</p>
              <p className="text-xl font-bold text-green-900">{stats.whatsappSentToday}</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            🔧 Estado del Sistema
          </h3>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stats.systemHealth.email ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs font-medium">{stats.systemHealth.email ? 'Activo' : 'Error'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">WhatsApp</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stats.systemHealth.whatsapp ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs font-medium">{stats.systemHealth.whatsapp ? 'Activo' : 'Error'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            🕒 Última Actividad
          </h3>
          <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between">
              <span>Último email:</span>
              <span className="font-mono text-xs">{stats.lastEmail || 'Ninguno'}</span>
            </div>
            <div className="flex justify-between">
              <span>Último WhatsApp:</span>
              <span className="font-mono text-xs">{stats.lastWhatsapp || 'Ninguno'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}