'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Zap, LayoutDashboard, MessageSquare, QrCode, Users,
  Settings, LogOut, Menu, X, Bell,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { getEmpresaDelUsuario, type Empresa } from '@/lib/empresa'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import MetricasCards from '@/components/dashboard/MetricasCards'
import ListaCampanas from '@/components/dashboard/ListaCampanas'
import AlianzasSection from '@/components/dashboard/AlianzasSection'
import type { User } from '@supabase/supabase-js'

const PLAN_BADGE: Record<string, string> = {
  free: 'bg-[#1E293B] border-[#334155] text-[#94A3B8]',
  starter: 'bg-[#064E3B]/30 border-[#22C55E] text-[#22C55E]',
  pro: 'bg-[#1E1B4B]/30 border-[#5B5CF6] text-[#5B5CF6]',
  enterprise: 'bg-gradient-to-r from-[#1E1B4B]/30 to-[#1E293B] border-[#F59E0B] text-[#F59E0B]',
}

const PLAN_LABEL: Record<string, string> = {
  free: 'Free', starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise',
}

/**
 * Dashboard principal del empresario.
 * Requiere sesión activa; redirige a '/' o '/onboarding' si no la hay.
 */
export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [usuario, setUsuario] = useState<User | null>(null)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [campanasActivas, setCampanasActivas] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const init = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/'); return }

    const emp = await getEmpresaDelUsuario(session.user.id)
    if (!emp) { router.push('/onboarding'); return }

    setUsuario(session.user)
    setEmpresa(emp)

    // Contar campañas activas para el header
    const { count } = await supabase
      .from('campanas')
      .select('*', { count: 'exact', head: true })
      .eq('creado_por', session.user.id)
      .eq('estado', 'activa')

    setCampanasActivas(count ?? 0)
    setCargando(false)
  }, [router, supabase])

  useEffect(() => {
    init()
  }, [init])

  // Realtime — nuevo participante → toast
  useEffect(() => {
    if (!usuario) return
    const channel = supabase
      .channel(`participantes-${usuario.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participantes' }, (payload) => {
        const p = payload.new as { correo?: string; nombre?: string }
        toast(`🎉 Nuevo participante: ${p.correo ?? p.nombre ?? 'anónimo'}`, {
          style: { background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155', borderRadius: '12px' },
        })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [usuario, supabase])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0F172A] p-8 space-y-6">
        <div className="h-16 bg-[#1E293B] border-b border-[#1E293B] rounded-b-none" />
        <div className="max-w-7xl mx-auto space-y-6 pt-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!empresa || !usuario) return null

  const inicial = empresa.nombre[0]?.toUpperCase() ?? 'E'
  const planClass = PLAN_BADGE[empresa.plan] ?? PLAN_BADGE.free
  const planLabel = PLAN_LABEL[empresa.plan] ?? empresa.plan

  const NavLinks = (
    <nav className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
      {[
        { href: '/dashboard', label: 'Campañas', icono: LayoutDashboard },
        { href: '/chat', label: 'Nueva campaña', icono: MessageSquare },
        { href: '/validar', label: 'Validar código', icono: QrCode },
      ].map(({ href, label, icono: Icono }) => (
        <Link key={href} href={href}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E293B] transition-all md:hover:bg-transparent md:hover:text-[#E2E8F0]"
          onClick={() => setMobileOpen(false)}>
          <Icono size={14} />
          {label}
        </Link>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155', borderRadius: '12px' } }} />

      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-[#0F172A] border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/logo-dark.svg" alt="FREEPOL" width={120} height={30} priority />
          </Link>

          <div className="w-px h-5 bg-[#334155] hidden md:block" />

          {/* Links desktop */}
          <div className="hidden md:flex flex-1">{NavLinks}</div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Badge plan */}
            <span className={`hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${planClass}`}>
              {planLabel}
            </span>

            {/* Avatar + dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-[#1E293B] transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback style={{ background: `linear-gradient(135deg, ${empresa.color_primario}, #A855F7)` }}>
                      {inicial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1E293B] border-[#334155] text-[#E2E8F0] w-52">
                <DropdownMenuLabel>
                  <p className="text-[#E2E8F0] font-semibold normal-case text-sm">{empresa.nombre}</p>
                  <p className="text-[#64748B] text-xs font-normal truncate">{usuario.email}</p>
                  <span className={`mt-1 inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${planClass}`}>
                    Plan {planLabel}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#334155]" />
                <DropdownMenuItem asChild className="gap-2 hover:bg-[#334155] cursor-pointer">
                  <Link href="/dashboard"><LayoutDashboard size={13} />Mi dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 hover:bg-[#334155] cursor-pointer">
                  <Link href="/chat"><MessageSquare size={13} />Nueva campaña</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 hover:bg-[#334155] cursor-pointer">
                  <Link href="/validar"><QrCode size={13} />Validar código</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#334155]" />
                <DropdownMenuItem asChild className="gap-2 hover:bg-[#334155] cursor-pointer">
                  <Link href="/dashboard/config"><Settings size={13} />Configuración</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#334155]" />
                <DropdownMenuItem className="gap-2 text-red-400 hover:bg-red-500/10 cursor-pointer" onClick={cerrarSesion}>
                  <LogOut size={13} />Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburguesa móvil */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="text-[#94A3B8] hover:text-white transition-colors">
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-[#1E293B] border-r border-[#334155] p-0">
                <div className="p-5 border-b border-[#334155] flex items-center justify-between">
                  <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                    <Image src="/logo-dark.svg" alt="FREEPOL" width={100} height={25} priority />
                  </Link>
                </div>
                <div className="p-4">
                  {NavLinks}
                  <div className="mt-4 pt-4 border-t border-[#334155] space-y-1">
                    <Link href="/dashboard/config" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#334155] transition-all">
                      <Settings size={14} />Configuración
                    </Link>
                    <button onClick={cerrarSesion}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                      <LogOut size={14} />Cerrar sesión
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <DashboardHeader
          empresa={empresa}
          nombreUsuario={usuario.user_metadata?.full_name ?? undefined}
          campanasActivas={campanasActivas}
        />

        <MetricasCards
          userId={usuario.id}
          colorPrimario={empresa.color_primario}
          supabase={supabase}
        />

        <ListaCampanas userId={usuario.id} supabase={supabase} />

        <AlianzasSection userId={usuario.id} userEmail={usuario.email ?? ''} supabase={supabase} />
      </main>
    </div>
  )
}
