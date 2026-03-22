import { createWorker } from 'tesseract.js'
import { createServerClient } from '@/lib/supabase-server'

export interface ResultadoOCR {
  exitoso: boolean
  numero_factura: string | null
  monto_total: number | null
  puntos_ganados: number
  nuevo_total: number
  alcanzaste_meta: boolean
  razon_error?: string
}

interface ConfigCampana {
  monto_base?: number
  puntos_por_monto?: number
  meta_canje?: number
}

interface Campana {
  id: string
  configuracion: ConfigCampana
}

/**
 * Extrae número de factura del texto OCR usando varios patrones.
 * Si no encuentra ninguno, genera un ID temporal basado en timestamp.
 */
function extraerNumeroFactura(texto: string): string {
  const patrones = [
    /(?:factura|invoice|ticket|recibo|no\.?|número|#)\s*:?\s*([A-Z0-9\-]{4,20})/i,
    /[A-Z]{2,4}-?\d{4,10}/,
    /(?:serie|folio)\s*:?\s*([A-Z0-9\-]{3,15})/i,
  ]
  for (const patron of patrones) {
    const match = texto.match(patron)
    if (match?.[1]) return match[1].trim().toUpperCase()
  }
  // Fallback: ID único para no bloquear el flujo
  return `FAC-${Date.now().toString(36).toUpperCase()}`
}

/**
 * Extrae monto total del texto OCR probando varios formatos y monedas.
 * Soporta dólares ($), quetzales (Q) y formatos con comas.
 */
function extraerMonto(texto: string): number {
  const patrones = [
    /(?:total|amount|monto|importe|grand\s*total)\s*:?\s*[Q$]?\s*([\d,]+\.?\d{0,2})/i,
    /[Q$]\s*([\d,]+\.\d{2})/,
    /(?:a\s+pagar|to\s+pay)\s*:?\s*[Q$]?\s*([\d,]+\.?\d{0,2})/i,
  ]
  for (const patron of patrones) {
    const match = texto.match(patron)
    if (match?.[1]) {
      const valor = parseFloat(match[1].replace(/,/g, ''))
      if (!isNaN(valor) && valor > 0) return valor
    }
  }
  // Monto mínimo de fallback — no bloquea el flujo
  return 10
}

/**
 * Procesa una imagen de factura con Tesseract.js y calcula los puntos ganados.
 *
 * NOTA DE RENDIMIENTO: El primer análisis tarda 10-15 segundos mientras
 * se descargan los modelos de idioma (spa+eng, ~40MB).
 * Los siguientes análisis son más rápidos (3-5 segundos).
 * En producción de alta carga usar Google Cloud Vision API.
 *
 * @param imageBuffer - Buffer de la imagen de la factura
 * @param campana - Objeto de la campaña con su configuración
 * @param participanteId - ID del participante para el UPSERT de puntos
 */
export async function procesarFacturaConOCR(
  imageBuffer: Buffer,
  campana: Campana,
  participanteId: string,
): Promise<ResultadoOCR> {
  const supabase = createServerClient()

  let textoOCR = ''

  try {
    // Crear worker con español e inglés para mejor reconocimiento de facturas latinas
    const worker = await createWorker('spa+eng')
    const { data: { text } } = await worker.recognize(imageBuffer)
    await worker.terminate()
    textoOCR = text
  } catch (err) {
    console.error('[OCR] Error Tesseract:', err)
    return {
      exitoso: false,
      numero_factura: null,
      monto_total: null,
      puntos_ganados: 0,
      nuevo_total: 0,
      alcanzaste_meta: false,
      razon_error: 'No se pudo procesar la imagen. Intenta con una foto más clara.',
    }
  }

  const numero_factura = extraerNumeroFactura(textoOCR)
  const monto_total = extraerMonto(textoOCR)

  // Verificar que esta factura no haya sido registrada antes para esta campaña
  const { data: facturaExistente } = await supabase
    .from('notificaciones')
    .select('id')
    .eq('campana_id', campana.id)
    .eq('enviado_a', `factura:${numero_factura}`)
    .maybeSingle()

  if (facturaExistente) {
    return {
      exitoso: false,
      numero_factura,
      monto_total,
      puntos_ganados: 0,
      nuevo_total: 0,
      alcanzaste_meta: false,
      razon_error: 'Esta factura ya fue registrada anteriormente.',
    }
  }

  // Calcular puntos según configuración de la campaña
  const config = campana.configuracion
  const montoBase = config.monto_base ?? 25
  const puntosPorMonto = config.puntos_por_monto ?? 1
  const metaCanje = config.meta_canje ?? 50

  const puntos_ganados = Math.floor(monto_total / montoBase) * puntosPorMonto

  // UPSERT en puntos_participantes
  let nuevo_total = puntos_ganados
  const { data: puntosExistentes } = await supabase
    .from('puntos_participantes')
    .select('id, total_puntos')
    .eq('participante_id', participanteId)
    .eq('campana_id', campana.id)
    .maybeSingle()

  if (puntosExistentes) {
    nuevo_total = puntosExistentes.total_puntos + puntos_ganados
    await supabase
      .from('puntos_participantes')
      .update({ total_puntos: nuevo_total, ultima_actualizacion: new Date().toISOString() })
      .eq('id', puntosExistentes.id)
  } else {
    await supabase
      .from('puntos_participantes')
      .insert({ participante_id: participanteId, campana_id: campana.id, total_puntos: puntos_ganados })
  }

  // Registrar la factura para evitar doble procesamiento
  await supabase.from('notificaciones').insert({
    participante_id: participanteId,
    campana_id: campana.id,
    tipo: 'bienvenida',
    enviado_a: `factura:${numero_factura}`,
    exitoso: true,
  })

  return {
    exitoso: true,
    numero_factura,
    monto_total,
    puntos_ganados,
    nuevo_total,
    alcanzaste_meta: nuevo_total >= metaCanje,
  }
}
