'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewCouponPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'PRODUCT_SPECIFIC',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    maxUses: '',
    maxUsesPerUser: '',
    validFrom: '',
    validUntil: '',
    isStackable: false,
    isPublic: true,
    autoApply: false,
    applicableProductIds: [] as string[],
    applicableCategoryIds: [] as string[]
  })

  useEffect(() => {
    // Cargar productos y categorías para el formulario
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])
        
        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData.products || [])
        }
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData || [])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    
    fetchData()
  }, [])

  // Generar código automático
  const generateCode = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
    setFormData(prev => ({ ...prev, code: `CUPON${randomString}` }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Preparar datos para enviar
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        maxUsesPerUser: formData.maxUsesPerUser ? parseInt(formData.maxUsesPerUser) : null,
        validFrom: formData.validFrom || new Date().toISOString(),
        validUntil: formData.validUntil || null
      }

      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        toast.success('Cupón creado exitosamente')
        router.push('/admin/coupons')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear cupón')
      }
    } catch (error) {
      console.error('Error creating coupon:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear cupón')
    } finally {
      setLoading(false)
    }
  }

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableProductIds: prev.applicableProductIds.includes(productId)
        ? prev.applicableProductIds.filter(id => id !== productId)
        : [...prev.applicableProductIds, productId]
    }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableCategoryIds: prev.applicableCategoryIds.includes(categoryId)
        ? prev.applicableCategoryIds.filter(id => id !== categoryId)
        : [...prev.applicableCategoryIds, categoryId]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Crear Nuevo Cupón</h1>
          <p className="text-gray-600">Configura un nuevo cupón de descuento</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/coupons">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a cupones
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Básica */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Código del Cupón *
                    </label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="CUPONXX"
                        required
                        className="font-mono"
                      />
                      <Button type="button" onClick={generateCode} variant="outline">
                        Generar
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tipo de Cupón *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    >
                      <option value="PERCENTAGE">Porcentaje (%)</option>
                      <option value="FIXED_AMOUNT">Monto Fijo (CLP)</option>
                      <option value="FREE_SHIPPING">Envío Gratis</option>
                      <option value="PRODUCT_SPECIFIC">Producto Específico</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nombre del Cupón *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Descuento de Bienvenida"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción opcional del cupón"
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuración de Descuento */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Descuento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Valor del Descuento *
                    </label>
                    <Input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                      placeholder={formData.type === 'PERCENTAGE' ? '20' : '5000'}
                      required
                      min="1"
                      step={formData.type === 'PERCENTAGE' ? '1' : '100'}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.type === 'PERCENTAGE' ? 'Porcentaje (1-100)' : 'Monto en CLP'}
                    </p>
                  </div>

                  {formData.type === 'PERCENTAGE' && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Descuento Máximo (CLP)
                      </label>
                      <Input
                        type="number"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
                        placeholder="10000"
                        min="100"
                        step="100"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Opcional: límite máximo del descuento
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Monto Mínimo de Pedido (CLP)
                  </label>
                  <Input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                    placeholder="20000"
                    min="100"
                    step="100"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Restricciones de Uso */}
            <Card>
              <CardHeader>
                <CardTitle>Restricciones de Uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Máximo Total de Usos
                    </label>
                    <Input
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                      placeholder="100"
                      min="1"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Opcional: límite total de usos
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Máximo Usos por Usuario
                    </label>
                    <Input
                      type="number"
                      value={formData.maxUsesPerUser}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxUsesPerUser: e.target.value }))}
                      placeholder="1"
                      min="1"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Válido Desde
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.validFrom}
                      onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Válido Hasta
                    </label>
                    <Input
                      type="datetime-local"
                      value={formData.validUntil}
                      onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productos y Categorías Aplicables */}
            {formData.type === 'PRODUCT_SPECIFIC' && (
              <Card>
                <CardHeader>
                  <CardTitle>Productos y Categorías Aplicables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Productos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {products.map((product) => (
                        <label key={product.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.applicableProductIds.includes(product.id)}
                            onChange={() => handleProductToggle(product.id)}
                            className="rounded"
                          />
                          <span className="text-sm">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Categorías</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.applicableCategoryIds.includes(category.id)}
                            onChange={() => handleCategoryToggle(category.id)}
                            className="rounded"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Configuración Lateral */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado y Opciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isStackable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isStackable: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Combinable con otros cupones</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Visible públicamente</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.autoApply}
                      onChange={(e) => setFormData(prev => ({ ...prev, autoApply: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Aplicar automáticamente</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-pink-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {formData.code || 'CODIGO'}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {formData.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {formData.name || 'Nombre del cupón'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.description || 'Descripción del cupón'}
                  </p>
                  <p className="text-sm font-medium">
                    Descuento: {formData.type === 'PERCENTAGE' ? `${formData.discountValue || '0'}%` : `$${Number(formData.discountValue || '0').toLocaleString('es-CL')}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/coupons">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creando...' : 'Crear Cupón'}
          </Button>
        </div>
      </form>
    </div>
  )
}