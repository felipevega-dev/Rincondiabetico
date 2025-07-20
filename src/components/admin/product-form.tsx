'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, Package, Loader2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductVariations } from './product-variations'
import { SortableImageList } from './sortable-image-list'
import { VariationType, ProductWithVariations } from '@/types'

// Tipo para el formulario (sin campos de BD)
type FormProductVariation = {
  id?: string
  type: VariationType
  name: string
  description?: string
  priceChange: number
  servingSize?: number
  order: number
  isAvailable: boolean
}

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number().min(1, 'El precio debe ser mayor a 0'),
  stock: z.number().min(0, 'El stock no puede ser negativo'),
  minStock: z.number().min(0, 'El stock mínimo no puede ser negativo'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  isAvailable: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  product?: ProductWithVariations
  categories: Category[]
  isEditing?: boolean
  showHeader?: boolean
  embedded?: boolean
}

export function ProductForm({ 
  product, 
  categories, 
  isEditing = false, 
  showHeader = true,
  embedded = false 
}: ProductFormProps) {
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || [])
  const [variations, setVariations] = useState<FormProductVariation[]>(
    product?.variations?.map(v => ({
      id: v.id,
      type: v.type,
      name: v.name,
      description: v.description || '',
      priceChange: v.priceChange,
      servingSize: v.servingSize || undefined,
      order: v.order,
      isAvailable: v.isAvailable
    })) || []
  )
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Debug: Log product data when editing
  useEffect(() => {
    if (isEditing && product) {
      console.log('🔍 ProductForm - Product data:', product)
      console.log('🔍 ProductForm - Product variations:', product.variations)
      console.log('🔍 ProductForm - Variations state:', variations)
    }
  }, [product, isEditing, variations])

  // Update variations when product changes
  useEffect(() => {
    if (product?.variations) {
      const mappedVariations = product.variations.map(v => ({
        id: v.id,
        type: v.type,
        name: v.name,
        description: v.description || '',
        priceChange: v.priceChange,
        servingSize: v.servingSize || undefined,
        order: v.order,
        isAvailable: v.isAvailable
      }))
      setVariations(mappedVariations)
    }
  }, [product])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      minStock: product?.minStock || 0,
      categoryId: product?.categoryId || '',
      isAvailable: product?.isAvailable ?? true,
    },
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Verificar límite total de imágenes (existentes + nuevas)
    const totalCurrentImages = existingImages.length + imagePreviews.length
    const maxImages = 3
    const availableSlots = maxImages - totalCurrentImages

    if (availableSlots <= 0) {
      alert(`Solo se permiten máximo ${maxImages} imágenes. Ya tienes ${totalCurrentImages} imágenes.`)
      return
    }

    // Limitar archivos a los slots disponibles
    const filesToProcess = files.slice(0, availableSlots)
    if (files.length > availableSlots) {
      alert(`Solo se pueden agregar ${availableSlots} imágenes más. Se procesarán las primeras ${availableSlots}.`)
    }

    // Validar archivos
    const validFiles = filesToProcess.filter(file => {
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

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleExistingImagesReorder = (newOrder: string[]) => {
    setExistingImages(newOrder)
  }

  const handleNewImagesReorder = (newOrder: string[]) => {
    // Necesitamos reordenar tanto los previews como los archivos
    const newFiles: File[] = []
    newOrder.forEach(previewUrl => {
      const index = imagePreviews.indexOf(previewUrl)
      if (index !== -1 && images[index]) {
        newFiles.push(images[index])
      }
    })
    setImagePreviews(newOrder)
    setImages(newFiles)
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
      // Subir nuevas imágenes si hay
      let newImageUrls: string[] = []
      if (images.length > 0) {
        setUploading(true)
        newImageUrls = await uploadImages()
        setUploading(false)
      }

      // Combinar imágenes existentes con nuevas
      const allImages = [...existingImages, ...newImageUrls]

      // Preparar datos del producto
      const productData = {
        ...data,
        images: allImages,
        variations: variations,
      }

      const url = isEditing ? `/api/products/${product!.id}` : '/api/products'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        alert(isEditing ? 'Producto actualizado exitosamente!' : 'Producto creado exitosamente!')
        
        if (!isEditing) {
          reset()
          setImages([])
          setImagePreviews([])
          setExistingImages([])
          setVariations([])
        }
        
        // Redirigir a la lista de productos
        window.location.href = '/admin/productos'
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error al guardar el producto')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  return (
    <div className={embedded ? "" : "bg-white rounded-lg shadow-lg p-6"}>
      {/* Header */}
      {showHeader && (
        <div className="mb-6">
          <Link 
            href="/admin/productos"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h2>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

          {/* Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Disponible *
              </label>
              <Input
                type="number"
                min="0"
                {...register('stock', { valueAsNumber: true })}
                placeholder="Ej: 10"
              />
              {errors.stock && (
                <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Cantidad de unidades disponibles para venta
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo *
              </label>
              <Input
                type="number"
                min="0"
                {...register('minStock', { valueAsNumber: true })}
                placeholder="Ej: 5"
              />
              {errors.minStock && (
                <p className="text-red-600 text-sm mt-1">{errors.minStock.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Cantidad mínima que activa alertas de stock bajo
              </p>
            </div>
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
        </div>

        {/* Disponibilidad */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('isAvailable')}
              className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Producto disponible para venta
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Los productos no disponibles no aparecerán en la tienda
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <Textarea
            {...register('description')}
            placeholder="Describe el producto, ingredientes especiales, etc..."
            rows={3}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Variaciones del Producto */}
        <div>
          <ProductVariations
            variations={variations}
            onChange={setVariations}
          />
        </div>

        {/* Imágenes Existentes con Ordenamiento */}
        {isEditing && existingImages.length > 0 && (
          <SortableImageList
            images={existingImages}
            onReorder={handleExistingImagesReorder}
            onRemove={removeExistingImage}
            title="Imágenes Actuales (Máximo 3 se mostrarán en collage)"
          />
        )}

        {/* Nuevas Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isEditing ? 'Agregar Nuevas Imágenes' : 'Imágenes del Producto'}
          </label>
          
          {/* Upload area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">
                Haz clic para seleccionar imágenes o arrastra y suelta
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG, WEBP hasta 5MB cada una (máximo 3 imágenes total)
              </p>
              <p className="text-xs text-blue-600 mt-1">
                💡 Solo las primeras 3 imágenes se mostrarán en el collage
              </p>
            </label>
          </div>

          {/* New image previews with sorting */}
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <SortableImageList
                images={imagePreviews}
                onReorder={handleNewImagesReorder}
                onRemove={removeNewImage}
                title="Nuevas Imágenes"
              />
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="flex justify-end space-x-4">
          {!embedded && (
            <Link href="/admin/productos">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          )}
          <Button
            type="submit"
            disabled={submitting || uploading}
            className="flex items-center gap-2"
          >
            {(submitting || uploading) && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {uploading ? 'Subiendo imágenes...' : 
             submitting ? (isEditing ? 'Actualizando...' : 'Creando...') : 
             (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
          </Button>
        </div>
      </form>
    </div>
  )
} 