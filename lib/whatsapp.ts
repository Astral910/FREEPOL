import twilio from 'twilio'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Cliente de Twilio para enviar mensajes por WhatsApp Sandbox.
 * En producción se usa el mismo número pero con cuenta aprobada de WhatsApp Business.
 */
const getClient = () =>
  twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!,
  )

/**
 * Normaliza un número de teléfono al formato requerido por Twilio.
 * Agrega prefijo +502 (Guatemala) si no tiene código de país.
 * Agrega prefijo whatsapp: si no lo tiene.
 */
function normalizarTelefono(telefono: string): string {
  let numero = telefono.trim()

  // Quitar prefijo whatsapp: si ya lo tiene (lo volvemos a agregar al final limpiamente)
  if (numero.startsWith('whatsapp:')) {
    numero = numero.replace('whatsapp:', '')
  }

  // Quitar espacios y guiones internos
  numero = numero.replace(/[\s\-\(\)]/g, '')

  // Si no empieza con +, asumir Guatemala (+502)
  if (!numero.startsWith('+')) {
    numero = '+502' + numero
  }

  return `whatsapp:${numero}`
}

/**
 * Envía un mensaje de texto plano por WhatsApp.
 * Base de todas las demás funciones de esta librería.
 */
export async function enviarMensajeWhatsApp(
  destinatario: string,
  mensaje: string,
): Promise<boolean> {
  try {
    const from = process.env.TWILIO_WHATSAPP_NUMBER
    if (!from || !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.warn('[whatsapp] Credenciales de Twilio no configuradas — mensaje omitido')
      return false
    }

    const client = getClient()
    await client.messages.create({
      from,
      to: destinatario,
      body: mensaje,
    })

    console.log(`[whatsapp] Mensaje enviado a ${destinatario}`)
    return true
  } catch (error) {
    console.error('[whatsapp] Error enviando mensaje:', error)
    return false
  }
}

/**
 * Envía el código de premio ganado al WhatsApp del participante.
 * Se llama desde /api/girar-ruleta y /api/generar-codigo.
 */
export async function enviarCodigoPorWhatsApp(
  telefono: string,
  datos: {
    nombre_negocio: string
    nombre_campana: string
    premio: string
    codigo: string
    expira_en: string
  },
): Promise<boolean> {
  const destinatario = normalizarTelefono(telefono)

  // Formatear fecha de expiración en español
  let fechaFormateada = datos.expira_en
  try {
    fechaFormateada = format(new Date(datos.expira_en), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })
  } catch {
    fechaFormateada = datos.expira_en
  }

  const mensaje = `🎉 *¡Felicitaciones!*

Ganaste en *${datos.nombre_campana}* de ${datos.nombre_negocio}

🏆 Premio: ${datos.premio}
🎟️ Tu código: *${datos.codigo}*
⏰ Válido hasta: ${fechaFormateada}

Muestra este código en caja al momento del canje.

_Powered by FREEPOL_`

  return enviarMensajeWhatsApp(destinatario, mensaje)
}

/**
 * Envía un mensaje de bienvenida cuando el participante se registra
 * en una campaña con condición de teléfono.
 */
export async function enviarBienvenidaWhatsApp(
  telefono: string,
  datos: {
    nombre_negocio: string
    nombre_campana: string
    url_campana: string
    mensaje_bienvenida: string
  },
): Promise<boolean> {
  const destinatario = normalizarTelefono(telefono)

  const mensaje = `👋 ¡Hola! Te registraste en *${datos.nombre_campana}*
de *${datos.nombre_negocio}*

${datos.mensaje_bienvenida}

🔗 Participa aquí: ${datos.url_campana}

_Powered by FREEPOL_`

  return enviarMensajeWhatsApp(destinatario, mensaje)
}
