'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserX, User, Mail, Phone } from 'lucide-react'
import { useGuestCheckout } from '@/hooks/use-guest-checkout'
import Link from 'next/link'

interface GuestInfoFormProps {
  onComplete: () => void
  onSkip?: () => void
}

export function GuestInfoForm({ onComplete, onSkip }: GuestInfoFormProps) {
  const { isGuest, guestInfo, saveGuestInfo, getUserInfo, hasCompleteInfo } = useGuestCheckout()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar datos existentes al iniciar
  useEffect(() => {
    const userInfo = getUserInfo()
    if (userInfo) {
      setFormData(userInfo)
    }
  }, [getUserInfo])

  // Si no es invitado y ya tiene info completa, continuar automáticamente
  useEffect(() => {
    if (!isGuest && hasCompleteInfo()) {
      onComplete()
    }
  }, [isGuest, hasCompleteInfo, onComplete])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    } else if (!/^[+]?[\d\s-()]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (isGuest) {
        saveGuestInfo(formData)
      }
      onComplete()
    } catch (error) {
      console.error('Error saving guest info:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Si no es invitado, no mostrar el formulario
  if (!isGuest) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-5 w-5 text-primary-600" />
          Información de contacto
        </CardTitle>
        <p className="text-sm text-gray-600">
          Para continuar como invitado, necesitamos algunos datos básicos.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <p className="text-sm text-blue-800">
            ¿Ya tienes cuenta?{' '}
            <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-700">
              Inicia sesión
            </Link>{' '}
            para un checkout más rápido.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nombre *
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Tu nombre"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Apellido *
              </label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Tu apellido"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Te enviaremos la confirmación del pedido a este email
            </p>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Teléfono *
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+56 9 1234 5678"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Para contactarte sobre tu pedido
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Guardando...' : 'Continuar'}
            </Button>
            
            {onSkip && (
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                className="px-6"
              >
                Omitir
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            Al continuar, aceptas recibir comunicaciones sobre tu pedido
          </p>
        </form>
      </CardContent>
    </Card>
  )
}