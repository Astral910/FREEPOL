'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight, Menu, X, Sparkles, Plus, LayoutDashboard, LogOut,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase'
import type { Empresa } from '@/lib/empresa'

interface NavbarProps {
  onOpenAuth: (tab?: 'login' | 'register') => void
}

const navLinks = [
  { label: 'Producto', href: '#producto' },
  { label: 'Demos', href: '/demos' },
  { label: 'Precios', href: '/precios' },
  { label: 'Guía de prompts', href: '/guia' },
]

/**
 * Navbar de marca — fondo oscuro al scroll, logo con blend, animación de entrada.
 * Mantiene detección de sesión Supabase + avatar (sin tocar APIs).
 */
export default function Navbar({ onOpenAuth }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [haySesion, setHaySesion] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const verificar = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return

      setHaySesion(true)
      const { getEmpresaDelUsuario } = await import('@/lib/empresa')
      const emp = await getEmpresaDelUsuario(data.session.user.id)
      setEmpresa(emp)
    }
    verificar()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setHaySesion(!!session)
      if (!session) setEmpresa(null)
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase.auth])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    setHaySesion(false)
    setEmpresa(null)
    router.push('/')
  }

  const inicial = empresa?.nombre?.[0]?.toUpperCase() ?? 'E'

  const headerSurface = scrolled
    ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 shadow-lg'
    : 'bg-transparent'

  const linkClass =
    'text-sm font-semibold text-white/85 hover:text-white transition-colors duration-200'

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${headerSurface}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="group flex items-center">
            {/* Logo para fondos oscuros: blend elimina el negro del PNG */}
            <img
              src="/Letras_efecto_fondo_negro.png"
              alt="FREEPOL"
              width={120}
              height={34}
              className="h-8 w-auto mix-blend-screen transition-transform duration-200 group-hover:scale-110 md:h-9"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {haySesion ? (
              <>
                <button
                  type="button"
                  data-cursor="pointer"
                  onClick={() => router.push('/chat')}
                  className="flex items-center gap-2 rounded-full bg-[#E8344E] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 hover:brightness-110"
                >
                  <Plus size={14} />
                  Nueva campaña
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-cursor="pointer"
                      className="flex items-center gap-2 rounded-xl px-2 py-1 transition-colors hover:bg-white/10"
                    >
                      <Avatar className="h-8 w-8 border border-white/20">
                        <AvatarFallback className="bg-[#1A1B4B] text-white">
                          {inicial}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border border-[#E8344E]/30 bg-[#1A1B4B] text-white"
                  >
                    <DropdownMenuLabel className="text-white/90">
                      <span className="text-sm font-semibold normal-case">
                        {empresa?.nombre ?? 'Mi empresa'}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-white/10 focus:text-white"
                      onClick={() => router.push('/dashboard')}
                    >
                      <LayoutDashboard size={14} className="mr-2" />
                      Mi dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-white/10 focus:text-white"
                      onClick={() => router.push('/chat')}
                    >
                      <Plus size={14} className="mr-2" />
                      Nueva campaña
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-300 focus:bg-red-950/40 focus:text-red-200"
                      onClick={cerrarSesion}
                    >
                      <LogOut size={14} className="mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <button
                  type="button"
                  data-cursor="pointer"
                  onClick={() => router.push('/chat')}
                  className="flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-[#F2839A]"
                >
                  <Sparkles size={14} />
                  Probar IA →
                </button>
                <button
                  type="button"
                  data-cursor="pointer"
                  onClick={() => onOpenAuth('login')}
                  className="text-sm font-semibold text-white/90 hover:text-white"
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  data-cursor="pointer"
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-2 rounded-full bg-[#E8344E] px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-105 hover:brightness-110"
                >
                  Empezar gratis
                  <ArrowRight size={15} />
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  aria-label="Abrir menú"
                >
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[280px] flex-col border-[#E8344E]/20 bg-[#0A0A0A] p-0 text-white"
              >
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    <img
                      src="/Letras_efecto_fondo_negro.png"
                      alt="FREEPOL"
                      width={110}
                      height={28}
                      className="h-7 w-auto mix-blend-screen"
                    />
                  </Link>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      aria-label="Cerrar menú"
                    >
                      <X size={20} />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex flex-1 flex-col gap-1 p-5">
                  {navLinks.map((link, index) => (
                    <div key={link.label}>
                      <Link
                        href={link.href}
                        className="block py-3 text-sm font-semibold text-white/80 transition-colors hover:text-white"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {index < navLinks.length - 1 && (
                        <Separator className="bg-white/10" />
                      )}
                    </div>
                  ))}
                </nav>

                <div className="flex flex-col gap-3 border-t border-white/10 p-5">
                  <Button
                    className="w-full gap-2 rounded-xl border border-[#E8344E]/40 bg-[#E8344E]/20 text-white hover:bg-[#E8344E]/30"
                    onClick={() => {
                      setMobileOpen(false)
                      router.push('/chat')
                    }}
                  >
                    <Sparkles size={14} />
                    Probar IA →
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
                    onClick={() => {
                      setMobileOpen(false)
                      onOpenAuth('login')
                    }}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    className="w-full gap-2 rounded-xl bg-[#E8344E] font-bold text-white hover:brightness-110"
                    onClick={() => {
                      setMobileOpen(false)
                      onOpenAuth('register')
                    }}
                  >
                    Empezar gratis
                    <ArrowRight size={15} />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
