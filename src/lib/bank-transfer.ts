// Datos bancarios de la tienda
export const BANK_ACCOUNT_DATA = {
  bank: 'Banco Estado',
  accountType: 'Cuenta Corriente',
  accountNumber: '12345678-9',
  rut: '12.345.678-9',
  name: 'Postres Pasmiño SpA',
  email: 'transferencias@rincondiabetico.cl'
}

export interface TransferInstructions {
  orderNumber: string
  total: number
  customerName: string
  reference: string
  qrData?: string
}

// Generar instrucciones de transferencia
export function generateTransferInstructions(data: TransferInstructions): {
  instructions: string[]
  reference: string
  qrData: string
} {
  const reference = `PP-${data.orderNumber}`
  
  const instructions = [
    '1️⃣ Abre tu app bancaria o sitio web del banco',
    '2️⃣ Selecciona "Transferir" o "Pagar"',
    '3️⃣ Ingresa los siguientes datos:',
    '',
    `🏦 Banco: ${BANK_ACCOUNT_DATA.bank}`,
    `💳 Tipo: ${BANK_ACCOUNT_DATA.accountType}`,
    `🔢 Cuenta: ${BANK_ACCOUNT_DATA.accountNumber}`,
    `🆔 RUT: ${BANK_ACCOUNT_DATA.rut}`,
    `👤 Nombre: ${BANK_ACCOUNT_DATA.name}`,
    '',
    `💰 Monto: $${data.total.toLocaleString('es-CL')}`,
    `📝 Referencia: ${reference}`,
    '',
    '4️⃣ Confirma la transferencia',
    '5️⃣ Guarda el comprobante',
    '6️⃣ Envía el comprobante por WhatsApp'
  ]

  // Datos para QR (formato simple)
  const qrData = `BANCO:${BANK_ACCOUNT_DATA.bank}|CUENTA:${BANK_ACCOUNT_DATA.accountNumber}|RUT:${BANK_ACCOUNT_DATA.rut}|MONTO:${data.total}|REF:${reference}`

  return {
    instructions,
    reference,
    qrData
  }
}

// Generar mensaje para WhatsApp con comprobante
export function generateTransferWhatsAppMessage(data: TransferInstructions): string {
  const reference = `PP-${data.orderNumber}`
  
  return `💳 *Comprobante de Transferencia*

Hola! He realizado la transferencia para mi pedido:

📋 *Pedido:* ${data.orderNumber}
👤 *Cliente:* ${data.customerName}
💰 *Monto:* $${data.total.toLocaleString('es-CL')}
📝 *Referencia:* ${reference}

📄 Adjunto el comprobante de transferencia.

¿Podrían confirmar que recibieron el pago?

¡Gracias! 😊`
}

// Validar formato de comprobante
export function validateTransferProof(file: File): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  if (!validTypes.includes(file.type)) {
    errors.push('Formato no válido. Usa JPG, PNG o PDF')
  }
  
  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    errors.push('Archivo muy grande. Máximo 5MB')
  }
  
  // Validar nombre del archivo
  if (file.name.length < 3) {
    errors.push('Nombre de archivo muy corto')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Estados de transferencia
export const TRANSFER_STATUS = {
  PENDING: 'PENDIENTE',
  PROOF_UPLOADED: 'COMPROBANTE_SUBIDO', 
  VERIFIED: 'VERIFICADO',
  REJECTED: 'RECHAZADO'
} as const

export type TransferStatus = typeof TRANSFER_STATUS[keyof typeof TRANSFER_STATUS]

// Generar código QR simple para datos bancarios
export function generateBankQRText(): string {
  return `Banco: ${BANK_ACCOUNT_DATA.bank}
Cuenta: ${BANK_ACCOUNT_DATA.accountNumber}
RUT: ${BANK_ACCOUNT_DATA.rut}
Titular: ${BANK_ACCOUNT_DATA.name}`
} 