import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import type { ConfigCampana } from '@/types/campana'
import { TIPO_CAMPANA_LABEL } from '@/types/campana'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { config?: ConfigCampana }
    const { config } = body

    if (!config?.nombre_negocio || !config?.tipo) {
      return NextResponse.json({ error: 'Datos de campaña incompletos' }, { status: 400 })
    }

    const tipoCampana = TIPO_CAMPANA_LABEL[config.tipo] ?? config.tipo

    const respuesta = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Genera un mensaje de bienvenida corto (máximo 150 caracteres) para una campaña de ${tipoCampana} llamada "${config.nombre_campana}" de "${config.nombre_negocio}". Debe ser atractivo, en español, con emoji inicial. Devuelve SOLO el mensaje, sin comillas ni explicaciones.`,
        },
      ],
    })

    const mensaje = respuesta.choices[0]?.message?.content?.trim() ?? ''

    if (!mensaje) {
      return NextResponse.json({ error: 'No se pudo generar el mensaje' }, { status: 500 })
    }

    return NextResponse.json({ mensaje })
  } catch (error) {
    console.error('[API generar-mensaje]', error)
    return NextResponse.json({ error: 'Error al generar mensaje' }, { status: 500 })
  }
}
