'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'

interface MarketingSubpageHeaderProps {
  /** Título breve opcional bajo el logo (solo desktop) */
  subtitle?: string
}

/**
 * Navbar oscuro reutilizable para /demos, /guia, legales, etc.
 */
export default function MarketingSubpageHeader({ subtitle }: MarketingSubpageHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const surface = scrolled
    ? 'border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur-md'
    : 'bg-[#0A0A0A]'

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/demos', label: 'Demos' },
    { href: '/precios', label: 'Precios' },
    { href: '/guia', label: 'Guía' },
  ]

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 transition-colors ${surface}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <img
            src="/Letras_efecto_fondo_negro.png"
            alt="FREEPOL"
            width={120}
            height={30}
            className="h-8 w-auto mix-blend-screen transition-transform group-hover:scale-105"
          />
          {subtitle ? (
            <span className="hidden text-xs font-bold uppercase tracking-widest text-[#94A3B8] md:inline">
              {subtitle}
            </span>
          ) : null}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-white/80 transition-colors hover:text-[#E8344E]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/chat"
            data-cursor="pointer"
            className="rounded-full bg-[#E8344E] px-5 py-2 text-sm font-black text-white transition-transform hover:scale-105"
          >
            Crear campaña
          </Link>
        </nav>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu size={22} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] border-[#E8344E]/25 bg-[#0A0A0A] text-white"
            >
              <div className="mb-6 flex items-center justify-between">
                <img
                  src="/Letras_efecto_fondo_negro.png"
                  alt="FREEPOL"
                  width={110}
                  height={28}
                  className="h-7 w-auto mix-blend-screen"
                />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <X size={20} />
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-2">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-lg py-3 text-sm font-semibold text-white/85 hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/chat"
                  className="mt-4 rounded-full bg-[#E8344E] py-3 text-center text-sm font-black"
                  onClick={() => setOpen(false)}
                >
                  Crear campaña →
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
