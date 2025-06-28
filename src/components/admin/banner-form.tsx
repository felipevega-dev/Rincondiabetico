'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Upload, X, Save, ArrowLeft } from 'lucide-react'
import { Banner } from '@/types'
import { useToast } from '@/components/providers/toast-provider'

type BannerFormProps = {
  banner?: Banner
  isEditing?: boolean
}

export function BannerForm({ banner, isEditing = false }: BannerFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    description: banner?.description || '',
    image: banner?.image || '',
    buttonText: banner?.buttonText || '',
    buttonLink: banner?.buttonLink || '',
    order: banner?.order || 0,
    isActive: banner?.isActive ?? true,
  })

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setFormData(prev => ({ ...prev, image: url }))
        showToast('Imagen subida correctamente', 'success')
      } else {
        throw new Error('Error al subir imagen')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      showToast('Error al subir imagen', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      showToast('El título es requerido', 'error')
      return
    }

    if (!formData.image) {
      showToast('La imagen es requerida', 'error')
      return
    }

    setSaving(true)

    try {
      const url = isEditing ? `/api/banners/${banner!.id}` : '/api/banners'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showToast(
          `Banner ${isEditing ? 'actualizado' : 'creado'} correctamente`,
          'success'
        )
        router.push('/admin/banners')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar banner')
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      showToast(
        error instanceof Error ? error.message : 'Error al guardar banner',
        'error'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Banner' : 'Nuevo Banner'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Banner
            </h2>
            
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Título principal del banner"
                  required
                />
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo
                </label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Subtítulo opcional"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción del banner"
                  rows={3}
                />
              </div>

              {/* Texto del botón */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto del Botón
                </label>
                <Input
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  placeholder="Ej: Ver Productos"
                />
              </div>

              {/* Enlace del botón */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enlace del Botón
                </label>
                <Input
                  value={formData.buttonLink}
                  onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                  placeholder="Ej: /productos"
                />
              </div>

              {/* Orden */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orden
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>

              {/* Estado */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Banner activo
                </label>
              </div>
            </div>
          </Card>

          {/* Imagen */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Imagen del Banner
            </h2>

            {formData.image ? (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Cambiar Imagen
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Sube una imagen para el banner
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
              className="hidden"
            />

            <p className="text-xs text-gray-500 mt-2">
              Recomendado: 1920x800px o similar (formato panorámico)
            </p>
          </Card>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving || uploading}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </div>
  )
}