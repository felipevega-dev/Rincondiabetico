'use client'

import { Select } from '@/components/ui/select'

interface ProductsSortProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

const sortOptions = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguos' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
  { value: 'price-asc', label: 'Precio: Menor a mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a menor' },
]

export function ProductsSort({ value, onValueChange, className }: ProductsSortProps) {
  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={onValueChange}
        options={sortOptions}
        placeholder="Ordenar por..."
        className="w-48"
      />
    </div>
  )
}