import { NextRequest, NextResponse } from 'next/server'
import { createBrowserClient } from '@supabase/ssr'
import type { ConfigCampana } from '@/types/campana'

/**
 * Genera un slug URL-safe único a partir del nombre de la campaña.
 */
function generarSlug(nombre: string): string {
  return (
    nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // eliminar acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) +
    '-' +
    Date.now().toString(36)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { config?: ConfigCampana }
    const { config } = body

    if (!config) {
      return NextResponse.json({ error: 'Configuración requerida' }, { status: 400 })
    }

    if (!config.nombre_negocio || !config.nombre_campana) {
      return NextResponse.json(
        { error: 'El nombre del negocio y de la campaña son requeridos' },
        { status: 400 },
      )
    }

    // Usar service role para bypass de RLS en inserciones desde servidor
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const slug = generarSlug(config.nombre_campana)

    // Determinar canales como array
    const canales =
      config.canal === 'todos'
        ? ['whatsapp', 'telegram', 'instagram', 'landing']
        : [config.canal]

    const { data, error } = await supabase
      .from('campanas')
      .insert({
        slug,
        nombre_negocio: config.nombre_negocio,
        nombre_campana: config.nombre_campana,
        tipo: config.tipo,
        canales,
        estado: 'activa',
        configuracion: config,
      })
      .select('id, slug')
      .single()

    if (error) {
      console.error('[API crear-campana] Supabase error:', error)
      return NextResponse.json(
        { error: `Error al guardar: ${error.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json({
      id: data.id,
      slug: data.slug,
      url_campana: `/c/${data.slug}`,
    })
  } catch (error) {
    console.error('[API crear-campana]', error)
    return NextResponse.json({ error: 'Error inesperado al crear la campaña' }, { status: 500 })
  }
}
