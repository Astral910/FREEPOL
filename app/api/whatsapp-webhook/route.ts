import { NextRequest, NextResponse } from 'next/server'
import { twiml } from 'twilio'
import { createServerClient } from '@/lib/supabase-server'
import { generarCodigoUnico, generarHash, calcularExpiracion } from '@/lib/codigos'
import type { ConfigCampana } from '@/types/campana'

/**
 * Webhook que recibe mensajes entrantes de WhatsApp via Twilio Sandbox.
 * Configurar en Twilio Console → Messaging → WhatsApp Sandbox Settings
 * → "When a message comes in" → POST https://freepol.vercel.app/api/whatsapp-webhook
 *
 * Twilio envía el body como application/x-www-form-urlencoded.
 */
export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  // Twilio envía los datos como form-urlencoded
  const formData = await request.formData()
  const from = (formData.get('From') as string) ?? ''
  const body = ((formData.get('Body') as string) ?? '').trim()
  const profileName = ((formData.get('ProfileName') as string) ?? 'amigo')

  // Limpiar número: quitar 'whatsapp:' para buscar en BD
  const telefono = from.replace('whatsapp:', '')
  const mensajeLower = body.toLowerCase()

  let respuesta = ''

  try {
    // --- SALUDAR / INICIO ---
    if (
      mensajeLower.includes('hola') ||
      mensajeLower.includes('inicio') ||
      mensajeLower.includes('start') ||
      mensajeLower === 'hi' ||
      mensajeLower === 'hey'
    ) {
      const { data: campanas } = await supabase
        .from('campanas')
        .select('id, nombre_negocio, nombre_campana, tipo')
        .eq('estado', 'activa')
        .order('creado_en', { ascending: false })
        .limit(3)

      if (!campanas || campanas.length === 0) {
        respuesta = `👋 Hola ${profileName}! Bienvenido a *FREEPOL*\n\nNo hay campañas activas en este momento. Te avisaremos cuando haya una nueva. 🔔`
      } else {
        const lista = campanas
          .map((c, i) => `${['1️⃣', '2️⃣', '3️⃣'][i]} *${c.nombre_campana}* de ${c.nombre_negocio}`)
          .join('\n')

        respuesta = `👋 Hola ${profileName}! Bienvenido a *FREEPOL* 🎯\n\n📋 *Campañas activas ahora:*\n${lista}\n\nResponde con el número para participar.\nEscribe *mis puntos* para ver tu saldo.`
      }
    }

    // --- VER PUNTOS ---
    else if (
      mensajeLower.includes('mis puntos') ||
      mensajeLower.includes('saldo') ||
      mensajeLower === 'puntos'
    ) {
      // Buscar participante por teléfono
      const { data: participante } = await supabase
        .from('participantes')
        .select('id, campana_id')
        .eq('telefono', telefono)
        .order('creado_en', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!participante) {
        respuesta = `No tienes puntos acumulados todavía.\nEscribe *hola* para ver las campañas disponibles. 🎯`
      } else {
        const { data: puntos } = await supabase
          .from('puntos_participantes')
          .select('total_puntos, campana_id')
          .eq('participante_id', participante.id)
          .maybeSingle()

        const { data: campana } = await supabase
          .from('campanas')
          .select('nombre_campana, configuracion')
          .eq('id', participante.campana_id)
          .maybeSingle()

        const totalPuntos = puntos?.total_puntos ?? 0
        const cfg = (campana?.configuracion ?? {}) as ConfigCampana
        const meta = cfg.meta_canje ?? 0
        const faltan = Math.max(0, meta - totalPuntos)

        respuesta = `⭐ *Tu saldo de puntos*\n\n📊 ${campana?.nombre_campana ?? 'Campaña'}: *${totalPuntos} puntos*\n🎯 Meta: ${meta} puntos\n📈 Te faltan: ${faltan} puntos\n\nEscribe *canjear* cuando tengas suficientes. 💪`
      }
    }

    // --- CANJEAR PUNTOS ---
    else if (mensajeLower === 'canjear' || mensajeLower.includes('canjear')) {
      const { data: participante } = await supabase
        .from('participantes')
        .select('id, campana_id')
        .eq('telefono', telefono)
        .order('creado_en', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!participante) {
        respuesta = `No estás registrado en ninguna campaña.\nEscribe *hola* para ver las disponibles. 🎯`
      } else {
        const { data: puntos } = await supabase
          .from('puntos_participantes')
          .select('total_puntos')
          .eq('participante_id', participante.id)
          .maybeSingle()

        const { data: campana } = await supabase
          .from('campanas')
          .select('nombre_negocio, nombre_campana, configuracion, total_canjes')
          .eq('id', participante.campana_id)
          .maybeSingle()

        if (!campana || !puntos) {
          respuesta = `No tienes puntos acumulados todavía.\nSigue comprando y enviando tus facturas. 💪`
        } else {
          const cfg = campana.configuracion as ConfigCampana
          const meta = cfg.meta_canje ?? 0

          if (puntos.total_puntos < meta) {
            const faltan = meta - puntos.total_puntos
            respuesta = `Aún no tienes suficientes puntos para canjear.\n\n⭐ Tienes: *${puntos.total_puntos} puntos*\n🎯 Necesitas: *${meta} puntos*\n📈 Te faltan: *${faltan} puntos*\n\nSigue comprando y enviando tus facturas. 💪`
          } else {
            // Generar código de canje
            const prefijo = campana.nombre_negocio.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase()
            const codigo = generarCodigoUnico(prefijo)
            const hash = generarHash(codigo)
            const expira_en = calcularExpiracion(cfg.horas_expiracion_codigo || 24)
            const premio = cfg.premios?.[0]?.nombre ?? `$${cfg.meta_canje} de descuento`

            // Guardar código en Supabase
            await supabase.from('codigos').insert({
              participante_id: participante.id,
              campana_id: participante.campana_id,
              codigo,
              hash_verificacion: hash,
              premio,
              expira_en: expira_en.toISOString(),
            })

            // Restar puntos canjeados
            await supabase
              .from('puntos_participantes')
              .update({ total_puntos: puntos.total_puntos - meta })
              .eq('participante_id', participante.id)

            // Incrementar total_canjes
            await supabase
              .from('campanas')
              .update({ total_canjes: (campana.total_canjes ?? 0) + 1 })
              .eq('id', participante.campana_id)

            respuesta = `🎉 *¡Premio canjeado!*\n\n🏆 Premio: ${premio}\n🎟️ Tu código: *${codigo}*\n⏰ Válido 24 horas\n\nMuestra este código en caja 🏪\n\n_Powered by FREEPOL_`
          }
        }
      }
    }

    // --- SELECCIONAR CAMPAÑA (número 1, 2 o 3) ---
    else if (['1', '2', '3'].includes(body.trim())) {
      const indice = parseInt(body.trim()) - 1

      const { data: campanas } = await supabase
        .from('campanas')
        .select('id, nombre_negocio, nombre_campana, slug, tipo, configuracion')
        .eq('estado', 'activa')
        .order('creado_en', { ascending: false })
        .limit(3)

      const campanaSeleccionada = campanas?.[indice]

      if (!campanaSeleccionada) {
        respuesta = `No encontré esa campaña. Escribe *hola* para ver la lista actual. 🎯`
      } else {
        const cfg = campanaSeleccionada.configuracion as ConfigCampana

        // Verificar si ya está registrado
        const { data: existente } = await supabase
          .from('participantes')
          .select('id')
          .eq('campana_id', campanaSeleccionada.id)
          .eq('telefono', telefono)
          .maybeSingle()

        if (!existente) {
          // Registrar participante con teléfono
          await supabase.from('participantes').insert({
            campana_id: campanaSeleccionada.id,
            telefono,
            ip_address: 'whatsapp',
          })

          // Incrementar contador de participantes
          const { data: campActual } = await supabase
            .from('campanas')
            .select('total_participantes')
            .eq('id', campanaSeleccionada.id)
            .maybeSingle()
          if (campActual) {
            await supabase
              .from('campanas')
              .update({ total_participantes: (campActual.total_participantes ?? 0) + 1 })
              .eq('id', campanaSeleccionada.id)
          }
        }

        const urlCampana = `${process.env.NEXT_PUBLIC_APP_URL}/c/${campanaSeleccionada.slug}`

        if (campanaSeleccionada.tipo === 'puntos' || campanaSeleccionada.tipo === 'factura') {
          respuesta = `⭐ *${campanaSeleccionada.nombre_campana}* de ${campanaSeleccionada.nombre_negocio}\n\n¡Registrado! Por cada $${cfg.monto_base} de compra ganas ${cfg.puntos_por_monto} punto(s).\n\n📸 *Para acumular puntos:*\nEnvíame una foto de tu factura aquí mismo.\n\n🎯 Meta: ${cfg.meta_canje} puntos = ${cfg.premios?.[0]?.nombre ?? 'premio'}\n\n🔗 También puedes participar en: ${urlCampana}`
        } else {
          respuesta = `🎰 *${campanaSeleccionada.nombre_campana}* de ${campanaSeleccionada.nombre_negocio}\n\n¡Estás registrado! Toca el link para participar:\n\n🔗 ${urlCampana}\n\nBuena suerte! 🍀`
        }
      }
    }

    // --- MENSAJE NO RECONOCIDO ---
    else {
      respuesta = `No entendí tu mensaje 🤔\n\nEscribe:\n• *hola* — ver campañas disponibles\n• *mis puntos* — ver tu saldo\n• *canjear* — canjear tus puntos\n\n_Powered by FREEPOL_`
    }
  } catch (error) {
    console.error('[whatsapp-webhook]', error)
    respuesta = `Hubo un problema procesando tu mensaje. Intenta de nuevo en un momento. 🙏`
  }

  // Respuesta en formato TwiML que Twilio entiende
  const response = new twiml.MessagingResponse()
  response.message(respuesta)

  return new NextResponse(response.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
