'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MapPin, Plus, Edit, Trash2, Home, Building } from 'lucide-react'
import { toast } from 'sonner'

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  name: string
  street: string
  city: string
  region: string
  zipCode: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    street: '',
    city: '',
    region: '',
    zipCode: '',
    isDefault: false
  })

  // Simulando direcciones (en producción estas vendrían de la API)
  useEffect(() => {
    const mockAddresses: Address[] = [
      {
        id: '1',
        type: 'home',
        name: 'Casa',
        street: 'Av. Libertador Bernardo O\'Higgins 123',
        city: 'Chiguayante',
        region: 'Biobío',
        zipCode: '4030000',
        isDefault: true
      }
    ]
    setAddresses(mockAddresses)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAddress) {
        // Actualizar dirección existente
        const updatedAddresses = addresses.map(addr => 
          addr.id === editingAddress.id 
            ? { ...editingAddress, ...formData }
            : formData.isDefault ? { ...addr, isDefault: false } : addr
        )
        setAddresses(updatedAddresses)
        toast.success('Dirección actualizada exitosamente')
      } else {
        // Crear nueva dirección
        const newAddress: Address = {
          id: Date.now().toString(),
          ...formData
        }
        
        const updatedAddresses = formData.isDefault 
          ? addresses.map(addr => ({ ...addr, isDefault: false })).concat(newAddress)
          : [...addresses, newAddress]
          
        setAddresses(updatedAddresses)
        toast.success('Dirección agregada exitosamente')
      }
      
      // Resetear formulario
      setFormData({
        type: 'home',
        name: '',
        street: '',
        city: '',
        region: '',
        zipCode: '',
        isDefault: false
      })
      setIsEditing(false)
      setEditingAddress(null)
    } catch {
      toast.error('Error al guardar la dirección')
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      region: address.region,
      zipCode: address.zipCode,
      isDefault: address.isDefault
    })
    setIsEditing(true)
  }

  const handleDelete = async (addressId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      try {
        setAddresses(addresses.filter(addr => addr.id !== addressId))
        toast.success('Dirección eliminada exitosamente')
      } catch {
        toast.error('Error al eliminar la dirección')
      }
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
      setAddresses(updatedAddresses)
      toast.success('Dirección predeterminada actualizada')
    } catch {
      toast.error('Error al actualizar dirección predeterminada')
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingAddress(null)
    setFormData({
      type: 'home',
      name: '',
      street: '',
      city: '',
      region: '',
      zipCode: '',
      isDefault: false
    })
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return Home
      case 'work': return Building
      default: return MapPin
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mis Direcciones</h1>
        <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Dirección
        </Button>
      </div>

      {/* Nota informativa para tienda de retiro */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Información de Retiro</h3>
              <p className="text-sm text-blue-700 mt-1">
                Todos los pedidos deben ser retirados en nuestra tienda ubicada en Chiguayante. 
                Las direcciones guardadas son solo para referencia y facturación.
              </p>
              <p className="text-sm font-medium text-blue-800 mt-2">
                📍 Dirección de retiro: Av. Libertador Bernardo O&apos;Higgins 123, Chiguayante, Biobío
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de dirección */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de dirección
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'work' | 'other' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="home">Casa</option>
                    <option value="work">Trabajo</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la dirección
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Casa, Trabajo, etc."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección completa
                </label>
                <Input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Calle, número, departamento, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Chiguayante"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Región
                  </label>
                  <Input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Biobío"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <Input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="4030000"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Establecer como dirección predeterminada
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  {editingAddress ? 'Actualizar' : 'Guardar'} Dirección
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de direcciones */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes direcciones guardadas
              </h3>
              <p className="text-gray-600 mb-6">
                Agrega una dirección para facilitar tus pedidos futuros
              </p>
              <Button onClick={() => setIsEditing(true)}>
                Agregar primera dirección
              </Button>
            </CardContent>
          </Card>
        ) : (
          addresses.map((address) => {
            const IconComponent = getAddressIcon(address.type)
            return (
              <Card key={address.id} className={address.isDefault ? 'ring-2 ring-pink-500' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{address.name}</h3>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">
                              Predeterminada
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-1">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.region} {address.zipCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Predeterminada
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(address)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}