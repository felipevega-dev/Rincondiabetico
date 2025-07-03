'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Save, Clock, Globe, Phone, Mail } from 'lucide-react'
import { StoreSettings } from '@/types'
import { toast } from 'sonner'

const SCHEDULE_PERIODS = [
  { key: 'weekdays', label: 'Lunes a Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
]

export function StoreSettingsForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    description: '',
    openingHours: {
      weekdays: { open: '09:00', close: '19:00', isOpen: true },
      saturday: { open: '09:00', close: '17:00', isOpen: true },
      sunday: { open: '10:00', close: '15:00', isOpen: true }
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      whatsapp: '',
      email: ''
    },
    isOpen: true
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/store-settings')
      if (response.ok) {
        const settings = await response.json()
        setFormData({
          storeName: settings.storeName || '',
          address: settings.address || '',
          phone: settings.phone || '',
          email: settings.email || '',
          whatsapp: settings.whatsapp || '',
          description: settings.description || '',
          openingHours: settings.openingHours || formData.openingHours,
          socialMedia: settings.socialMedia || formData.socialMedia,
          isOpen: settings.isOpen ?? true
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Error al cargar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleHoursChange = (period: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [period]: {
          ...prev.openingHours[period as keyof typeof prev.openingHours],
          [field]: value,
          // Ensure open and close are always strings
          ...(field === 'isOpen' && !value ? { open: '09:00', close: '19:00' } : {})
        }
      }
    }))
  }

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Ensure all opening hours have proper string values
      const sanitizedData = {
        ...formData,
        openingHours: {
          weekdays: {
            open: formData.openingHours.weekdays?.open || '09:00',
            close: formData.openingHours.weekdays?.close || '19:00',
            isOpen: formData.openingHours.weekdays?.isOpen ?? true
          },
          saturday: {
            open: formData.openingHours.saturday?.open || '09:00',
            close: formData.openingHours.saturday?.close || '17:00',
            isOpen: formData.openingHours.saturday?.isOpen ?? true
          },
          sunday: {
            open: formData.openingHours.sunday?.open || '10:00',
            close: formData.openingHours.sunday?.close || '15:00',
            isOpen: formData.openingHours.sunday?.isOpen ?? true
          }
        }
      }

      const response = await fetch('/api/store-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      })

      if (response.ok) {
        toast.success('Configuración guardada correctamente')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar configuración')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar configuración'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando configuración...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Configuración de Tienda</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información General */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Información General
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Tienda *
                </label>
                <Input
                  value={formData.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Breve descripción de la tienda"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOpen"
                  checked={formData.isOpen}
                  onChange={(e) => handleInputChange('isOpen', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isOpen" className="ml-2 block text-sm text-gray-700">
                  Tienda abierta al público
                </label>
              </div>
            </div>
          </Card>

          {/* Contacto */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Información de Contacto
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp *
                </label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Horarios */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horarios de Atención
          </h2>
          
          <div className="space-y-4">
            {SCHEDULE_PERIODS.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.openingHours[key as keyof typeof formData.openingHours]?.isOpen || false}
                    onChange={(e) => handleHoursChange(key, 'isOpen', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={formData.openingHours[key as keyof typeof formData.openingHours]?.open || '09:00'}
                      onChange={(e) => handleHoursChange(key, 'open', e.target.value || '09:00')}
                      disabled={!formData.openingHours[key as keyof typeof formData.openingHours]?.isOpen}
                      className="w-24"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="time"
                      value={formData.openingHours[key as keyof typeof formData.openingHours]?.close || '19:00'}
                      onChange={(e) => handleHoursChange(key, 'close', e.target.value || '19:00')}
                      disabled={!formData.openingHours[key as keyof typeof formData.openingHours]?.isOpen}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Redes Sociales */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Redes Sociales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <Input
                value={formData.socialMedia.facebook || ''}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/tu-pagina"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <Input
                value={formData.socialMedia.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/tu-cuenta"
              />
            </div>
          </div>
        </Card>

        {/* Botón de guardar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </form>
    </div>
  )
} 