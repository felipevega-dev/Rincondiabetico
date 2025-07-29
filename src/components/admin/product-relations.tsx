'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Search } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category: {
    name: string
  }
}

interface ProductRelation {
  id: string
  relatedProduct: Product
  type: string
  order: number
}

interface ProductRelationsProps {
  productId: string
  productName: string
}

export function ProductRelations({ productId, productName }: ProductRelationsProps) {
  const [relations, setRelations] = useState<ProductRelation[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)

  const fetchRelations = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/relations`)
      if (response.ok) {
        const data = await response.json()
        setRelations(data.relations || [])
      }
    } catch (error) {
      console.error('Error fetching relations:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setAvailableProducts([])
      return
    }

    try {
      setSearchLoading(true)
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        // Filtrar productos que ya están relacionados y el producto actual
        const filteredProducts = data.products.filter((product: Product) => 
          product.id !== productId && 
          !relations.some(relation => relation.relatedProduct.id === product.id)
        )
        setAvailableProducts(filteredProducts)
      }
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const addRelation = async (relatedProductId: string) => {
    try {
      const response = await fetch('/api/admin/products/relations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceProductId: productId,
          relatedProductId,
          type: 'RELATED',
          order: relations.length
        })
      })

      if (response.ok) {
        fetchRelations()
        setSearchTerm('')
        setAvailableProducts([])
      }
    } catch (error) {
      console.error('Error adding relation:', error)
    }
  }

  const removeRelation = async (relationId: string) => {
    try {
      const response = await fetch(`/api/admin/products/relations/${relationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchRelations()
      }
    } catch (error) {
      console.error('Error removing relation:', error)
    }
  }

  useEffect(() => {
    fetchRelations()
  }, [productId])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, relations])

  if (loading) {
    return <div>Cargando relaciones...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Relacionados - {productName}</CardTitle>
        <p className="text-sm text-gray-600">
          Configura qué productos se mostrarán como relacionados en la página del producto
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Buscador para agregar productos */}
        <div>
          <h3 className="font-medium mb-3">Agregar Producto Relacionado</h3>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos para relacionar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Resultados de búsqueda */}
          {searchTerm && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {searchLoading ? (
                <div className="text-center py-4 text-gray-500">Buscando...</div>
              ) : availableProducts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm ? 'No se encontraron productos' : ''}
                </div>
              ) : (
                availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category.name}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addRelation(product.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Lista de productos relacionados */}
        <div>
          <h3 className="font-medium mb-3">Productos Relacionados Actuales</h3>
          
          {relations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay productos relacionados configurados.
              <br />
              Busca productos arriba para agregarlos.
            </div>
          ) : (
            <div className="space-y-3">
              {relations.map((relation) => (
                <div
                  key={relation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={relation.relatedProduct.images[0] || '/placeholder-product.jpg'}
                        alt={relation.relatedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{relation.relatedProduct.name}</h4>
                      <p className="text-sm text-gray-600">
                        {relation.relatedProduct.category.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{relation.type}</Badge>
                        <span className="text-xs text-gray-500">
                          Orden: {relation.order}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeRelation(relation.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}