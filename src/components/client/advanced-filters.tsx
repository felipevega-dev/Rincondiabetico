'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Filter, X, Search, DollarSign, Package } from 'lucide-react'

interface FilterState {
  search: string
  minPrice: string
  maxPrice: string
  categoryId: string
  inStock: boolean
  sortBy: string
}

interface Category {
  id: string
  name: string
}

interface AdvancedFiltersProps {
  categories: Category[]
  className?: string
}

export function AdvancedFilters({ categories, className }: AdvancedFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    categoryId: searchParams.get('categoryId') || '',
    inStock: searchParams.get('inStock') === 'true',
    sortBy: searchParams.get('sortBy') || 'newest'
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Check if there are active filters
  useEffect(() => {
    const active = !!(
      filters.search ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.categoryId ||
      filters.inStock ||
      filters.sortBy !== 'newest'
    )
    setHasActiveFilters(active)
  }, [filters])

  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Update URL
    const params = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'newest' && v !== false && v !== '') {
        params.set(k, v.toString())
      }
    })
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      minPrice: '',
      maxPrice: '',
      categoryId: '',
      inStock: false,
      sortBy: 'newest'
    }
    setFilters(clearedFilters)
    router.push(pathname)
  }

  const priceRanges = [
    { label: 'Todos los precios', min: '', max: '' },
    { label: 'Hasta $5.000', min: '', max: '5000' },
    { label: '$5.000 - $10.000', min: '5000', max: '10000' },
    { label: '$10.000 - $20.000', min: '10000', max: '20000' },
    { label: '$20.000 - $50.000', min: '20000', max: '50000' },
    { label: 'Más de $50.000', min: '50000', max: '' },
  ]

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.categoryId) count++
    if (filters.inStock) count++
    if (filters.sortBy !== 'newest') count++
    return count
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Menos' : 'Más'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Categoría
          </label>
          <Select
            value={filters.categoryId}
            onValueChange={(value) => updateFilter('categoryId', value)}
            options={[
              { value: '', label: 'Todas las categorías' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
          />
        </div>

        {isExpanded && (
          <>
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Rango de precios
              </label>
              <div className="space-y-2">
                {priceRanges.map((range, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                      onChange={() => {
                        updateFilter('minPrice', range.min)
                        updateFilter('maxPrice', range.max)
                      }}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-600">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Price Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Precio personalizado
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {(filters.minPrice || filters.maxPrice) && (
                <p className="text-xs text-gray-500 mt-1">
                  {filters.minPrice && filters.maxPrice 
                    ? `Entre ${formatPrice(parseInt(filters.minPrice))} y ${formatPrice(parseInt(filters.maxPrice))}`
                    : filters.minPrice 
                    ? `Desde ${formatPrice(parseInt(filters.minPrice))}`
                    : `Hasta ${formatPrice(parseInt(filters.maxPrice))}`
                  }
                </p>
              )}
            </div>

            {/* Stock Filter */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Solo productos en stock
                </span>
              </label>
            </div>
          </>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  Búsqueda: "{filters.search}"
                  <button onClick={() => updateFilter('search', '')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.categoryId && (
                <Badge variant="outline" className="gap-1">
                  {categories.find(c => c.id === filters.categoryId)?.name}
                  <button onClick={() => updateFilter('categoryId', '')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="outline" className="gap-1">
                  {filters.minPrice && filters.maxPrice 
                    ? `${formatPrice(parseInt(filters.minPrice))} - ${formatPrice(parseInt(filters.maxPrice))}`
                    : filters.minPrice 
                    ? `Desde ${formatPrice(parseInt(filters.minPrice))}`
                    : `Hasta ${formatPrice(parseInt(filters.maxPrice))}`
                  }
                  <button onClick={() => {
                    updateFilter('minPrice', '')
                    updateFilter('maxPrice', '')
                  }}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="outline" className="gap-1">
                  En stock
                  <button onClick={() => updateFilter('inStock', false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}