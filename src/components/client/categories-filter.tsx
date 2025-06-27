'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  _count: {
    products: number
  }
}

export function CategoriesFilter() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategoryId = searchParams.get('categoryId')
  const currentSearch = searchParams.get('search')

  useEffect(() => {
    fetchCategories()
    if (currentSearch) {
      setSearchInput(currentSearch)
    }
  }, [currentSearch])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams)
    
    if (categoryId) {
      params.set('categoryId', categoryId)
    } else {
      params.delete('categoryId')
    }
    
    router.push(`/productos?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    
    if (searchInput.trim()) {
      params.set('search', searchInput.trim())
    } else {
      params.delete('search')
    }
    
    router.push(`/productos?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchInput('')
    router.push('/productos')
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Buscar</h3>
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button type="submit" className="w-full" size="sm">
            Buscar
          </Button>
        </form>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Categorías</h3>
          {(currentCategoryId || currentSearch) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* All products */}
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                !currentCategoryId
                  ? 'bg-pink-100 text-pink-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Todos los productos</span>
                <span className="text-sm text-gray-500">
                  {categories.reduce((total, cat) => total + cat._count.products, 0)}
                </span>
              </div>
            </button>

            {/* Category filters */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentCategoryId === category.id
                    ? 'bg-pink-100 text-pink-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">
                    {category._count.products}
                  </span>
                </div>
              </button>
            ))}

            {categories.length === 0 && (
              <p className="text-gray-500 text-sm py-4 text-center">
                No hay categorías disponibles
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 