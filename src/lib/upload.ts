import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

// Tipos permitidos para imágenes
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export async function uploadProductImage(file: File): Promise<UploadResult> {
  try {
    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Tipo de archivo no permitido. Solo se permiten: JPG, JPEG, PNG, WEBP'
      }
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'El archivo es demasiado grande. Máximo 5MB'
      }
    }

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
    await mkdir(uploadDir, { recursive: true })

    // Generar nombre único
    const extension = file.name.split('.').pop()
    const filename = `${randomUUID()}.${extension}`
    const filepath = join(uploadDir, filename)

    // Convertir archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Retornar URL pública
    const publicUrl = `/uploads/products/${filename}`
    
    return {
      success: true,
      url: publicUrl
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function uploadMultipleImages(files: File[]): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map(file => uploadProductImage(file))
  )
  
  return results
}

// Función para eliminar imagen (para cuando se edita/elimina producto)
export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl.startsWith('/uploads/products/')) {
      return false
    }
    
    const filename = imageUrl.split('/').pop()
    if (!filename) return false
    
    const filepath = join(process.cwd(), 'public', 'uploads', 'products', filename)
    
    // Intentar eliminar archivo
    const { unlink } = await import('fs/promises')
    await unlink(filepath)
    
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
} 