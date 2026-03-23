'use client'

import { useEffect, useState } from 'react'
import { Handshake, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SupabaseClient } from '@supabase/supabase-js'
import { resolverUrlPublicaCliente } from '@/lib/app-base-url'

interface AlianzaRow {
  id: string
  campana_id: string
  correo_aliado: string
  estado: string
  token_invitacion: string
  nombre_campana: string
  nombre_negocio: string
}

interface AlianzasSectionProps {
  userId: string
  userEmail: string
  supabase: SupabaseClient
}

/**
 * Sección de colaboraciones activas y pendientes del dashboard.
 */
export default function AlianzasSection({ userId, userEmail, supabase }: AlianzasSectionProps) {
  const [alianzas, setAlianzas] = useState<AlianzaRow[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      // Alianzas donde el usuario es el emisor (sus campañas tienen aliados)
      const { data: emisor } = await supabase
        .from('campana_aliados')
        .select('id,campana_id,correo_aliado,estado,token_invitacion,campanas(nombre_campana,nombre_negocio)')
        .order('creado_en', { ascending: false })

      if (emisor) {
        const filas: AlianzaRow[] = (emisor as unknown[]).map((a: unknown) => {
          const al = a as { id: string; campana_id: string; correo_aliado: string; estado: string; token_invitacion: string; campanas: { nombre_campana: string; nombre_negocio: string } | null }
          return {
            id: al.id,
            campana_id: al.campana_id,
            correo_aliado: al.correo_aliado,
            estado: al.estado,
            token_invitacion: al.token_invitacion,
            nombre_campana: al.campanas?.nombre_campana ?? '—',
            nombre_negocio: al.campanas?.nombre_negocio ?? '—',
          }
        })
        setAlianzas(filas)
      }
      setCargando(false)
    }
    cargar()
  }, [userId, userEmail, supabase])

  const copiarLinkInvitacion = async (token: string) => {
    const url = `${resolverUrlPublicaCliente()}/alianza/${token}`
    await navigator.clipboard.writeText(url)
    toast.success('Link de invitación copiado')
  }

  if (cargando || alianzas.length === 0) return null

  const ESTADO_STYLE: Record<string, { label: string; clase: string }> = {
    pendiente: { label: 'Esperando respuesta', clase: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    activa: { label: 'Colaboración activa', clase: 'bg-green-500/10 text-green-400 border-green-500/20' },
    rechazada: { label: 'Rechazada', clase: 'bg-red-500/10 text-red-400 border-red-500/20' },
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Handshake size={18} className="text-[#5B5CF6]" />
        <div>
          <h2 className="text-white font-semibold text-lg">Colaboraciones</h2>
          <p className="text-[#64748B] text-xs">Empresas aliadas en tus campañas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alianzas.map((a) => {
          const estilo = ESTADO_STYLE[a.estado] ?? ESTADO_STYLE.pendiente
          return (
            <div key={a.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[#E2E8F0] font-medium text-sm">{a.nombre_campana}</p>
                  <p className="text-[#475569] text-xs">{a.correo_aliado}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 font-medium ${estilo.clase}`}>
                  {estilo.label}
                </span>
              </div>

              {a.estado === 'pendiente' && (
                <button
                  onClick={() => copiarLinkInvitacion(a.token_invitacion)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[#334155] text-[#94A3B8] text-xs hover:bg-[#334155] transition-colors"
                >
                  <Copy size={12} /> Reenviar invitación (copiar link)
                </button>
              )}

              {a.estado === 'activa' && (
                <p className="text-[#22C55E] text-xs flex items-center gap-1.5">
                  <Check size={11} />
                  Los cajeros del aliado pueden validar tus códigos en /validar
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
