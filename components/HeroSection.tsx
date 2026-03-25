'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Sticker } from '@/components/ui/Sticker'

interface HeroSectionProps {
  onOpenAuth: (tab?: 'login' | 'register') => void
}

const BURBUJAS = [
  {
    id: '1',
    lado: 'ia' as const,
    texto: 'Hola 👋 Describe tu campaña en lenguaje natural…',
    bg: 'bg-white/10 border border-white/15 text-white',
  },
  {
    id: '2',
    lado: 'user' as const,
    texto:
      'Quiero una ruleta para mi restaurante este mes con 3 premios y antifraude activo.',
    bg: 'bg-[#E8344E] text-white border border-[#E8344E]',
  },
  {
    id: '3',
    lado: 'ia' as const,
    texto:
      '✅ Listo. Campaña «Sabor Ganador» configurada. 3 premios, antifraude activo.',
    bg: 'bg-[#22C55E]/20 border border-[#22C55E]/40 text-white',
  },
]

/**
 * Hero principal — tipografía poster, mockup de chat animado, CTAs con shimmer.
 */
export default function HeroSection({ onOpenAuth }: HeroSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [burbujaIdx, setBurbujaIdx] = useState(0)

  useEffect(() => {
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const queue = (fn: () => void, ms: number) => {
      timeouts.push(setTimeout(fn, ms))
    }

    const ciclo = () => {
      if (cancelled) return
      queue(() => {
        if (cancelled) return
        setBurbujaIdx(1)
        queue(() => {
          if (cancelled) return
          setBurbujaIdx(2)
          queue(() => {
            if (cancelled) return
            setBurbujaIdx(3)
            queue(() => {
              if (cancelled) return
              setBurbujaIdx(0)
              queue(ciclo, 500)
            }, 3600)
          }, 800)
        }, 800)
      }, 800)
    }

    queue(ciclo, 600)
    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [])

  const visible = BURBUJAS.slice(0, burbujaIdx)

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0A0A0A] pt-24 pb-16 md:pt-28 md:pb-24"
    >
      {/* Manchas difusas */}
      <div
        className="pointer-events-none absolute -left-32 -top-24 h-80 w-80 rounded-full bg-[#E8344E]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#1A1B4B]/30 blur-3xl"
        aria-hidden
      />
      {/* Grid de puntos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:px-8">
        {/* Zona izquierda */}
        <div>
          <motion.div
            initial={false}
            animate={isInView ? { opacity: 1, rotate: -2, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#E8344E] px-4 py-2"
          >
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#22C55E]" />
            <span className="text-sm font-black uppercase tracking-wider text-[#E8344E]">
              ⚡ POWERED BY AI
            </span>
          </motion.div>

          <div className="space-y-2 font-black uppercase leading-[0.92] tracking-tight text-white">
            <motion.h1
              className="text-[48px] sm:text-[64px] md:text-[100px] lg:text-[130px]"
              style={{
                WebkitTextStroke: '2px #ffffff',
                color: 'transparent',
              }}
              initial={{ opacity: 0, x: -48 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55 }}
            >
              DESCRIBE
            </motion.h1>
            <motion.p
              className="text-[40px] sm:text-[52px] md:text-[80px] lg:text-[110px] text-white"
              initial={{ opacity: 0, x: -48 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              TU CAMPAÑA
            </motion.p>
            <motion.p
              className="text-[34px] sm:text-[44px] md:text-[70px] lg:text-[100px]"
              initial={{ opacity: 0, x: -48 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.3 }}
            >
              <span className="text-[#E8344E]">LA IA</span>{' '}
              <span className="text-white">LA LANZA.</span>
            </motion.p>
          </div>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {[
              { emoji: '🎰', label: 'Ruletas' },
              { emoji: '⭐', label: 'Puntos' },
              { emoji: '🎟️', label: 'Cupones' },
            ].map((p) => (
              <span
                key={p.label}
                className="inline-flex cursor-default items-center gap-2 rounded-full border-2 border-white bg-black px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-[#E8344E]"
              >
                {p.emoji} {p.label}
              </span>
            ))}
          </motion.div>

          <motion.p
            className="mt-6 text-lg text-[#94A3B8]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.55 }}
          >
            WhatsApp · Telegram · Y más canales · Sin código.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 36 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <button
              type="button"
              data-cursor="pointer"
              onClick={() => onOpenAuth('register')}
              className="btn-shimmer relative overflow-hidden rounded-full bg-[#E8344E] px-10 py-5 text-xl font-bold text-white transition-transform hover:scale-105"
            >
              Empezar gratis
            </button>
            <Link
              href="/chat"
              data-cursor="pointer"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-10 py-5 text-center text-xl font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              Crear con IA
            </Link>
          </motion.div>

          <div className="pointer-events-none relative mt-12 hidden sm:block">
            <div className="absolute -bottom-6 left-0">
              <Sticker rotation={-5} bgColor="#0A0A0A" textColor="#FFFFFF">
                SIN CÓDIGO
              </Sticker>
            </div>
          </div>
        </div>

        {/* Zona derecha — mockup */}
        <motion.div
          className="relative mx-auto w-full max-w-md md:mx-0 md:max-w-none"
          initial={{ opacity: 0, x: 56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="absolute -left-2 top-10 z-20 md:-left-6"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <Sticker rotation={15} bgColor="#E8344E" borderClass="border-2 border-white/80">
              LIVE
            </Sticker>
          </motion.div>

          <motion.span
            className="absolute -right-2 top-0 z-20 text-4xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            🎰
          </motion.span>
          <motion.span
            className="absolute -bottom-4 right-8 z-20 text-3xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            ⚡
          </motion.span>

          <div className="rounded-2xl border border-white/10 bg-[#1A1B4B] p-4 shadow-2xl shadow-black/50 md:p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 font-mono text-xs text-white/40">chat.freepol.app</span>
            </div>
            <div className="flex min-h-[220px] flex-col gap-3 md:min-h-[260px]">
              <AnimatePresence initial={false}>
                {visible.map((b) => (
                  <motion.div
                    key={b.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45 }}
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                      b.lado === 'user' ? 'ml-auto' : 'mr-auto'
                    } ${b.bg}`}
                  >
                    {b.texto}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
