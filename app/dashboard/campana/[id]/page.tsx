'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Pause, Play, Download, Users, Trophy, Ticket, Star, Receipt, TrendingUp, BarChart2 } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { createClient } from '@/lib/supabase'
import { getUsuarioActual } from '@/lib/auth-helpers'
import { Skeleton } from '@/components/ui/skeleton'
import toast, { Toaster } from 'react-hot-toast'

interface Campana {
  id: string
  slug: string
  nombre_campana: string
  nombre_negocio: string
  tipo: string
  estado: string
  total_participantes: number
  total_canjes: number
  creado_en: string
  configuracion: {
    premios?: { nombre: string; probabilidad: number }[]
    meta_canje?: number
    puntos_por_monto?: number
    monto_base?: number
    limite_participantes?: number
  }
}

interface Participante {
  id: string
  correo?: string
  telefono?: string
  nombre?: string
  creado_en: string
  codigos?: { premio: string; usado: boolean; expira_en: string }[]
}

interface DistribucionPremio {
  nombre: string
  probabilidadTeorica: number
  vecesGanado: number
  porcentajeReal: number
}

/**
 * Página de métricas detalladas de una campaña.
 * Muestra distribución de premios, participantes y export CSV.
 */
export default function CampanaMetricasPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const id = params?.id as string

  const [campana, setCampana] = useState<Campana | null>(null)
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [distribucion, setDistribucion] = useState<DistribucionPremio[]>([])
  const [cargando, setCargando] = useState(true)
  const [toggling, setToggling] = useState(false)

  const cargar = useCallback(async () => {
    const usuario = await getUsuarioActual()
    if (!usuario) { router.push('/'); return }

    const { data: camp } = await supabase
      .from('campanas')
      .select('*')
      .eq('id', id)
      .eq('creado_por', usuario.id)
      .maybeSingle()

    if (!camp) { router.push('/dashboard'); return }
    setCampana(camp as Campana)

    // Últimos 50 participantes con sus códigos
    const { data: parts } = await supabase
      .from('participantes')
      .select('id,correo,telefono,nombre,creado_en,codigos(premio,usado,expira_en)')
      .eq('campana_id', id)
      .order('creado_en', { ascending: false })
      .limit(50)

    setParticipantes((parts as Participante[]) ?? [])

    // Distribución de premios para ruleta
    if (camp.tipo === 'ruleta') {
      const { data: codigos } = await supabase
        .from('codigos')
        .select('premio')
        .eq('campana_id', id)

      const conteo: Record<string, number> = {}
      if (codigos) {
        for (const c of codigos) conteo[c.premio] = (conteo[c.premio] ?? 0) + 1
      }

      const total = codigos?.length ?? 0
      const premios = (camp as Campana).configuracion?.premios ?? []
      setDistribucion(
        premios.map((p) => ({
          nombre: p.nombre,
          probabilidadTeorica: p.probabilidad,
          vecesGanado: conteo[p.nombre] ?? 0,
          porcentajeReal: total > 0 ? ((conteo[p.nombre] ?? 0) / total) * 100 : 0,
        })),
      )
    }

    setCargando(false)
  }, [id, router, supabase])

  useEffect(() => { cargar() }, [cargar])

  const toggleEstado = async () => {
    if (!campana) return
    setToggling(true)
    const nuevoEstado = campana.estado === 'activa' ? 'pausada' : 'activa'
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ''
    const res = await fetch(`/api/campana/${campana.id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
    if (res.ok) {
      setCampana((prev) => prev ? { ...prev, estado: nuevoEstado } : prev)
      toast.success(nuevoEstado === 'activa' ? 'Campaña activada' : 'Campaña pausada')
    } else {
      toast.error('Error al cambiar el estado')
    }
    setToggling(false)
  }

  const exportarCSV = () => {
    if (!campana) return
    const headers = 'correo,telefono,nombre,fecha_registro,premio,canjeado'
    const filas = participantes.map((p) => {
      const codigo = p.codigos?.[0]
      return [
        p.correo ?? '',
        p.telefono ?? '',
        p.nombre ?? '',
        format(new Date(p.creado_en), 'yyyy-MM-dd HH:mm'),
        codigo?.premio ?? '',
        codigo?.usado ? 'sí' : 'no',
      ].join(',')
    })
    const csv = [headers, ...filas].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${campana.slug}-participantes.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV descargado')
  }

  const TIPO_ICONO: Record<string, React.ElementType> = { ruleta: Trophy, puntos: Star, cupon: Ticket, factura: Receipt }
  const TipoIcono = TIPO_ICONO[campana?.tipo ?? 'cupon'] ?? Ticket

  if (cargando) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-8 space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl bg-[#F1F5F9]" />
        <Skeleton className="h-24 w-full rounded-2xl bg-[#F1F5F9]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl bg-[#F1F5F9]" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl bg-[#F1F5F9]" />
      </div>
    )
  }

  if (!campana) return null

  const conversion = campana.total_participantes > 0
    ? ((campana.total_canjes / campana.total_participantes) * 100).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" toastOptions={{ style: { background: '#FFFFFF', color: '#0F172A', border: '1px solid #E5E7EB', borderRadius: '12px' } }} />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Header / Breadcrumb */}
        <div className="space-y-4">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[#64748B] text-sm hover:text-[#E8344E] transition-colors">
            <ArrowLeft size={13} /> Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <TipoIcono size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">{campana.nombre_campana}</h1>
                <p className="text-[#64748B] text-sm">{campana.nombre_negocio}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${campana.estado === 'activa' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                {campana.estado === 'activa' ? '● Activa' : '● Pausada'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a href={`/c/${campana.slug}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#64748B] text-sm hover:text-[#E8344E] hover:bg-[#FFF0F2] transition-all">
                <ExternalLink size={13} /> Ver landing
              </a>
              <button onClick={toggleEstado} disabled={toggling}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#64748B] text-sm hover:text-[#E8344E] hover:bg-[#FFF0F2] transition-all disabled:opacity-50">
                {campana.estado === 'activa' ? <><Pause size={13} /> Pausar</> : <><Play size={13} /> Activar</>}
              </button>
            </div>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Participantes', valor: campana.total_participantes.toLocaleString(), icono: Users, color: '#22C55E' },
            { label: 'Canjes', valor: campana.total_canjes.toLocaleString(), icono: TipoIcono, color: '#E8344E' },
            { label: 'Conversión', valor: `${conversion}%`, icono: TrendingUp, color: '#F59E0B' },
            {
              label: campana.configuracion.limite_participantes ? 'Disponibles' : 'Sin límite',
              valor: campana.configuracion.limite_participantes
                ? `${Math.max(0, campana.configuracion.limite_participantes - campana.total_participantes).toLocaleString()}`
                : '∞',
              icono: BarChart2,
              color: '#F2839A',
            },
          ].map((m) => {
            const Icono = m.icono
            return (
              <div key={m.label} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm">
                <Icono size={16} style={{ color: m.color }} className="mb-2" />
                <p className="text-2xl font-bold text-[#0F172A]">{m.valor}</p>
                <p className="text-[#64748B] text-xs mt-0.5">{m.label}</p>
              </div>
            )
          })}
        </div>

        {/* Distribución de premios — solo ruleta */}
        {campana.tipo === 'ruleta' && distribucion.length > 0 && (
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
            <h2 className="text-[#0F172A] font-semibold">Distribución de premios</h2>
            <div className="space-y-4">
              {distribucion.map((p) => (
                <div key={p.nombre} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#0F172A] font-medium">{p.nombre}</span>
                    <div className="flex items-center gap-3 text-xs text-[#64748B]">
                      <span>Teórico: {p.probabilidadTeorica}%</span>
                      <span className="text-[#94A3B8]">Real: {p.porcentajeReal.toFixed(1)}%</span>
                      <span className="text-[#E8344E]">{p.vecesGanado}× ganado</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-4">
                    <div className="flex-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#E8344E]/40 rounded-full transition-all" style={{ width: `${p.probabilidadTeorica}%` }} />
                    </div>
                    <div className="flex-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#22C55E] rounded-full transition-all" style={{ width: `${Math.min(p.porcentajeReal, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>Probabilidad configurada</span>
                    <span>Resultado real</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mecánica de puntos — solo puntos/factura */}
        {(campana.tipo === 'puntos' || campana.tipo === 'factura') && campana.configuracion.meta_canje && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-[#0F172A] font-semibold">Mecánica de puntos</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
                <p className="text-2xl font-bold text-[#E8344E]">{campana.configuracion.puntos_por_monto ?? '?'}</p>
                <p className="text-[#64748B] text-xs">puntos por ${campana.configuracion.monto_base ?? '?'}</p>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
                <p className="text-2xl font-bold text-[#F59E0B]">{campana.configuracion.meta_canje}</p>
                <p className="text-[#64748B] text-xs">puntos para canjear</p>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
                <p className="text-2xl font-bold text-[#22C55E]">{campana.total_canjes}</p>
                <p className="text-[#64748B] text-xs">metas alcanzadas</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabla participantes */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h2 className="text-[#0F172A] font-semibold">Últimos participantes</h2>
              <p className="text-[#64748B] text-xs">Mostrando hasta 50 recientes</p>
            </div>
            <button onClick={exportarCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#64748B] text-sm hover:bg-[#F8FAFC] hover:text-[#E8344E] transition-all">
              <Download size={13} /> Exportar CSV
            </button>
          </div>

          {participantes.length === 0 ? (
            <div className="p-10 text-center text-[#64748B] text-sm">
              Aún no hay participantes en esta campaña.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    {['Participante', 'Registrado', 'Premio', 'Estado código'].map((h) => (
                      <th key={h} className="text-left text-[#64748B] text-xs uppercase tracking-wide px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {participantes.map((p) => {
                    const codigo = p.codigos?.[0]
                    const identidad = p.correo ?? p.telefono ?? p.nombre ?? 'Anónimo'
                    return (
                      <tr key={p.id} className="hover:bg-[#FFF0F2]/40 transition-colors">
                        <td className="px-5 py-3">
                          <p className="text-[#0F172A] text-sm">{identidad}</p>
                        </td>
                        <td className="px-5 py-3 text-[#64748B] text-xs whitespace-nowrap">
                          {formatDistanceToNow(new Date(p.creado_en), { addSuffix: true, locale: es })}
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[#94A3B8] text-sm">{codigo?.premio ?? '—'}</span>
                        </td>
                        <td className="px-5 py-3">
                          {codigo ? (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${codigo.usado ? 'bg-green-500/10 text-green-400' : new Date(codigo.expira_en) < new Date() ? 'bg-red-500/10 text-red-400' : 'bg-[#E8344E]/10 text-[#E8344E]'}`}>
                              {codigo.usado ? 'Canjeado' : new Date(codigo.expira_en) < new Date() ? 'Expirado' : 'Pendiente'}
                            </span>
                          ) : (
                            <span className="text-[#475569] text-xs">Sin código</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
