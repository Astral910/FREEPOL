import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import type { ConfigCampana } from '@/types/campana'

/** Evita intentos de prerender estático (usa searchParams). */
export const dynamic = 'force-dynamic'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Devuelve el saldo de puntos del participante en una campaña (landing pública).
 * GET ?campana_id=&participante_id=
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campana_id = searchParams.get('campana_id')
    const participante_id = searchParams.get('participante_id')

    if (!campana_id || !participante_id) {
      return NextResponse.json(
        { error: 'campana_id y participante_id son requeridos' },
        { status: 400 },
      )
    }

    if (!UUID_RE.test(campana_id) || !UUID_RE.test(participante_id)) {
      return NextResponse.json({ error: 'Identificadores inválidos' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: participante, error: errPart } = await supabase
      .from('participantes')
      .select('id')
      .eq('id', participante_id)
      .eq('campana_id', campana_id)
      .maybeSingle()

    if (errPart || !participante) {
      return NextResponse.json({ error: 'Participante no encontrado' }, { status: 404 })
    }

    const { data: campana, error: errCamp } = await supabase
      .from('campanas')
      .select('id, estado, configuracion, tipo')
      .eq('id', campana_id)
      .maybeSingle()

    if (errCamp || !campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
    }

    const cfg = campana.configuracion as ConfigCampana
    const meta = cfg.meta_canje ?? 50

    const { data: fila } = await supabase
      .from('puntos_participantes')
      .select('total_puntos')
      .eq('participante_id', participante_id)
      .eq('campana_id', campana_id)
      .maybeSingle()

    const total = fila?.total_puntos ?? 0

    return NextResponse.json({
      total_puntos: total,
      meta_canje: meta,
      alcanzaste_meta: total >= meta,
      tipo_campana: campana.tipo,
      estado_campana: campana.estado,
    })
  } catch (e) {
    console.error('[mis-puntos]', e)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
