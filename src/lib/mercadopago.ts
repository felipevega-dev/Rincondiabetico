import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configuración de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc',
  }
})

export const preference = new Preference(client)

// Tipos para MercadoPago
export interface MercadoPagoItem {
  id: string
  title: string
  description?: string
  picture_url?: string
  category_id?: string
  quantity: number
  currency_id: string
  unit_price: number
}

export interface MercadoPagoPreferenceData {
  items: MercadoPagoItem[]
  payer?: {
    name?: string
    surname?: string
    email?: string
    phone?: {
      area_code?: string
      number?: string
    }
  }
  back_urls?: {
    success?: string
    failure?: string
    pending?: string
  }
  auto_return?: 'approved' | 'all'
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>
    excluded_payment_types?: Array<{ id: string }>
    installments?: number
  }
  notification_url?: string
  statement_descriptor?: string
  external_reference?: string
}

export { client as mercadoPagoClient } 