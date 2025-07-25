'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  generateTransferInstructions, 
  generateTransferWhatsAppMessage,
  generateBankQRText,
  BANK_ACCOUNT_DATA,
  TransferInstructions 
} from '@/lib/bank-transfer'
import { generateWhatsAppURL } from '@/lib/whatsapp'
import QRCode from 'qrcode'

interface BankTransferProps {
  orderNumber: string
  total: number
  customerName: string
  onTransferInitiated?: () => void
}

export default function BankTransfer({ 
  orderNumber, 
  total, 
  customerName, 
  onTransferInitiated 
}: BankTransferProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [showInstructions, setShowInstructions] = useState(false)
  const [copied, setCopied] = useState<string>('')

  const transferData: TransferInstructions = {
    orderNumber,
    total,
    customerName,
    reference: `PP-${orderNumber}`
  }

  const { instructions, reference } = generateTransferInstructions(transferData)

  // Generar QR Code
  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrText = generateBankQRText()
        const url = await QRCode.toDataURL(qrText, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeUrl(url)
      } catch (error) {
        console.error('Error generando QR:', error)
      }
    }

    generateQR()
  }, [])

  // Copiar al portapapeles
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch (error) {
      console.error('Error copiando:', error)
    }
  }

  // Enviar comprobante por WhatsApp
  const sendProofViaWhatsApp = () => {
    const message = generateTransferWhatsAppMessage(transferData)
    const whatsappUrl = generateWhatsAppURL(message)
    window.open(whatsappUrl, '_blank')
    onTransferInitiated?.()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          💳 Transferencia Bancaria
        </h2>
        <p className="text-gray-600">
          Realiza tu pago de forma segura y rápida
        </p>
      </div>

      {/* Resumen del pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Resumen del Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Pedido:</span>
              <span className="font-medium">#{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Referencia:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{reference}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(reference, 'reference')}
                  className="h-6 px-2"
                >
                  {copied === 'reference' ? '✓' : '📋'}
                </Button>
              </div>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total a pagar:</span>
              <span className="text-green-600">${total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos bancarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏦 Datos Bancarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Datos de la cuenta */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Banco:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{BANK_ACCOUNT_DATA.bank}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(BANK_ACCOUNT_DATA.bank, 'bank')}
                    className="h-6 px-2"
                  >
                    {copied === 'bank' ? '✓' : '📋'}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">{BANK_ACCOUNT_DATA.accountType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cuenta:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{BANK_ACCOUNT_DATA.accountNumber}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(BANK_ACCOUNT_DATA.accountNumber, 'account')}
                    className="h-6 px-2"
                  >
                    {copied === 'account' ? '✓' : '📋'}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">RUT:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{BANK_ACCOUNT_DATA.rut}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(BANK_ACCOUNT_DATA.rut, 'rut')}
                    className="h-6 px-2"
                  >
                    {copied === 'rut' ? '✓' : '📋'}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Titular:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{BANK_ACCOUNT_DATA.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(BANK_ACCOUNT_DATA.name, 'name')}
                    className="h-6 px-2"
                  >
                    {copied === 'name' ? '✓' : '📋'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Código QR */}
            {qrCodeUrl && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  📱 Escanea con tu app bancaria
                </p>
                <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Datos Bancarios" 
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Código QR con datos bancarios
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones paso a paso */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <span className="flex items-center gap-2">
              📝 Instrucciones Paso a Paso
            </span>
            <span className="text-lg">
              {showInstructions ? '▼' : '▶'}
            </span>
          </CardTitle>
        </CardHeader>
        {showInstructions && (
          <CardContent>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  {instruction.trim() && (
                    <span className="text-gray-700 leading-relaxed">
                      {instruction}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Acciones */}
      <div className="space-y-3">
        <Button
          onClick={sendProofViaWhatsApp}
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          📱 Enviar Comprobante por WhatsApp
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Después de transferir, envía tu comprobante por WhatsApp
          </p>
        </div>
      </div>

      {/* Alertas importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">
          ⚠️ Importante:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Usa exactamente la referencia: <strong>{reference}</strong></li>
          <li>• Envía el comprobante por WhatsApp</li>
          <li>• Tu pedido se confirmará al verificar el pago</li>
          <li>• Tiempo de verificación: 2-6 horas hábiles</li>
        </ul>
      </div>
    </div>
  )
}
