'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X, Users, Cookie } from 'lucide-react'
import { VariationType, DEFAULT_SIZES, VARIATION_TYPE_LABELS } from '@/types'

interface ProductVariation {
  id?: string
  type: VariationType
  name: string
  description?: string
  priceChange: number
  servingSize?: number
  order: number
  isAvailable: boolean
}

interface ProductVariationsProps {
  variations: ProductVariation[]
  onChange: (variations: ProductVariation[]) => void
}

export function ProductVariations({ variations, onChange }: ProductVariationsProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVariation, setNewVariation] = useState<Partial<ProductVariation>>({
    type: VariationType.SIZE,
    name: '',
    description: '',
    priceChange: 0,
    servingSize: undefined,
    order: variations.length,
    isAvailable: true
  })

  const addDefaultSizes = () => {
    const sizeVariations: ProductVariation[] = DEFAULT_SIZES.map((size, index) => ({
      type: VariationType.SIZE,
      name: size.name,
      description: `Tamaño ideal para ${size.servingSize} personas`,
      priceChange: size.priceChange,
      servingSize: size.servingSize,
      order: variations.length + index,
      isAvailable: true
    }))
    
    onChange([...variations, ...sizeVariations])
  }

  const addVariation = () => {
    if (!newVariation.name) return

    const variation: ProductVariation = {
      type: newVariation.type!,
      name: newVariation.name,
      description: newVariation.description || '',
      priceChange: newVariation.priceChange || 0,
      servingSize: newVariation.type === VariationType.SIZE ? newVariation.servingSize : undefined,
      order: newVariation.order || variations.length,
      isAvailable: true
    }

    onChange([...variations, variation])
    setNewVariation({
      type: VariationType.SIZE,
      name: '',
      description: '',
      priceChange: 0,
      servingSize: undefined,
      order: variations.length + 1,
      isAvailable: true
    })
    setShowAddForm(false)
  }

  const removeVariation = (index: number) => {
    const newVariations = variations.filter((_, i) => i !== index)
    onChange(newVariations)
  }

  const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    const newVariations = [...variations]
    newVariations[index] = { ...newVariations[index], [field]: value }
    onChange(newVariations)
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Sin costo adicional'
    return price > 0 ? `+$${price.toLocaleString()}` : `-$${Math.abs(price).toLocaleString()}`
  }

  const sizeVariations = variations.filter(v => v.type === VariationType.SIZE)
  const ingredientVariations = variations.filter(v => v.type === VariationType.INGREDIENT)
  const hasSizes = sizeVariations.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Variaciones del Producto</h3>
        <div className="flex gap-2">
          {!hasSizes && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDefaultSizes}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Agregar Tamaños Estándar
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Variación
          </Button>
        </div>
      </div>

      {/* Variaciones de Tamaño */}
      {sizeVariations.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tamaños Disponibles
          </h4>
          <div className="grid gap-3">
            {sizeVariations.map((variation, index) => {
              const actualIndex = variations.findIndex(v => v === variation)
              return (
                <div key={actualIndex} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <Input
                      placeholder="Nombre del tamaño"
                      value={variation.name}
                      onChange={(e) => updateVariation(actualIndex, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Personas"
                      value={variation.servingSize || ''}
                      onChange={(e) => updateVariation(actualIndex, 'servingSize', parseInt(e.target.value) || undefined)}
                    />
                    <Input
                      type="number"
                      placeholder="Cambio de precio"
                      value={variation.priceChange}
                      onChange={(e) => updateVariation(actualIndex, 'priceChange', parseInt(e.target.value) || 0)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {formatPrice(variation.priceChange)}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariation(actualIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Variaciones de Ingredientes */}
      {ingredientVariations.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Cookie className="h-4 w-4" />
            Variaciones de Ingredientes
          </h4>
          <div className="grid gap-3">
            {ingredientVariations.map((variation, index) => {
              const actualIndex = variations.findIndex(v => v === variation)
              return (
                <div key={actualIndex} className="p-3 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                    <Input
                      placeholder="Nombre de la variación"
                      value={variation.name}
                      onChange={(e) => updateVariation(actualIndex, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Cambio de precio"
                      value={variation.priceChange}
                      onChange={(e) => updateVariation(actualIndex, 'priceChange', parseInt(e.target.value) || 0)}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {formatPrice(variation.priceChange)}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariation(actualIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Descripción de la variación (opcional)"
                    value={variation.description || ''}
                    onChange={(e) => updateVariation(actualIndex, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Formulario para agregar nueva variación */}
      {showAddForm && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <h4 className="text-md font-medium text-gray-800 mb-3">Nueva Variación</h4>
          <div className="grid gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Variación
              </label>
              <select
                value={newVariation.type}
                onChange={(e) => setNewVariation({...newVariation, type: e.target.value as VariationType})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {Object.entries(VARIATION_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <Input
                  placeholder="Ej: Sin azúcar, 8 personas"
                  value={newVariation.name}
                  onChange={(e) => setNewVariation({...newVariation, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cambio de Precio (CLP)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newVariation.priceChange || ''}
                  onChange={(e) => setNewVariation({...newVariation, priceChange: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            {newVariation.type === VariationType.SIZE && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Personas
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 8"
                  value={newVariation.servingSize || ''}
                  onChange={(e) => setNewVariation({...newVariation, servingSize: parseInt(e.target.value) || undefined})}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <Textarea
                placeholder="Descripción adicional de la variación"
                value={newVariation.description || ''}
                onChange={(e) => setNewVariation({...newVariation, description: e.target.value})}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={addVariation}
                disabled={!newVariation.name}
              >
                Agregar Variación
              </Button>
            </div>
          </div>
        </div>
      )}

      {variations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Cookie className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No hay variaciones configuradas</p>
          <p className="text-sm">Agrega tamaños o variaciones de ingredientes para este producto</p>
        </div>
      )}
    </div>
  )
} 