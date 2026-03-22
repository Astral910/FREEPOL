import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/**
 * PATCH /api/campana/[id]/estado
 * Pausa o reactiva una campaña. Solo el creador puede hacerlo.
 * Body: { estado: 'activa' | 'pausada' }
 * Autenticación: Bearer token en Authorization header.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  const authHeader = request.headers.get('authorization') ?? ''
  const jwt = authHeader.replace('Bearer ', '').trim()

  if (!jwt) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: { user } } = await supabaseAdmin.auth.getUser(jwt)
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json() as { estado: string }
  const { estado } = body

  if (!['activa', 'pausada', 'terminada'].includes(estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const { data: campana, error: checkErr } = await supabaseAdmin
    .from('campanas')
    .select('id, creado_por')
    .eq('id', id)
    .maybeSingle()

  if (checkErr || !campana) {
    return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
  }

  if (campana.creado_por !== user.id) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }

  const { data: actualizada, error: updateErr } = await supabaseAdmin
    .from('campanas')
    .update({ estado, actualizado_en: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (updateErr || !actualizada) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }

  return NextResponse.json(actualizada)
}
