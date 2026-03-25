'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Menu, X, Sparkles, Plus, LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
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
 * Navbar inteligente: detecta sesión activa y cambia los botones
 * por avatar + dropdown con acciones del usuario autenticado.
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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detectar sesión activa y cargar empresa
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src={scrolled ? '/logo.svg' : '/logo.svg'}
              alt="FREEPOL"
              width={140}
              height={34}
              priority
            />
          </Link>

          {/* Links de navegación — solo desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botones — solo desktop */}
          <div className="hidden md:flex items-center gap-3">
            {haySesion ? (
              /* Con sesión activa: avatar + dropdown */
              <>
                <Button
                  className="text-sm px-4 py-2 rounded-lg gradient-bg text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                  onClick={() => router.push('/chat')}
                >
                  <Plus size={14} />
                  Nueva campaña
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{inicial}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <span className="text-[#0F172A] font-semibold normal-case text-sm">{empresa?.nombre ?? 'Mi empresa'}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard')} className="gap-2">
                      <LayoutDashboard size={14} />Mi dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/chat')} className="gap-2">
                      <Plus size={14} />Nueva campaña
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-red-600 hover:text-red-700" onClick={cerrarSesion}>
                      <LogOut size={14} />Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Sin sesión: botones originales */
              <>
                <Button
                  variant="ghost"
                  className="text-sm text-[#64748B] hover:text-[#E8344E] hover:bg-[#F0F0FF] rounded-lg flex items-center gap-1.5 transition-all duration-200"
                  onClick={() => router.push('/chat')}
                >
                  <Sparkles size={14} />
                  Probar IA →
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg"
                  onClick={() => onOpenAuth('login')}
                >
                  Iniciar sesión
                </Button>
                <Button
                  className="text-sm px-5 py-2 rounded-lg bg-[#E8344E] text-white hover:brightness-110 shadow-sm hover:shadow-md hover:shadow-[#E8344E]/25 transition-all duration-200 flex items-center gap-2"
                  onClick={() => onOpenAuth('register')}
                >
                  Empezar gratis
                  <ArrowRight size={15} />
                </Button>
              </>
            )}
          </div>

          {/* Menú hamburguesa — solo móvil */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú">
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0 flex flex-col">
                {/* Header del sheet */}
                <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Image src="/logo.svg" alt="FREEPOL" width={120} height={30} priority />
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Cerrar menú">
                      <X size={20} />
                    </Button>
                  </SheetClose>
                </div>

                {/* Links de navegación */}
                <nav className="flex flex-col p-5 gap-1 flex-1">
                  {navLinks.map((link, index) => (
                    <div key={link.label}>
                      <Link
                        href={link.href}
                        className="block py-3 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {index < navLinks.length - 1 && <Separator />}
                    </div>
                  ))}
                </nav>

                {/* Botones al fondo */}
                <div className="p-5 border-t border-[#E5E7EB] flex flex-col gap-3">
                  <Button
                    className="w-full rounded-lg bg-[#FFF0F2] text-[#E8344E] border border-[#F9B8C4] flex items-center justify-center gap-2 hover:bg-[#E0E7FF]"
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
                    className="w-full rounded-lg"
                    onClick={() => {
                      setMobileOpen(false)
                      onOpenAuth('login')
                    }}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    className="w-full rounded-lg bg-[#E8344E] text-white flex items-center justify-center gap-2"
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
    </header>
  )
}
