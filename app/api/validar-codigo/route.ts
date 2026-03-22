import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validarYUsarCodigo } from '@/lib/codigos'

/**
 * Valida y canjea un código de premio.
 * Usado desde la página /validar (cajeros).
 * POST recibe: { codigo: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { codigo?: string }

    if (!body.codigo?.trim()) {
      return NextResponse.json({ valido: false, razon: 'Código requerido' }, { status: 400 })
    }

    const supabase = createServerClient()
    const resultado = await validarYUsarCodigo(body.codigo.trim().toUpperCase(), supabase)

    return NextResponse.json(resultado, {
      status: resultado.valido ? 200 : 422,
    })
  } catch (error) {
    console.error('[validar-codigo]', error)
    return NextResponse.json(
      { valido: false, razon: 'Error al validar el código' },
      { status: 500 },
    )
  }
}
