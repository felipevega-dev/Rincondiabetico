'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Package, Loader2 } from 'lucide-react'
import Image from 'next/image'

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number().min(1, 'El precio debe ser mayor a 0'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  available: z.boolean().default(true),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
}

export function ProductForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      available: true,
    },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validar archivos
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} no es un tipo de imagen válido`)
        return false
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} es demasiado grande (máximo 5MB)`)
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    // Crear previews
    const newPreviews: string[] = []
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    setImages(prev => [...prev, ...validFiles])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return []

    const uploadedUrls: string[] = []
    
    for (const image of images) {
      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        uploadedUrls.push(data.url)
      } else {
        throw new Error(`Error uploading ${image.name}`)
      }
    }

    return uploadedUrls
  }

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true)
    try {
      // Subir imágenes primero
      setUploading(true)
      const imageUrls = await uploadImages()
      setUploading(false)

      // Crear producto
      const productData = {
        ...data,
        images: imageUrls,
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        alert('Producto creado exitosamente!')
        reset()
        setImages([])
        setImagePreviews([])
        // Recargar la página para actualizar la tabla
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error al crear el producto')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto *
          </label>
          <Input
            {...register('name')}
            placeholder="Ej: Torta de Chocolate"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio (CLP) *
          </label>
          <Input
            type="number"
            step="1"
            min="1"
            {...register('price', { valueAsNumber: true })}
            placeholder="Ej: 15000"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            {...register('categoryId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Disponibilidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="radio"
                {...register('available')}
                value="true"
                className="mr-2"
              />
              Disponible
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register('available')}
                value="false"
                className="mr-2"
              />
              No disponible
            </label>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <Textarea
          {...register('description')}
          placeholder="Describe el producto..."
          rows={3}
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Imágenes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes del Producto
        </label>
        
        {/* Upload area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Haz clic para seleccionar imágenes o arrastra y suelta
            </p>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG, JPEG, WEBP hasta 5MB cada una
            </p>
          </label>
        </div>

        {/* Image previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={150}
                  height={150}
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting || uploading}
          className="flex items-center gap-2"
        >
          {(submitting || uploading) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {uploading ? 'Subiendo imágenes...' : submitting ? 'Creando...' : 'Crear Producto'}
        </Button>
      </div>
    </form>
  )
} 