import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { uploadProductImage, uploadMultipleImages } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener FormData
    const formData = await request.formData()
    
    // Intentar obtener archivos con diferentes nombres de campo
    let files = formData.getAll('files') as File[]
    if (!files || files.length === 0) {
      files = formData.getAll('file') as File[]
    }
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 })
    }

    // Subir archivo(s)
    let results
    if (files.length === 1) {
      results = [await uploadProductImage(files[0])]
    } else {
      results = await uploadMultipleImages(files)
    }

    // Verificar si hubo errores
    const errors = results.filter(r => !r.success)
    if (errors.length > 0) {
      return NextResponse.json({ 
        error: 'Error en algunos archivos',
        details: errors 
      }, { status: 400 })
    }

    // Retornar URLs exitosas
    const urls = results.map(r => r.url).filter(Boolean)
    
    // Para un solo archivo, retornar directamente la URL
    if (urls.length === 1) {
      return NextResponse.json({ 
        success: true,
        url: urls[0]
      })
    }
    
    // Para múltiples archivos, retornar array
    return NextResponse.json({ 
      success: true,
      urls: urls
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 