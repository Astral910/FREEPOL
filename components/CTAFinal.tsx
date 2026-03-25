'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sticker } from '@/components/ui/Sticker'

interface CTAFinalProps {
  onOpenAuth: (tab?: 'login' | 'register') => void
}

/**
 * CTA final dramático sobre rojo FREEPOL.
 */
export default function CTAFinal({ onOpenAuth }: CTAFinalProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#E8344E] px-4 py-20 md:px-8 md:py-28"
    >
      <p
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none text-[80px] font-black uppercase leading-none text-transparent opacity-[0.12] sm:text-[140px] md:text-[200px]"
        style={{ WebkitTextStroke: '2px #ffffff' }}
        aria-hidden
      >
        FREEPOL
      </p>

      <div className="pointer-events-none absolute right-6 top-8 z-10 hidden md:block">
        <Sticker rotation={5} bgColor="#0A0A0A" textColor="#FFFFFF">
          Sin tarjeta de crédito
        </Sticker>
      </div>
      <div className="pointer-events-none absolute left-6 top-10 z-10 hidden md:block">
        <Sticker rotation={-4} bgColor="#FFFFFF" textColor="#0A0A0A" borderClass="border-2 border-[#0A0A0A]">
          En 5 minutos
        </Sticker>
      </div>

      <div className="relative z-[1] mx-auto max-w-4xl text-center">
        <motion.h2
          className="font-black uppercase leading-[0.95] text-[#0A0A0A]"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span
            className="block text-4xl text-transparent md:text-7xl"
            style={{ WebkitTextStroke: '2px #ffffff' }}
          >
            ¿Listo para
          </span>
          <span className="block text-4xl text-white md:text-7xl">tu primera</span>
          <span className="block text-4xl md:text-7xl">campaña?</span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg text-white/90"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          Tu primera campaña, gratis. Sin tarjeta de crédito. Lista en 5 minutos.
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.25 }}
        >
          <button
            type="button"
            data-cursor="pointer"
            onClick={() => onOpenAuth('register')}
            className="btn-shimmer relative overflow-hidden rounded-full bg-[#0A0A0A] px-16 py-6 text-2xl font-black text-white transition-transform hover:scale-110"
          >
            Empezar ahora
          </button>
        </motion.div>
        <motion.p
          className="mt-8 text-lg text-white/80"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35 }}
        >
          Únete a las empresas que ya fidelizan con IA
        </motion.p>
      </div>
    </section>
  )
}
