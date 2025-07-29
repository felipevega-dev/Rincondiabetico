import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'

// GET - Verificar si producto está en wishlist
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ isInWishlist: false })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID es requerido' }, { status: 400 })
    }

    const dbUser = await getOrCreateUser()
    if (!dbUser) {
      return NextResponse.json({ isInWishlist: false })
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: dbUser.id,
          productId
        }
      }
    })

    return NextResponse.json({
      isInWishlist: !!wishlistItem,
      itemId: wishlistItem?.id || null
    })
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return NextResponse.json({ isInWishlist: false })
  }
}