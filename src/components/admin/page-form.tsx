'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Save, ArrowLeft, FileText } from 'lucide-react'
import { Page } from '@/types'
import { toast } from 'sonner'

type PageFormProps = {
  page?: Page
  isEditing?: boolean
}

export function PageForm({ page, isEditing = false }: PageFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    excerpt: page?.excerpt || '',
    metaTitle: page?.metaTitle || '',
    metaDescription: page?.metaDescription || '',
    isActive: page?.isActive ?? true,
    showInMenu: page?.showInMenu ?? false,
    order: page?.order || 0,
  })

  const [saving, setSaving] = useState(false)

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Generar slug automáticamente desde el título
  const generateSlug = () => {
    return formData.title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Solo generar slug automáticamente si no estamos editando o si el slug está vacío
      slug: (!isEditing || !prev.slug) ? generateSlug() : prev.slug
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('El título es requerido')
      return
    }

    if (!formData.slug.trim()) {
      toast.error('El slug es requerido')
      return
    }

    if (!formData.content.trim()) {
      toast.error('El contenido es requerido')
      return
    }

    setSaving(true)

    try {
      const url = isEditing ? `/api/pages/${page!.id}` : '/api/pages'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(
          `Página ${isEditing ? 'actualizada' : 'creada'} correctamente`
        )
        router.push('/admin/cms/pages')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar página')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar página'
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
          {isEditing ? 'Editar Página' : 'Nueva Página'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contenido de la Página
              </h2>
              
              <div className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Título de la página"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL) *
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">/{window.location.origin}/</span>
                    <Input
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="url-de-la-pagina"
                      pattern="^[a-z0-9-]+$"
                      title="Solo letras minúsculas, números y guiones"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Solo letras minúsculas, números y guiones. Ej: politicas-privacidad
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resumen
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Breve descripción de la página (opcional)"
                    rows={2}
                  />
                </div>

                {/* Contenido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contenido *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Contenido completo de la página (HTML permitido)"
                    rows={15}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Puedes usar HTML básico: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, etc.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Configuración */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración
              </h2>
              
              <div className="space-y-4">
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
                    Página activa
                  </label>
                </div>

                {/* Mostrar en menú */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showInMenu"
                    checked={formData.showInMenu}
                    onChange={(e) => handleInputChange('showInMenu', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showInMenu" className="ml-2 block text-sm text-gray-700">
                    Mostrar en navegación
                  </label>
                </div>

                {/* Orden */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orden en menú
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                SEO
              </h2>
              
              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Título
                  </label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    placeholder="Título para SEO (opcional)"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: máximo 60 caracteres
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Descripción
                  </label>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    placeholder="Descripción para SEO (opcional)"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: máximo 160 caracteres
                  </p>
                </div>
              </div>
            </Card>
          </div>
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
            disabled={saving}
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