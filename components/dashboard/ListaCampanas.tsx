'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket, Trophy, Star, Ticket, Receipt, MoreHorizontal,
  ExternalLink, Copy, QrCode, BarChart2, Pause, Play, Trash,
  Search, Plus, Users,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import QRModal from '@/components/dashboard/QRModal'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface CampanaRow {
  id: string
  slug: string
  nombre_campana: string
  nombre_negocio: string
  tipo: 'ruleta' | 'puntos' | 'cupon' | 'factura'
  estado: 'activa' | 'pausada' | 'terminada' | 'borrador'
  total_participantes: number
  total_canjes: number
  configuracion: { limite_participantes?: number }
  creado_en: string
}

const TIPO_CONFIG = {
  ruleta: { label: 'Ruleta', icono: Trophy, color: '#F59E0B', bg: '#F59E0B15' },
  puntos: { label: 'Puntos', icono: Star, color: '#22C55E', bg: '#22C55E15' },
  cupon: { label: 'Cupón', icono: Ticket, color: '#5B5CF6', bg: '#5B5CF615' },
  factura: { label: 'Factura', icono: Receipt, color: '#A855F7', bg: '#A855F715' },
}

const ESTADO_CONFIG = {
  activa: { label: 'Activa', clase: 'text-[#22C55E]', pulso: true },
  pausada: { label: 'Pausada', clase: 'text-[#F59E0B]', pulso: false },
  terminada: { label: 'Terminada', clase: 'text-[#64748B]', pulso: false },
  borrador: { label: 'Borrador', clase: 'text-[#475569]', pulso: false },
}

const FILTROS = ['Todas', 'Activas', 'Pausadas', 'Terminadas'] as const
type Filtro = typeof FILTROS[number]

interface ListaCampanasProps {
  userId: string
  supabase: SupabaseClient
}

/**
 * Lista completa de campañas con búsqueda, filtros, acciones y modales.
 */
export default function ListaCampanas({ userId, supabase }: ListaCampanasProps) {
  const [campanas, setCampanas] = useState<CampanaRow[] | null>(null)
  const [filtro, setFiltro] = useState<Filtro>('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [qrCampana, setQrCampana] = useState<CampanaRow | null>(null)
  const [eliminarId, setEliminarId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('campanas')
      .select('id,slug,nombre_campana,nombre_negocio,tipo,estado,total_participantes,total_canjes,configuracion,creado_en')
      .eq('creado_por', userId)
      .order('creado_en', { ascending: false })
      .then(({ data }) => setCampanas((data as CampanaRow[]) ?? []))
  }, [userId, supabase])

  const campanasFiltradas = useMemo(() => {
    if (!campanas) return []
    let lista = campanas
    if (filtro === 'Activas') lista = lista.filter((c) => c.estado === 'activa')
    else if (filtro === 'Pausadas') lista = lista.filter((c) => c.estado === 'pausada')
    else if (filtro === 'Terminadas') lista = lista.filter((c) => c.estado === 'terminada')
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter((c) => c.nombre_campana.toLowerCase().includes(q) || c.nombre_negocio.toLowerCase().includes(q))
    }
    return lista
  }, [campanas, filtro, busqueda])

  const toggleEstado = async (campana: CampanaRow) => {
    const nuevoEstado = campana.estado === 'activa' ? 'pausada' : 'activa'
    // Actualización optimista
    setCampanas((prev) => prev?.map((c) => c.id === campana.id ? { ...c, estado: nuevoEstado } : c) ?? prev)

    // Obtener el JWT de la sesión actual para el header de autorización
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ''

    const res = await fetch(`/api/campana/${campana.id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
    if (!res.ok) {
      // Revertir si falla
      setCampanas((prev) => prev?.map((c) => c.id === campana.id ? { ...c, estado: campana.estado } : c) ?? prev)
      toast.error('Error al cambiar el estado')
    } else {
      toast.success(nuevoEstado === 'activa' ? 'Campaña activada' : 'Campaña pausada')
    }
  }

  const copiarLink = async (slug: string) => {
    const url = `${window.location.origin}/c/${slug}`
    await navigator.clipboard.writeText(url)
    toast.success('Link copiado')
  }

  const eliminarCampana = async (id: string) => {
    await supabase.from('campanas').update({ estado: 'terminada' }).eq('id', id)
    setCampanas((prev) => prev?.filter((c) => c.id !== id) ?? prev)
    toast.success('Campaña eliminada')
    setEliminarId(null)
  }

  if (!campanas) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 flex gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (campanas.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-12 text-center space-y-5">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto shadow-lg shadow-[#5B5CF6]/20"
        >
          <Rocket size={26} className="text-white" />
        </motion.div>
        <div>
          <p className="text-white font-semibold text-lg">Aún no tienes campañas</p>
          <p className="text-[#64748B] text-sm mt-1 max-w-xs mx-auto">
            Crea tu primera campaña describiendo lo que necesitas. La IA hace el resto.
          </p>
        </div>
        <Link href="/chat"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-bold hover:opacity-90 transition-opacity">
          <Plus size={15} /> Crear mi primera campaña
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <h2 className="text-white font-semibold text-lg">Mis campañas</h2>
          <span className="text-xs bg-[#334155] text-[#94A3B8] px-2.5 py-0.5 rounded-full">
            {campanas.length}
          </span>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar campaña..."
            className="bg-[#1E293B] border border-[#334155] rounded-lg pl-9 pr-4 py-2 text-sm text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:border-[#5B5CF6] w-full sm:w-48 transition-colors"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-4">
        {FILTROS.map((f) => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${filtro === f ? 'bg-[#5B5CF6] text-white' : 'bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-[#E2E8F0]'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Tabla (desktop) */}
      <div className="hidden md:block bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                {['Campaña', 'Tipo', 'Estado', 'Participantes', 'Canjes', 'Creada', ''].map((h) => (
                  <th key={h} className="text-left text-[#64748B] text-xs uppercase tracking-wide px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {campanasFiltradas.map((c) => {
                  const tipo = TIPO_CONFIG[c.tipo] ?? TIPO_CONFIG.cupon
                  const estado = ESTADO_CONFIG[c.estado] ?? ESTADO_CONFIG.borrador
                  const TipoIcono = tipo.icono
                  const conversion = c.total_participantes > 0
                    ? ((c.total_canjes / c.total_participantes) * 100).toFixed(1)
                    : '0'
                  const limite = c.configuracion?.limite_participantes

                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-[#0F172A]/50 hover:bg-[#0F172A]/40 transition-colors"
                    >
                      {/* Campaña */}
                      <td className="px-5 py-4">
                        <p className="text-[#E2E8F0] font-medium text-sm whitespace-nowrap">{c.nombre_campana}</p>
                        <p className="text-[#475569] text-xs">{c.nombre_negocio}</p>
                      </td>

                      {/* Tipo */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ color: tipo.color, backgroundColor: tipo.bg }}>
                          <TipoIcono size={11} />
                          {tipo.label}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${estado.clase}`}>
                          {estado.pulso
                            ? <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                            : <span className="w-2 h-2 rounded-full bg-current opacity-60" />}
                          {estado.label}
                        </span>
                      </td>

                      {/* Participantes */}
                      <td className="px-5 py-4">
                        <p className="text-[#E2E8F0] text-sm">{c.total_participantes.toLocaleString()}</p>
                        {limite && (
                          <div className="mt-1 w-16 h-1 bg-[#334155] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#5B5CF6] rounded-full transition-all"
                              style={{ width: `${Math.min((c.total_participantes / limite) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Canjes */}
                      <td className="px-5 py-4">
                        <p className="text-[#E2E8F0] text-sm">{c.total_canjes.toLocaleString()}</p>
                        <p className="text-[#475569] text-xs">{conversion}%</p>
                      </td>

                      {/* Fecha */}
                      <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">
                        {formatDistanceToNow(new Date(c.creado_en), { addSuffix: true, locale: es })}
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#475569] hover:text-[#94A3B8] transition-colors">
                              <MoreHorizontal size={15} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1E293B] border-[#334155] text-[#E2E8F0]">
                            <DropdownMenuItem className="gap-2 hover:bg-[#334155] cursor-pointer" asChild>
                              <a href={`/c/${c.slug}`} target="_blank" rel="noreferrer">
                                <ExternalLink size={13} /> Ver landing
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 hover:bg-[#334155] cursor-pointer" onClick={() => copiarLink(c.slug)}>
                              <Copy size={13} /> Copiar link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 hover:bg-[#334155] cursor-pointer" onClick={() => setQrCampana(c)}>
                              <QrCode size={13} /> Ver QR
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 hover:bg-[#334155] cursor-pointer" asChild>
                              <Link href={`/dashboard/campana/${c.id}`}>
                                <BarChart2 size={13} /> Ver métricas
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#334155]" />
                            <DropdownMenuItem className="gap-2 hover:bg-[#334155] cursor-pointer" onClick={() => toggleEstado(c)}>
                              {c.estado === 'activa'
                                ? <><Pause size={13} /> Pausar</>
                                : <><Play size={13} /> Reactivar</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#334155]" />
                            <DropdownMenuItem className="gap-2 text-red-400 hover:bg-red-500/10 cursor-pointer" onClick={() => setEliminarId(c.id)}>
                              <Trash size={13} /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards móvil */}
      <div className="md:hidden space-y-3">
        {campanasFiltradas.map((c) => {
          const tipo = TIPO_CONFIG[c.tipo] ?? TIPO_CONFIG.cupon
          const estado = ESTADO_CONFIG[c.estado] ?? ESTADO_CONFIG.borrador
          const TipoIcono = tipo.icono

          return (
            <div key={c.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-white font-medium text-sm">{c.nombre_campana}</p>
                  <p className="text-[#475569] text-xs">{c.nombre_negocio}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ color: tipo.color, backgroundColor: tipo.bg }}>
                    <TipoIcono size={10} />{tipo.label}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${estado.clase}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {estado.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#64748B]">
                <span className="flex items-center gap-1"><Users size={11} />{c.total_participantes.toLocaleString()}</span>
                <span>{c.total_canjes} canjes</span>
              </div>
              <div className="flex gap-2">
                <a href={`/c/${c.slug}`} target="_blank" rel="noreferrer"
                  className="flex-1 py-2 rounded-lg bg-[#0F172A] text-[#94A3B8] text-xs text-center hover:text-[#E2E8F0] transition-colors">
                  Ver landing
                </a>
                <button onClick={() => setQrCampana(c)}
                  className="flex-1 py-2 rounded-lg bg-[#0F172A] text-[#94A3B8] text-xs hover:text-[#E2E8F0] transition-colors">
                  QR
                </button>
                <button onClick={() => toggleEstado(c)}
                  className="flex-1 py-2 rounded-lg bg-[#0F172A] text-[#94A3B8] text-xs hover:text-[#E2E8F0] transition-colors">
                  {c.estado === 'activa' ? 'Pausar' : 'Activar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {campanasFiltradas.length === 0 && campanas.length > 0 && (
        <div className="text-center py-10 text-[#475569] text-sm">
          No hay campañas que coincidan con tu búsqueda.
        </div>
      )}

      {/* QR Modal */}
      {qrCampana && (
        <QRModal
          open={!!qrCampana}
          onOpenChange={(open) => !open && setQrCampana(null)}
          slug={qrCampana.slug}
          nombreCampana={qrCampana.nombre_campana}
        />
      )}

      {/* AlertDialog eliminar */}
      <AlertDialog open={!!eliminarId} onOpenChange={(open) => !open && setEliminarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta campaña?</AlertDialogTitle>
            <AlertDialogDescription>
              La campaña quedará marcada como terminada. Los participantes y códigos
              existentes se conservarán pero no se aceptarán nuevas participaciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => eliminarId && eliminarCampana(eliminarId)}>
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
