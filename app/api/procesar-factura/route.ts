import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { procesarFacturaConOCR } from '@/lib/ocr'

/**
 * Procesa una imagen de factura con OCR real (Tesseract.js).
 * Recibe FormData con: imagen (File), campana_id, participante_id
 *
 * NOTA: El primer análisis puede tardar 10-15 segundos por descarga de modelos.
 */
export const maxDuration = 60 // timeout extendido para Tesseract

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const campana_id = form.get('campana_id') as string | null
    const participante_id = form.get('participante_id') as string | null
    const imagen = form.get('imagen') as File | null

    if (!campana_id || !participante_id) {
      return NextResponse.json({ error: 'campana_id y participante_id son requeridos' }, { status: 400 })
    }
    if (!imagen) {
      return NextResponse.json({ error: 'Imagen requerida' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: campana, error: errCampana } = await supabase
      .from('campanas')
      .select('id, nombre_negocio, nombre_campana, configuracion')
      .eq('id', campana_id)
      .single()

    if (errCampana || !campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
    }

    // Convertir File a Buffer para Tesseract
    const arrayBuffer = await imagen.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const resultado = await procesarFacturaConOCR(buffer, campana, participante_id)

    if (!resultado.exitoso) {
      return NextResponse.json({ error: resultado.razon_error }, { status: 400 })
    }

    return NextResponse.json({
      puntos_ganados: resultado.puntos_ganados,
      total_puntos: resultado.nuevo_total,
      numero_factura: resultado.numero_factura,
      monto_detectado: resultado.monto_total,
      meta_canje: campana.configuracion?.meta_canje ?? 50,
      alcanzaste_meta: resultado.alcanzaste_meta,
    })
  } catch (error) {
    console.error('[procesar-factura]', error)
    return NextResponse.json({ error: 'Error al procesar la factura' }, { status: 500 })
  }
}
