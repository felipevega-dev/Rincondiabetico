'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, GripVertical, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SortableImageListProps {
  images: string[]
  onReorder: (newOrder: string[]) => void
  onRemove: (index: number) => void
  title: string
}

export function SortableImageList({
  images,
  onReorder,
  onRemove,
  title
}: SortableImageListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]
    
    // Remover el elemento arrastrado
    newImages.splice(draggedIndex, 1)
    
    // Insertar en la nueva posición
    newImages.splice(dropIndex, 0, draggedItem)
    
    onReorder(newImages)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp
    onReorder(newImages)
  }

  const moveDown = (index: number) => {
    if (index === images.length - 1) return
    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp
    onReorder(newImages)
  }

  if (images.length === 0) return null

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {title}
      </label>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-xs text-gray-600 mb-3 flex items-center gap-2">
          <Star className="h-3 w-3 text-yellow-500" />
          La primera imagen será la principal en el collage
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${
                draggedIndex === index 
                  ? 'opacity-50 scale-95 border-blue-300' 
                  : dragOverIndex === index 
                    ? 'border-blue-400 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Imagen principal badge */}
              {index === 0 && (
                <div className="absolute -top-2 -left-2 z-10 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                  <Star className="h-3 w-3 inline mr-1" />
                  Principal
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm rounded p-1 cursor-grab active:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-gray-600" />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs shadow-md"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Image */}
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Position controls */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="h-6 w-6 p-0 bg-white/80 backdrop-blur-sm"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => moveDown(index)}
                  disabled={index === images.length - 1}
                  className="h-6 w-6 p-0 bg-white/80 backdrop-blur-sm"
                >
                  ↓
                </Button>
              </div>

              {/* Order indicator */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs text-gray-500">
          💡 Arrastra las imágenes para reordenarlas o usa los botones ↑↓
        </div>
      </div>
    </div>
  )
} 