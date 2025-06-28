import { NextRequest, NextResponse } from 'next/server'
import { preference, MercadoPagoPreferenceData } from '@/lib/mercadopago'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { items, customerInfo, orderId } = body

    // Validar que los items existen y tienen stock
    const productIds = items.map((item: any) => item.id)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        isAvailable: true
      }
    })

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Algunos productos no están disponibles' }, { status: 400 })
    }

    // Verificar stock
    for (const item of items) {
      const product = products.find(p => p.id === item.id)
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Stock insuficiente para ${product?.name || 'producto'}` 
        }, { status: 400 })
      }
    }

    // Preparar items para MercadoPago
    const mpItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.id)!
      return {
        id: item.id,
        title: product.name,
        description: product.description || undefined,
        picture_url: product.images[0] || undefined,
        category_id: 'food',
        quantity: item.quantity,
        currency_id: 'CLP',
        unit_price: product.price
      }
    })

    // Configurar preferencia de pago
    const preferenceData: MercadoPagoPreferenceData = {
      items: mpItems,
      payer: {
        name: customerInfo?.firstName || user.firstName || '',
        surname: customerInfo?.lastName || user.lastName || '',
        email: customerInfo?.email || user.emailAddresses[0]?.emailAddress || '',
        phone: customerInfo?.phone ? {
          area_code: '56',
          number: customerInfo.phone.replace(/\D/g, '')
        } : undefined
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
      statement_descriptor: 'Postres Pasmiño',
      external_reference: orderId || `order_${Date.now()}`
    }

    // Crear preferencia en MercadoPago
    const response = await preference.create({ body: preferenceData })

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    })

  } catch (error) {
    console.error('Error creating MercadoPago preference:', error)
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    )
  }
} 