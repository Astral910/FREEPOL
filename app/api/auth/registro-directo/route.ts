import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

/** Cuerpo esperado del cliente (mismos campos que el registro normal) */
interface CuerpoRegistroDirecto {
  email?: string
  password?: string
  fullName?: string
  company?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Registro vía Admin API — solo si ALLOW_DIRECT_SIGNUP=true (desarrollo / demos).
 * Evita el límite de envío de correos de signUp público; el usuario queda confirmado.
 */
export async function POST(request: NextRequest) {
  if (process.env.ALLOW_DIRECT_SIGNUP !== 'true') {
    return NextResponse.json(
      { error: 'El registro directo no está habilitado en este entorno.' },
      { status: 403 },
    )
  }

  let body: CuerpoRegistroDirecto
  try {
    body = (await request.json()) as CuerpoRegistroDirecto
  } catch {
    return NextResponse.json({ error: 'Cuerpo JSON inválido' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  const company = typeof body.company === 'string' ? body.company.trim() : ''

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Correo electrónico inválido' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 8 caracteres' },
      { status: 400 },
    )
  }
  if (fullName.length < 2) {
    return NextResponse.json({ error: 'Indica tu nombre completo' }, { status: 400 })
  }
  if (company.length < 2) {
    return NextResponse.json({ error: 'Indica el nombre de tu empresa' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      company_name: company,
    },
  })

  if (error) {
    const msg = error.message.toLowerCase()
    if (
      msg.includes('already been registered') ||
      msg.includes('already registered') ||
      msg.includes('user already registered') ||
      msg.includes('duplicate')
    ) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado. Inicia sesión.' },
        { status: 409 },
      )
    }
    console.error('[registro-directo]', error.message)
    return NextResponse.json(
      { error: 'No se pudo crear la cuenta. Intenta de nuevo más tarde.' },
      { status: 500 },
    )
  }

  if (!data.user?.id) {
    return NextResponse.json({ error: 'Respuesta inesperada del servidor de auth' }, { status: 500 })
  }

  return NextResponse.json({ ok: true as const, userId: data.user.id }, { status: 201 })
}
