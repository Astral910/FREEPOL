import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import type { ConfigCampana } from '@/types/campana'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

interface Cuerpo {
  campana_id?: string
  participante_id?: string
}

/**
 * Simula una compra en campañas tipo "puntos" (demo / sin factura).
 * Suma los puntos equivalentes a UNA unidad de monto_base según configuración.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Cuerpo

    if (!body.campana_id || !body.participante_id) {
      return NextResponse.json(
        { error: 'campana_id y participante_id son requeridos' },
        { status: 400 },
      )
    }

    if (!UUID_RE.test(body.campana_id) || !UUID_RE.test(body.participante_id)) {
      return NextResponse.json({ error: 'Identificadores inválidos' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: participante, error: errPart } = await supabase
      .from('participantes')
      .select('id')
      .eq('id', body.participante_id)
      .eq('campana_id', body.campana_id)
      .maybeSingle()

    if (errPart || !participante) {
      return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 })
    }

    const { data: campana, error: errCamp } = await supabase
      .from('campanas')
      .select('id, estado, tipo, configuracion')
      .eq('id', body.campana_id)
      .maybeSingle()

    if (errCamp || !campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
    }

    if (campana.estado !== 'activa') {
      return NextResponse.json({ error: 'La campaña no está activa' }, { status: 409 })
    }

    if (campana.tipo !== 'puntos') {
      return NextResponse.json(
        { error: 'Solo aplica a campañas de tipo puntos' },
        { status: 400 },
      )
    }

    const cfg = campana.configuracion as ConfigCampana
    const puntosPorMonto = cfg.puntos_por_monto ?? 1
    const metaCanje = cfg.meta_canje ?? 50

    // Una compra simulada equivale a acumular por un bloque de monto_base (como en OCR)
    const puntos_ganados = Math.max(1, puntosPorMonto)

    const { data: existente } = await supabase
      .from('puntos_participantes')
      .select('id, total_puntos')
      .eq('participante_id', body.participante_id)
      .eq('campana_id', body.campana_id)
      .maybeSingle()

    let nuevo_total: number
    if (existente) {
      nuevo_total = existente.total_puntos + puntos_ganados
      const { error: up } = await supabase
        .from('puntos_participantes')
        .update({
          total_puntos: nuevo_total,
          ultima_actualizacion: new Date().toISOString(),
        })
        .eq('id', existente.id)

      if (up) {
        console.error('[simular-compra-puntos] update', up)
        return NextResponse.json({ error: 'No se pudo actualizar puntos' }, { status: 500 })
      }
    } else {
      nuevo_total = puntos_ganados
      const { error: ins } = await supabase.from('puntos_participantes').insert({
        participante_id: body.participante_id,
        campana_id: body.campana_id,
        total_puntos: nuevo_total,
      })

      if (ins) {
        console.error('[simular-compra-puntos] insert', ins)
        return NextResponse.json({ error: 'No se pudo registrar puntos' }, { status: 500 })
      }
    }

    return NextResponse.json({
      puntos_ganados,
      total_puntos: nuevo_total,
      meta_canje: metaCanje,
      alcanzaste_meta: nuevo_total >= metaCanje,
    })
  } catch (e) {
    console.error('[simular-compra-puntos]', e)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
