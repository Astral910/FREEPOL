import { NextRequest, NextResponse } from 'next/server'
import { enviarMensajeWhatsApp } from '@/lib/whatsapp'

/**
 * Endpoint de prueba para verificar que la integración de WhatsApp funciona.
 * SOLO disponible en entorno de desarrollo — bloqueado en producción.
 *
 * Uso: GET /api/test-whatsapp?telefono=50249135546
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Endpoint no disponible en producción' },
      { status: 403 },
    )
  }

  const { searchParams } = new URL(request.url)
  const telefonoRaw = searchParams.get('telefono')

  if (!telefonoRaw) {
    return NextResponse.json(
      { error: 'Parámetro "telefono" requerido. Ej: ?telefono=50249135546' },
      { status: 400 },
    )
  }

  // Normalizar el número al formato Twilio
  let telefono = telefonoRaw.trim().replace(/[\s\-\(\)]/g, '')
  if (!telefono.startsWith('+')) telefono = '+502' + telefono
  const destinatario = `whatsapp:${telefono}`

  const mensaje = `✅ *FREEPOL WhatsApp funcionando correctamente!*\n\nEste es un mensaje de prueba enviado desde el servidor de desarrollo.\n\n🚀 Proyecto: FREEPOL\n🌐 URL: ${process.env.NEXT_PUBLIC_APP_URL}\n\n_Powered by FREEPOL_`

  const enviado = await enviarMensajeWhatsApp(destinatario, mensaje)

  return NextResponse.json({
    enviado,
    destinatario,
    mensaje: enviado
      ? `Mensaje enviado exitosamente a ${destinatario}`
      : 'Error al enviar. Revisa TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN y TWILIO_WHATSAPP_NUMBER en .env.local',
  })
}
