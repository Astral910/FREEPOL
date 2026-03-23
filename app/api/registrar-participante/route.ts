import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { existe, setConExpiracion } from '@/lib/redis'
import type { ConfigCampana } from '@/types/campana'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      campana_id?: string
      correo?: string
      telefono?: string
      nombre?: string
    }

    if (!body.campana_id) {
      return NextResponse.json({ error: 'campana_id requerido' }, { status: 400 })
    }

    // Obtener IP del cliente para antifraude
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    const supabase = createServerClient()

    // 1. Verificar que la campaña existe y está activa
    const { data: campana, error: errCampana } = await supabase
      .from('campanas')
      .select('id, estado, total_participantes, configuracion')
      .eq('id', body.campana_id)
      .single()

    if (errCampana || !campana) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
    }
    if (campana.estado !== 'activa') {
      return NextResponse.json({ error: 'Campaña no disponible' }, { status: 410 })
    }

    // 2. Verificar límite de participantes
    const cfg = campana.configuracion as ConfigCampana
    if (cfg.limite_participantes && campana.total_participantes >= cfg.limite_participantes) {
      return NextResponse.json({ error: 'limite_alcanzado' }, { status: 409 })
    }

    // 3. Antifraude por IP (24 horas)
    const ipKey = `ip:${body.campana_id}:${ip}`
    const ipDuplicada = await existe(ipKey)
    if (ipDuplicada) {
      return NextResponse.json({ error: 'ip_duplicada' }, { status: 409 })
    }

    // 4. Verificar si correo/teléfono ya está registrado → devolver participante existente
    if (body.correo || body.telefono) {
      let query = supabase
        .from('participantes')
        .select('id')
        .eq('campana_id', body.campana_id)

      if (body.correo) query = query.eq('correo', body.correo.toLowerCase())
      else if (body.telefono) query = query.eq('telefono', body.telefono)

      const { data: existente } = await query.maybeSingle()

      if (existente) {
        return NextResponse.json({
          ya_registrado: true,
          participante_id: existente.id,
        })
      }
    }

    // 5. Insertar nuevo participante
    const { data: nuevo, error: errInsert } = await supabase
      .from('participantes')
      .insert({
        campana_id: body.campana_id,
        correo: body.correo?.toLowerCase() ?? null,
        telefono: body.telefono ?? null,
        nombre: body.nombre ?? null,
        ip_address: ip,
      })
      .select('id')
      .single()

    if (errInsert || !nuevo) {
      console.error('[registrar-participante]', errInsert)
      return NextResponse.json({ error: 'Error al registrar' }, { status: 500 })
    }

    // 6. Incrementar contador en campañas
    await supabase
      .from('campanas')
      .update({ total_participantes: campana.total_participantes + 1 })
      .eq('id', body.campana_id)

    // 7. Guardar IP en Redis por 24 horas
    await setConExpiracion(ipKey, 'true', 86400)

    // 8. Enviar bienvenida por WhatsApp si la condición es teléfono (fire-and-forget)
    if (cfg.condicion === 'telefono' && body.telefono && cfg.mensaje_bienvenida) {
      const { data: campanaConSlug } = await supabase
        .from('campanas')
        .select('slug, nombre_negocio, nombre_campana')
        .eq('id', body.campana_id)
        .single()

      if (campanaConSlug) {
        const { enviarBienvenidaWhatsApp } = await import('@/lib/whatsapp')
        await enviarBienvenidaWhatsApp(body.telefono, {
          nombre_negocio: campanaConSlug.nombre_negocio,
          nombre_campana: campanaConSlug.nombre_campana,
          url_campana: `${process.env.NEXT_PUBLIC_APP_URL}/c/${campanaConSlug.slug}`,
          mensaje_bienvenida: cfg.mensaje_bienvenida,
        }).catch((e) => console.error('[registrar-participante] whatsapp error:', e))
      }
    }

    return NextResponse.json({
      participante_id: nuevo.id,
      mensaje: 'Registro exitoso',
    })
  } catch (error) {
    console.error('[registrar-participante]', error)
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
