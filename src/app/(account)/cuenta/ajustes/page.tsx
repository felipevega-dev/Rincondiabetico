'use client'

import { useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Shield, 
  Eye, 
  Download, 
  Trash2, 
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

interface AccountSettings {
  privacy: {
    profileVisibility: 'public' | 'private'
    showOrderHistory: boolean
    allowDataExport: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: 'es' | 'en'
    currency: 'CLP' | 'USD'
    timezone: string
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    passwordLastChanged: Date
  }
}

export default function SettingsPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [settings, setSettings] = useState<AccountSettings>({
    privacy: {
      profileVisibility: 'private',
      showOrderHistory: false,
      allowDataExport: true
    },
    preferences: {
      theme: 'light',
      language: 'es',
      currency: 'CLP',
      timezone: 'America/Santiago'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 días atrás
    }
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    // Simular carga de configuración
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSettingChange = async (
    category: keyof AccountSettings,
    setting: string,
    value: string | boolean | number
  ) => {
    try {
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [setting]: value
        }
      }
      setSettings(newSettings)
      toast.success('Configuración actualizada')
    } catch {
      toast.error('Error al actualizar configuración')
    }
  }

  const handleExportData = async () => {
    try {
      toast.info('Preparando exportación de datos...')
      
      // Simular exportación
      setTimeout(() => {
        const data = {
          user: {
            name: user?.firstName + ' ' + user?.lastName,
            email: user?.emailAddresses[0]?.emailAddress,
            createdAt: user?.createdAt
          },
          settings: settings,
          exportedAt: new Date().toISOString()
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rincondiabetico-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success('Datos exportados exitosamente')
      }, 2000)
    } catch {
      toast.error('Error al exportar datos')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'ELIMINAR CUENTA') {
      toast.error('Debes escribir "ELIMINAR CUENTA" para confirmar')
      return
    }

    try {
      toast.info('Procesando eliminación de cuenta...')
      
      // En producción aquí se llamaría a la API para eliminar la cuenta
      setTimeout(() => {
        toast.success('Cuenta eliminada exitosamente')
        signOut()
      }, 2000)
    } catch {
      toast.error('Error al eliminar cuenta')
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysSincePasswordChange = () => {
    const now = new Date()
    const diff = now.getTime() - settings.security.passwordLastChanged.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Ajustes</h1>
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ajustes</h1>

      {/* Privacidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Visibilidad del perfil</h4>
              <p className="text-sm text-gray-600">
                Controla quién puede ver tu información de perfil
              </p>
            </div>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="public">Público</option>
              <option value="private">Privado</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Mostrar historial de pedidos</h4>
              <p className="text-sm text-gray-600">
                Permitir que otros vean tus pedidos anteriores
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showOrderHistory}
              onChange={(e) => handleSettingChange('privacy', 'showOrderHistory', e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Permitir exportación de datos</h4>
              <p className="text-sm text-gray-600">
                Habilitar la descarga de tus datos personales
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.allowDataExport}
              onChange={(e) => handleSettingChange('privacy', 'allowDataExport', e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferencias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema de la aplicación
              </label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                value={settings.preferences.currency}
                onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="CLP">Peso Chileno (CLP)</option>
                <option value="USD">Dólar Americano (USD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona horaria
              </label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="America/Santiago">Santiago, Chile</option>
                <option value="America/Buenos_Aires">Buenos Aires</option>
                <option value="America/Lima">Lima</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Autenticación de dos factores</h4>
              <p className="text-sm text-gray-600">
                Agrega una capa extra de seguridad a tu cuenta
              </p>
            </div>
            <div className="flex items-center gap-2">
              {settings.security.twoFactorEnabled ? (
                <Badge className="bg-green-100 text-green-800">Activado</Badge>
              ) : (
                <Badge variant="outline">Desactivado</Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSettingChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
              >
                {settings.security.twoFactorEnabled ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Tiempo de espera de sesión</h4>
              <p className="text-sm text-gray-600">
                Cerrar sesión automáticamente después de inactividad
              </p>
            </div>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={120}>2 horas</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Contraseña</h4>
              <p className="text-sm text-gray-600">
                Última modificación: {formatDate(settings.security.passwordLastChanged)}
                <span className={`ml-2 text-xs ${
                  getDaysSincePasswordChange() > 90 ? 'text-red-600' : 'text-green-600'
                }`}>
                  (hace {getDaysSincePasswordChange()} días)
                </span>
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Cambiar contraseña
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exportar datos */}
      {settings.privacy.allowDataExport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Descargar mis datos</h4>
                <p className="text-sm text-gray-600">
                  Obtén una copia de toda tu información personal y configuraciones
                </p>
              </div>
              <Button onClick={handleExportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zona peligrosa */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Zona Peligrosa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Eliminar cuenta</h4>
                <p className="text-sm text-gray-600">
                  Elimina permanentemente tu cuenta y todos los datos asociados
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar cuenta
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">
                    ¿Estás seguro de que quieres eliminar tu cuenta?
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos,
                    pedidos, configuraciones y preferencias.
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-900 mb-2">
                  Escribe &quot;ELIMINAR CUENTA&quot; para confirmar:
                </label>
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="ELIMINAR CUENTA"
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'ELIMINAR CUENTA'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Eliminar cuenta permanentemente
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}