import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { existe, setConExpiracion } from '@/lib/redis'
import { generarCodigoUnico, generarHash, calcularExpiracion } from '@/lib/codigos'
import type { ConfigCampana } from '@/types/campana'

/** Genera un código de cupón directo o de canje de puntos */
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

    const cuponKey = `cupon:${body.participante_id}:${body.campana_id}`
    const supabase = createServerClient()

    // 1. Si ya tiene código en Redis, buscarlo y devolverlo
    const yaTieneCodigo = await existe(cuponKey)
    if (yaTieneCodigo) {
      const { data: codigoExistente } = await supabase
        .from('codigos')
        .select('codigo, premio, expira_en')
        .eq('participante_id', body.participante_id)
        .eq('campana_id', body.campana_id)
        .eq('usado', false)
        .order('creado_en', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (codigoExistente) {
        return NextResponse.json({
          codigo: codigoExistente.codigo,
          premio: codigoExistente.premio,
          expira_en: codigoExistente.expira_en,
        })
      }
    }

    // 2. Obtener campaña
    const { data: campana, error: errCampana } = await supabase
      .from('campanas')
      .select('id, nombre_negocio, nombre_campana, estado, total_canjes, configuracion')
      .eq('id', body.campana_id)
      .single()

    if (errCampana || !campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
    }

    const cfg = campana.configuracion as ConfigCampana

    // 3. Verificar límite de códigos totales si aplica
    if (cfg.limite_participantes) {
      const { count } = await supabase
        .from('codigos')
        .select('id', { count: 'exact', head: true })
        .eq('campana_id', body.campana_id)

      if (count !== null && count >= cfg.limite_participantes) {
        return NextResponse.json({ error: 'Se alcanzó el límite de cupones disponibles' }, { status: 409 })
      }
    }

    // 4. Generar código único
    const prefijo = campana.nombre_negocio
      .replace(/[^A-Za-z]/g, '')
      .substring(0, 4)
      .toUpperCase()

    const codigo = generarCodigoUnico(prefijo)
    const hash = generarHash(codigo)
    const expira_en = calcularExpiracion(cfg.horas_expiracion_codigo || 48)
    const premio = cfg.premios[0]?.nombre ?? 'Premio'

    // 5. Guardar en Supabase
    const { error: errInsert } = await supabase.from('codigos').insert({
      participante_id: body.participante_id,
      campana_id: body.campana_id,
      codigo,
      hash_verificacion: hash,
      premio,
      expira_en: expira_en.toISOString(),
    })

    if (errInsert) {
      console.error('[generar-codigo]', errInsert)
      return NextResponse.json({ error: 'Error al generar el código' }, { status: 500 })
    }

    // 6. Marcar en Redis
    await setConExpiracion(cuponKey, 'true', 30 * 24 * 60 * 60)

    // 7. Incrementar canjes
    await supabase
      .from('campanas')
      .update({ total_canjes: campana.total_canjes + 1 })
      .eq('id', body.campana_id)

    // 8. Notificar al participante por correo y/o WhatsApp (fire-and-forget)
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
        premio,
        codigo,
        expira_en: expira_en.toISOString(),
      }).catch((e) => console.error('[generar-codigo] email error:', e))
    }

    if (participante?.telefono) {
      const { enviarCodigoPorWhatsApp } = await import('@/lib/whatsapp')
      await enviarCodigoPorWhatsApp(participante.telefono, {
        nombre_negocio: campana.nombre_negocio,
        nombre_campana: campana.nombre_campana,
        premio,
        codigo,
        expira_en: expira_en.toISOString(),
      }).catch((e) => console.error('[generar-codigo] whatsapp error:', e))
    }

    return NextResponse.json({ codigo, premio, expira_en: expira_en.toISOString() })
  } catch (error) {
    console.error('[generar-codigo]', error)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
