import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { existe, setConExpiracion } from '@/lib/redis'
import { generarCodigoUnico, generarHash, calcularExpiracion } from '@/lib/codigos'
import type { ConfigCampana } from '@/types/campana'

/**
 * Endpoint CRÍTICO de seguridad — el resultado de la ruleta
 * SIEMPRE se calcula aquí en el servidor, nunca en el cliente.
 * Usa Redis para garantizar que cada participante solo gire una vez.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      campana_id?: string
      participante_id?: string
    }

    if (!body.campana_id || !body.participante_id) {
      return NextResponse.json(
        { error: 'campana_id y participante_id son requeridos' },
        { status: 400 },
      )
    }

    // 1. Antifraude: verificar en Redis si ya giró
    const giroKey = `giro:${body.participante_id}:${body.campana_id}`
    const yaGiro = await existe(giroKey)
    if (yaGiro) {
      return NextResponse.json({ error: 'ya_participo' }, { status: 409 })
    }

    const supabase = createServerClient()

    // 2. Obtener la campaña y su configuración
    const { data: campana, error: errCampana } = await supabase
      .from('campanas')
      .select('id, nombre_negocio, nombre_campana, estado, total_canjes, configuracion')
      .eq('id', body.campana_id)
      .single()

    if (errCampana || !campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
    }
    if (campana.estado !== 'activa') {
      return NextResponse.json({ error: 'Campaña no disponible' }, { status: 410 })
    }

    const cfg = campana.configuracion as ConfigCampana
    const premios = cfg.premios ?? []

    if (premios.length === 0) {
      return NextResponse.json({ error: 'Campaña sin premios configurados' }, { status: 422 })
    }

    // 3. Calcular resultado con algoritmo de pesos en el servidor
    const random = Math.random() * 100
    let acumulado = 0
    let premioGanado = premios[0]
    let prizeIndex = 0

    for (let i = 0; i < premios.length; i++) {
      acumulado += premios[i].probabilidad
      if (random < acumulado) {
        premioGanado = premios[i]
        prizeIndex = i
        break
      }
    }

    // 4. Generar código único con prefijo del negocio
    const prefijo = campana.nombre_negocio
      .replace(/[^A-Za-z]/g, '')
      .substring(0, 4)
      .toUpperCase()

    const codigo = generarCodigoUnico(prefijo)
    const hash = generarHash(codigo)

    // 5. Calcular expiración
    const horasExpiracion = cfg.horas_expiracion_codigo || 24
    const expira_en = calcularExpiracion(horasExpiracion)

    // 6. Guardar código en Supabase
    const { error: errCodigo } = await supabase.from('codigos').insert({
      participante_id: body.participante_id,
      campana_id: body.campana_id,
      codigo,
      hash_verificacion: hash,
      premio: premioGanado.nombre,
      expira_en: expira_en.toISOString(),
    })

    if (errCodigo) {
      console.error('[girar-ruleta] Error guardando código:', errCodigo)
      return NextResponse.json({ error: 'Error al procesar el giro' }, { status: 500 })
    }

    // 7. Guardar en Redis — previene segundo giro
    // EX = segundos hasta fecha_fin de la campaña o 30 días como fallback
    let ttlSegundos = 30 * 24 * 60 * 60 // 30 días
    if (cfg.fecha_fin) {
      const diff = Math.floor((new Date(cfg.fecha_fin).getTime() - Date.now()) / 1000)
      if (diff > 0) ttlSegundos = diff
    }
    await setConExpiracion(giroKey, 'true', ttlSegundos)

    // 8. Incrementar total_canjes
    await supabase
      .from('campanas')
      .update({ total_canjes: campana.total_canjes + 1 })
      .eq('id', body.campana_id)

    // 9. Notificar al participante por correo y/o WhatsApp (fire-and-forget)
    const { data: participante } = await supabase
      .from('participantes')
      .select('correo, telefono')
      .eq('id', body.participante_id)
      .maybeSingle()

    if (participante?.correo) {
      const { enviarCodigoPremio } = await import('@/lib/email')
      await enviarCodigoPremio({
        correo: participante.correo,
        nombre_negocio: campana.nombre_negocio,
        nombre_campana: campana.nombre_campana,
        premio: premioGanado.nombre,
        codigo,
        expira_en: expira_en.toISOString(),
      }).catch((e) => console.error('[girar-ruleta] email error:', e))
    }

    if (participante?.telefono) {
      const { enviarCodigoPorWhatsApp } = await import('@/lib/whatsapp')
      await enviarCodigoPorWhatsApp(participante.telefono, {
        nombre_negocio: campana.nombre_negocio,
        nombre_campana: campana.nombre_campana,
        premio: premioGanado.nombre,
        codigo,
        expira_en: expira_en.toISOString(),
      }).catch((e) => console.error('[girar-ruleta] whatsapp error:', e))
    }

    // 10. Devolver resultado al cliente
    return NextResponse.json({
      premio: premioGanado.nombre,
      prize_index: prizeIndex,
      codigo,
      expira_en: expira_en.toISOString(),
    })
  } catch (error) {
    console.error('[girar-ruleta]', error)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
