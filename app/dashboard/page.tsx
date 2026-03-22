'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap, Plus, Rocket, Users, Award, TrendingUp, ExternalLink,
  PauseCircle, PlayCircle, QrCode, MoreHorizontal, Handshake,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getUsuarioConEmpresa } from '@/lib/auth-helpers'
import type { Empresa } from '@/lib/empresa'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { User } from '@supabase/supabase-js'

interface CampanaRow {
  id: string
  slug: string
  nombre_campana: string
  nombre_negocio: string
  tipo: string
  estado: string
  total_participantes: number
  total_canjes: number
  creado_en: string
}

interface Alianza {
  id: string
  campana_id: string
  correo_aliado: string
  estado: string
  campanas: { nombre_campana: string } | null
}

const BADGE_ESTADO: Record<string, { label: string; className: string }> = {
  activa: { label: 'Activa', className: 'bg-green-100 text-green-700' },
  pausada: { label: 'Pausada', className: 'bg-orange-100 text-orange-700' },
  terminada: { label: 'Terminada', className: 'bg-[#F1F5F9] text-[#64748B]' },
  borrador: { label: 'Borrador', className: 'bg-[#F1F5F9] text-[#94A3B8]' },
}

const TIPO_LABEL: Record<string, string> = {
  ruleta: '🎡 Ruleta', puntos: '⭐ Puntos', cupon: '🎟️ Cupón', factura: '📄 Factura',
}

const PLAN_BADGE: Record<string, { label: string; className: string }> = {
  free: { label: 'Free', className: 'bg-[#F1F5F9] text-[#64748B]' },
  pro: { label: 'Pro', className: 'bg-[#EEF2FF] text-[#5B5CF6]' },
  enterprise: { label: 'Enterprise', className: 'bg-[#0F172A] text-white' },
}

function saludar(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [usuario, setUsuario] = useState<User | null>(null)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [campanas, setCampanas] = useState<CampanaRow[]>([])
  const [alianzas, setAlianzas] = useState<Alianza[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const init = async () => {
      const datos = await getUsuarioConEmpresa()
      if (!datos) { router.push('/'); return }
      if (!datos.empresa) { router.push('/onboarding'); return }

      setUsuario(datos.usuario)
      setEmpresa(datos.empresa)

      // Cargar campañas del usuario
      const { data: camps } = await supabase
        .from('campanas')
        .select('id,slug,nombre_campana,nombre_negocio,tipo,estado,total_participantes,total_canjes,creado_en')
        .eq('creado_por', datos.usuario.id)
        .order('creado_en', { ascending: false })

      setCampanas((camps as CampanaRow[]) ?? [])

      // Cargar alianzas
      const { data: alz } = await supabase
        .from('campana_aliados')
        .select('id,campana_id,correo_aliado,estado,campanas(nombre_campana)')
        .order('creado_en', { ascending: false })

      setAlianzas((alz as unknown as Alianza[]) ?? [])
      setCargando(false)
    }
    init()
  }, [router, supabase])

  const toggleEstado = async (campana: CampanaRow) => {
    const nuevoEstado = campana.estado === 'activa' ? 'pausada' : 'activa'
    await supabase.from('campanas').update({ estado: nuevoEstado }).eq('id', campana.id)
    setCampanas((prev) => prev.map((c) => c.id === campana.id ? { ...c, estado: nuevoEstado } : c))
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (cargando) {
    return (
      <div className="h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#5B5CF6] border-t-transparent animate-spin" />
      </div>
    )
  }

  const totalParticipantes = campanas.reduce((a, c) => a + c.total_participantes, 0)
  const totalCanjes = campanas.reduce((a, c) => a + c.total_canjes, 0)
  const tasaConversion = totalParticipantes > 0 ? Math.round((totalCanjes / totalParticipantes) * 100) : 0
  const campanaActivas = campanas.filter((c) => c.estado === 'activa').length

  const planData = PLAN_BADGE[empresa?.plan ?? 'free']
  const inicial = empresa?.nombre?.[0]?.toUpperCase() ?? 'E'

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navbar del dashboard */}
      <header className="sticky top-0 z-30 bg-[#0F172A] border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1.5">
              <Zap size={16} className="text-[#5B5CF6]" />
              <span className="font-bold text-white text-sm"><span className="text-[#5B5CF6]">FREE</span>POL</span>
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-sm">
              <Link href="/dashboard" className="text-[#E2E8F0] font-medium">Mis campañas</Link>
              <Link href="/chat" className="text-[#64748B] hover:text-[#94A3B8] transition-colors">Nueva campaña</Link>
              <Link href="/validar" className="text-[#64748B] hover:text-[#94A3B8] transition-colors">Validar código</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/chat" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              <Plus size={14} /> Nueva campaña
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#1E293B] transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{inicial}</AvatarFallback>
                  </Avatar>
                  <span className="text-[#E2E8F0] text-sm font-medium hidden md:block">{empresa?.nombre}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="text-[#0F172A] font-semibold normal-case text-sm">{empresa?.nombre}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${planData.className}`}>{planData.label}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>Mi dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/chat')}>Nueva campaña</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 hover:text-red-700" onClick={cerrarSesion}>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Saludo */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {saludar()}, <span className="gradient-text">{empresa?.nombre}</span> 👋
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            {campanaActivas > 0
              ? `Tienes ${campanaActivas} campaña${campanaActivas !== 1 ? 's' : ''} activa${campanaActivas !== 1 ? 's' : ''}.`
              : 'Crea tu primera campaña para empezar.'}
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Campañas activas', valor: campanaActivas, icono: Rocket, color: 'text-[#5B5CF6]', bg: 'bg-[#EEF2FF]' },
            { label: 'Total participantes', valor: totalParticipantes.toLocaleString(), icono: Users, color: 'text-[#22C55E]', bg: 'bg-[#F0FDF4]' },
            { label: 'Total canjes', valor: totalCanjes.toLocaleString(), icono: Award, color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]' },
            { label: 'Tasa conversión', valor: `${tasaConversion}%`, icono: TrendingUp, color: 'text-[#A855F7]', bg: 'bg-[#FAF5FF]' },
          ].map((m, i) => {
            const Icono = m.icono
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
                  <Icono size={18} className={m.color} />
                </div>
                <p className="text-2xl font-bold text-white">{m.valor}</p>
                <p className="text-[#64748B] text-xs mt-0.5">{m.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Lista de campañas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Mis campañas</h2>
            <Link href="/chat" className="text-[#5B5CF6] text-sm hover:text-[#A855F7] transition-colors flex items-center gap-1">
              <Plus size={14} /> Nueva
            </Link>
          </div>

          {campanas.length === 0 ? (
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0F172A] flex items-center justify-center mx-auto">
                <Rocket size={28} className="text-[#475569]" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Aún no tienes campañas</p>
                <p className="text-[#64748B] text-sm mt-1">Crea tu primera campaña con la IA en minutos</p>
              </div>
              <Link href="/chat" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-bold hover:opacity-90 transition-opacity">
                <Plus size={16} /> Crear mi primera campaña
              </Link>
            </div>
          ) : (
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#334155]">
                      {['Campaña', 'Tipo', 'Estado', 'Participantes', 'Canjes', 'Acciones'].map((h) => (
                        <th key={h} className="text-left text-[#64748B] text-xs uppercase tracking-wide px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    {campanas.map((c) => {
                      const badge = BADGE_ESTADO[c.estado] ?? BADGE_ESTADO.borrador
                      return (
                        <tr key={c.id} className="hover:bg-[#0F172A]/50 transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-[#E2E8F0] font-medium text-sm whitespace-nowrap">{c.nombre_campana}</p>
                            <p className="text-[#475569] text-xs">{c.nombre_negocio}</p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-[#94A3B8] text-sm">{TIPO_LABEL[c.tipo] ?? c.tipo}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.className}`}>{badge.label}</span>
                          </td>
                          <td className="px-5 py-4 text-[#94A3B8] text-sm">{c.total_participantes.toLocaleString()}</td>
                          <td className="px-5 py-4 text-[#94A3B8] text-sm">{c.total_canjes.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <a href={`/c/${c.slug}`} target="_blank" rel="noreferrer"
                                className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#475569] hover:text-[#5B5CF6] transition-colors" title="Ver landing">
                                <ExternalLink size={14} />
                              </a>
                              <button onClick={() => toggleEstado(c)}
                                className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#475569] hover:text-[#22C55E] transition-colors"
                                title={c.estado === 'activa' ? 'Pausar' : 'Activar'}>
                                {c.estado === 'activa' ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Alianzas activas */}
        {alianzas.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Handshake size={18} className="text-[#5B5CF6]" />
              <h2 className="text-white font-bold text-lg">Colaboraciones activas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {alianzas.map((a) => {
                const isActiva = a.estado === 'activa'
                return (
                  <div key={a.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[#E2E8F0] font-medium text-sm">
                        {(a.campanas as { nombre_campana?: string } | null)?.nombre_campana ?? 'Campaña'}
                      </p>
                      <p className="text-[#64748B] text-xs mt-0.5">{a.correo_aliado}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${isActiva ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {isActiva ? 'Activa' : 'Pendiente'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* FAB flotante */}
      <Link href="/chat"
        className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3.5 rounded-2xl gradient-bg text-white font-bold shadow-xl shadow-[#5B5CF6]/25 hover:opacity-90 transition-opacity z-20">
        <Plus size={18} />
        <span className="hidden sm:inline">Nueva campaña</span>
      </Link>
    </div>
  )
}
