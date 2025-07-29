import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Producto no encontrado
        </h1>
        
        <p className="text-gray-600 mb-8">
          Lo sentimos, el producto que buscas no existe o ya no está disponible.
        </p>
        
        <div className="space-y-4">
          <Link href="/productos">
            <Button className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ver todos los productos
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              Ir al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 