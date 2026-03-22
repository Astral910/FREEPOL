import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import type { ConfigCampana } from '@/types/campana'

// TODO: Reemplazar con Google Cloud Vision API
// client.textDetection(imageBuffer) extrae texto de la imagen
// Regex /FAC-?\d{6,}/ para detectar número de factura
// Regex /\$?\d+[\.,]\d{2}/ para detectar monto total

/**
 * Procesa una imagen de factura para acumular puntos.
 * Por ahora usa datos simulados (OCR pendiente de integración real).
 * Recibe FormData con: imagen, campana_id, participante_id
 */
export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const campana_id = form.get('campana_id') as string | null
    const participante_id = form.get('participante_id') as string | null
    const imagen = form.get('imagen') as File | null

    if (!campana_id || !participante_id) {
      return NextResponse.json(
        { error: 'campana_id y participante_id son requeridos' },
        { status: 400 },
      )
    }

    if (!imagen) {
      return NextResponse.json({ error: 'Imagen requerida' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Obtener configuración de la campaña
    const { data: campana, error: errCampana } = await supabase
      .from('campanas')
      .select('configuracion')
      .eq('id', campana_id)
      .single()

    if (errCampana || !campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
    }

    const cfg = campana.configuracion as ConfigCampana
    const puntosPorMonto = cfg.puntos_por_monto ?? 1
    const montoBase = cfg.monto_base ?? 10
    const metaCanje = cfg.meta_canje ?? 50

    // Simulación de OCR — datos aleatorios para desarrollo
    const numeroFactura = `FAC-${Date.now()}`
    const montoTotal = Math.floor(Math.random() * 150) + 20

    // Calcular puntos ganados
    const puntosGanados = Math.floor(montoTotal / montoBase) * puntosPorMonto

    if (puntosGanados <= 0) {
      return NextResponse.json({
        error: `Monto muy bajo. Mínimo $${montoBase} para ganar puntos.`,
      }, { status: 422 })
    }

    // Leer puntos actuales del participante
    const { data: puntosActuales } = await supabase
      .from('puntos_participantes')
      .select('total')
      .eq('participante_id', participante_id)
      .eq('campana_id', campana_id)
      .maybeSingle()

    const totalAnterior = (puntosActuales as { total?: number } | null)?.total ?? 0
    const totalNuevo = totalAnterior + puntosGanados

    // Upsert de puntos
    const { error: errPuntos } = await supabase
      .from('puntos_participantes')
      .upsert(
        {
          participante_id,
          campana_id,
          total: totalNuevo,
          ultima_factura: numeroFactura,
        },
        { onConflict: 'participante_id,campana_id' },
      )

    if (errPuntos) {
      console.error('[procesar-factura] Error guardando puntos:', errPuntos)
      return NextResponse.json({ error: 'Error al guardar puntos' }, { status: 500 })
    }

    return NextResponse.json({
      puntos_ganados: puntosGanados,
      total_puntos: totalNuevo,
      numero_factura: numeroFactura,
      monto_detectado: montoTotal,
      meta_canje: metaCanje,
      alcanzaste_meta: totalNuevo >= metaCanje,
    })
  } catch (error) {
    console.error('[procesar-factura]', error)
    return NextResponse.json({ error: 'Error al procesar la factura' }, { status: 500 })
  }
}
