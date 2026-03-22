import { NextRequest, NextResponse } from 'next/server'
import { analizarPromptEmpresario } from '@/lib/claude'

/** Rate limiting en memoria: IP → array de timestamps de requests */
const rateLimitMap = new Map<string, number[]>()

const LIMITE_REQUESTS = 5
const VENTANA_MS = 60 * 1000 // 1 minuto

/**
 * Verifica si la IP ha superado el límite de requests por minuto.
 * Limpia automáticamente timestamps expirados.
 */
function verificarRateLimit(ip: string): boolean {
  const ahora = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []

  // Filtrar timestamps fuera de la ventana de 1 minuto
  const recientes = timestamps.filter((t) => ahora - t < VENTANA_MS)

  if (recientes.length >= LIMITE_REQUESTS) {
    return false
  }

  recientes.push(ahora)
  rateLimitMap.set(ip, recientes)
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Obtener IP del cliente
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    // Verificar rate limiting
    if (!verificarRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes, espera un momento antes de intentar de nuevo.' },
        { status: 429 },
      )
    }

    const body = await request.json() as { prompt?: string }
    const { prompt } = body

    // Validaciones del prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'El prompt es requerido.' },
        { status: 400 },
      )
    }

    const promptLimpio = prompt.trim()

    if (promptLimpio.length < 20) {
      return NextResponse.json(
        { error: 'Describe tu campaña con más detalle (mínimo 20 caracteres).' },
        { status: 400 },
      )
    }

    if (promptLimpio.length > 1000) {
      return NextResponse.json(
        { error: 'El prompt es demasiado largo (máximo 1000 caracteres).' },
        { status: 400 },
      )
    }

    // Llamar a Claude API
    const resultado = await analizarPromptEmpresario(promptLimpio)

    return NextResponse.json(resultado, { status: 200 })
  } catch (error) {
    console.error('[API analizar-prompt] Error:', error)

    const mensaje =
      error instanceof Error && error.message.includes('Timeout')
        ? 'El análisis tardó demasiado. Intenta con una descripción más corta.'
        : 'Hubo un problema al analizar tu campaña. Intenta de nuevo en un momento.'

    return NextResponse.json({ error: mensaje }, { status: 500 })
  }
}
