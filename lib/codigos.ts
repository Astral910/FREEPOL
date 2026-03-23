import { createHash, randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import type { SupabaseClient } from '@supabase/supabase-js'
import { setNX, eliminar } from '@/lib/redis'

/** Resultado de la validación y canje de un código */
export interface ResultadoValidacion {
  valido: boolean
  razon?: string
  premio?: string
  negocio?: string
  expira_en?: string
}

/**
 * Genera un código único con formato XXXX-YYYY-ZZZZ.
 * @param prefijo Primeras 4 letras del negocio en mayúsculas (solo A-Z)
 * Ejemplo: "Pollo Campero" → "POLL" → "POLL-A2F9-K7M3"
 */
export function generarCodigoUnico(prefijo: string): string {
  const prefijoLimpio = prefijo
    .replace(/[^A-Za-z]/g, '')
    .substring(0, 4)
    .toUpperCase()
    .padEnd(4, 'X')

  const seg1 = randomBytes(2).toString('hex').toUpperCase()
  const seg2 = randomBytes(2).toString('hex').toUpperCase()

  return `${prefijoLimpio}-${seg1}-${seg2}`
}

/**
 * Genera el hash SHA-256 de un código para verificar su autenticidad.
 * Concatena: código + HASH_SECRET del entorno.
 * Nunca almacenar el código sin su hash.
 */
export function generarHash(codigo: string): string {
  const secret = process.env.HASH_SECRET ?? 'freepol_default_secret'
  return createHash('sha256')
    .update(codigo + secret)
    .digest('hex')
}

/**
 * Calcula la fecha de expiración de un código.
 * @param horas Horas desde ahora hasta la expiración
 */
export function calcularExpiracion(horas: number): Date {
  return new Date(Date.now() + horas * 60 * 60 * 1000)
}

/**
 * Valida y marca como usado un código de premio.
 * Usa un lock de Redis (SET NX) para operaciones atómicas
 * y prevenir condiciones de carrera (doble canje simultáneo).
 *
 * Orden de validaciones:
 * 1. Existencia del código en Supabase
 * 2. Ya usado
 * 3. Expirado
 * 4. Hash SHA-256 válido
 * 5. Lock atómico de Redis (30s) para prevenir doble canje
 * 6. UPDATE en Supabase: usado=true, fecha_uso=NOW()
 * 7. Liberar lock de Redis
 */
export async function validarYUsarCodigo(
  codigoTexto: string,
  supabase: SupabaseClient,
): Promise<ResultadoValidacion> {
  // 1. Buscar el código en la base de datos
  const { data: codigo, error } = await supabase
    .from('codigos')
    .select('id, codigo, hash_verificacion, premio, usado, expira_en, campana_id, campanas(nombre_negocio)')
    .eq('codigo', codigoTexto.trim().toUpperCase())
    .single()

  if (error || !codigo) {
    return { valido: false, razon: 'Código no encontrado' }
  }

  // 2. Verificar si ya fue usado
  if (codigo.usado) {
    return { valido: false, razon: 'Este código ya fue utilizado' }
  }

  // 3. Verificar expiración
  if (new Date(codigo.expira_en) < new Date()) {
    return { valido: false, razon: 'Este código ha expirado' }
  }

  // 4. Verificar integridad del hash
  const hashEsperado = generarHash(codigoTexto.trim().toUpperCase())
  if (hashEsperado !== codigo.hash_verificacion) {
    return { valido: false, razon: 'Código inválido' }
  }

  // 5. Lock atómico de Redis (previene doble canje simultáneo)
  const lockKey = `procesando:${codigo.id}`
  const lockAdquirido = await setNX(lockKey, '1', 30)
  if (!lockAdquirido) {
    return { valido: false, razon: 'Código en proceso, intenta en unos segundos' }
  }

  try {
    // 6. Marcar como usado en Supabase
    const { error: updateError } = await supabase
      .from('codigos')
      .update({ usado: true, fecha_uso: new Date().toISOString() })
      .eq('id', codigo.id)
      .eq('usado', false) // cláusula extra de seguridad

    if (updateError) {
      return { valido: false, razon: 'Error al procesar el canje' }
    }
  } finally {
    // 7. Siempre liberar el lock aunque falle el UPDATE
    await eliminar(lockKey)
  }

  const negocio = (codigo.campanas as { nombre_negocio?: string } | null)?.nombre_negocio ?? ''

  return {
    valido: true,
    premio: codigo.premio,
    negocio,
    expira_en: codigo.expira_en,
  }
}

/** Referencia explícita a uuidv4 para generar IDs cuando se requiera */
export { uuidv4 }
