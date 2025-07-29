'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Bell,
  Shield,
  Building2,
  Map
} from 'lucide-react'

interface ProfileFormProps {
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    phone: string | null
    birthDate: Date | null
    address: string | null
    city: string | null
    region: string | null
    notifyEmail: boolean
    notifyWhatsapp: boolean
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
    address: user.address || '',
    city: user.city || '',
    region: user.region || '',
    notifyEmail: user.notifyEmail,
    notifyWhatsapp: user.notifyWhatsapp
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        
        if (response.status === 400 && errorData.error) {
          // Handle validation errors
          const validationErrors = Array.isArray(errorData.error) 
            ? errorData.error.map((err: any) => err.message).join(', ')
            : 'Error de validación'
          throw new Error(validationErrors)
        }
        
        throw new Error(errorData.error || 'Error al actualizar perfil')
      }

      toast.success('Perfil actualizado correctamente')
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-pink-500" />
          Información Personal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <Input 
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido</Label>
            <Input 
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Tu apellido"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input 
                id="email"
                value={user.email}
                className="bg-gray-50 pl-10"
                readOnly
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="relative">
              <Input 
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="pl-10"
                placeholder="+56 9 1234 5678"
              />
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
            <div className="relative">
              <Input 
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-pink-500" />
          Dirección
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <div className="relative">
              <Input 
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="pl-10"
                placeholder="Calle, número, depto/casa"
              />
              <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <div className="relative">
              <Input 
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="pl-10"
                placeholder="Ciudad"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <div className="relative">
              <Input 
                id="region"
                value={formData.region}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                className="pl-10"
                placeholder="Región"
              />
              <Map className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-pink-500" />
          Notificaciones
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifyEmail">Notificaciones por Email</Label>
              <p className="text-sm text-gray-500">
                Recibe actualizaciones de tus pedidos por email
              </p>
            </div>
            <Switch
              id="notifyEmail"
              checked={formData.notifyEmail}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifyEmail: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifyWhatsapp">Notificaciones por WhatsApp</Label>
              <p className="text-sm text-gray-500">
                Recibe actualizaciones de tus pedidos por WhatsApp
              </p>
            </div>
            <Switch
              id="notifyWhatsapp"
              checked={formData.notifyWhatsapp}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifyWhatsapp: checked }))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
} 