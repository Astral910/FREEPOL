import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { createServerClient } from '@/lib/supabase-server'
import LandingCampana from '@/components/campana/LandingCampana'
import type { ConfigCampana } from '@/types/campana'

/** Tipado de la fila de Supabase para la tabla campanas */
export interface CampanaRow {
  id: string
  slug: string
  nombre_negocio: string
  nombre_campana: string
  tipo: string
  canales: string[]
  estado: string
  configuracion: ConfigCampana
  total_participantes: number
  total_canjes: number
}

interface Props {
  params: { slug: string }
}

/** Genera metadata dinámica para SEO y Open Graph de cada campaña */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('campanas')
    .select('nombre_campana, nombre_negocio, configuracion')
    .eq('slug', params.slug)
    .single()

  if (!data) {
    return { title: 'Campaña no encontrada — FREEPOL' }
  }

  const cfg = data.configuracion as ConfigCampana
  return {
    title: `${data.nombre_campana} — ${data.nombre_negocio}`,
    description: cfg.mensaje_bienvenida || `Participa en ${data.nombre_campana} de ${data.nombre_negocio}`,
    openGraph: {
      title: `${data.nombre_campana} — ${data.nombre_negocio}`,
      description: cfg.mensaje_bienvenida || '',
      type: 'website',
    },
  }
}

export default async function CampanaPublicaPage({ params }: Props) {
  const supabase = createServerClient()

  const { data: campana, error } = await supabase
    .from('campanas')
    .select('*')
    .eq('slug', params.slug)
    .single()

  // Campaña no encontrada
  if (error || !campana) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF0F2] flex items-center justify-center mb-6">
          <Zap size={28} className="text-[#E8344E]" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Campaña no encontrada</h1>
        <p className="text-[#64748B] mb-8 max-w-sm">
          Esta campaña no existe o el enlace es incorrecto. Verifica la URL e intenta de nuevo.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[#E8344E] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  // Campaña no activa
  if (campana.estado !== 'activa') {
    const mensajeEstado: Record<string, string> = {
      terminada: 'Esta campaña ya finalizó. ¡Gracias a todos los participantes!',
      pausada: 'Esta campaña está temporalmente pausada. Vuelve pronto.',
      borrador: 'Esta campaña aún no ha sido publicada.',
    }
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF9C3] flex items-center justify-center mb-6">
          <span className="text-3xl">⏳</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
          {campana.estado === 'terminada' ? 'Campaña finalizada' : 'Campaña no disponible'}
        </h1>
        <p className="text-[#64748B] mb-8 max-w-sm">
          {mensajeEstado[campana.estado] ?? 'Esta campaña no está disponible en este momento.'}
        </p>
        <p className="text-xs text-[#94A3B8]">
          Campaña de <strong>{campana.nombre_negocio}</strong>
        </p>
      </div>
    )
  }

  return <LandingCampana campana={campana as CampanaRow} />
}
