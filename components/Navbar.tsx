'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

interface NavbarProps {
  onOpenAuth: (tab?: 'login' | 'register') => void
}

const navLinks = [
  { label: 'Producto', href: '#producto' },
  { label: 'Casos de uso', href: '#casos' },
  { label: 'Precios', href: '#precios' },
  { label: 'Guía de prompts', href: '#prompts' },
]

/**
 * Navbar fijo con comportamiento de scroll y menú móvil.
 * Se vuelve opaco y con borde al hacer scroll más de 20px.
 */
export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <Link href="/" className="flex items-center gap-1.5 group">
            <Zap size={20} className="text-[#5B5CF6]" />
            <span className="text-2xl font-bold">
              <span className="text-[#5B5CF6]">FREE</span>
              <span className="text-[#0F172A]">POL</span>
            </span>
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
            <Button
              variant="ghost"
              className="text-sm text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg"
              onClick={() => onOpenAuth('login')}
            >
              Iniciar sesión
            </Button>
            <Button
              className="text-sm px-5 py-2 rounded-lg bg-[#5B5CF6] text-white hover:brightness-110 shadow-sm hover:shadow-md hover:shadow-[#5B5CF6]/25 transition-all duration-200 flex items-center gap-2"
              onClick={() => onOpenAuth('register')}
            >
              Empezar gratis
              <ArrowRight size={15} />
            </Button>
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
                    className="flex items-center gap-1.5"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Zap size={18} className="text-[#5B5CF6]" />
                    <span className="text-xl font-bold">
                      <span className="text-[#5B5CF6]">FREE</span>
                      <span className="text-[#0F172A]">POL</span>
                    </span>
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
                    className="w-full rounded-lg bg-[#5B5CF6] text-white flex items-center justify-center gap-2"
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
