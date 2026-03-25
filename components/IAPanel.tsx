'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sticker } from '@/components/ui/Sticker'
import { Check } from 'lucide-react'

const INDUSTRIAS = ['Restaurante', 'Retail', 'Gasolinera', 'E-commerce'] as const

const PROMPTS: Record<(typeof INDUSTRIAS)[number], string> = {
  Restaurante:
    'Ruleta para mi restaurante: 15% dto, postre gratis, menú — WhatsApp, un giro por correo.',
  Retail:
    'Puntos en mi tienda: $25 = 1 punto, 30 puntos = $15 dto, canal WhatsApp.',
  Gasolinera:
    'Alianza con super: facturas $30+ acumulan puntos para $5 de descuento en combustible.',
  'E-commerce':
    'Cupón flash: 25% dto, máximo 500 códigos, botón a mi tienda online.',
}

/**
 * Panel de IA — tabs por industria + terminal con efecto máquina de escribir.
 */
export default function IAPanel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [tab, setTab] = useState<(typeof INDUSTRIAS)[number]>('Restaurante')
  const [typed, setTyped] = useState('')
  const full = PROMPTS[tab]

  useEffect(() => {
    setTyped('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(full.slice(0, i))
      if (i >= full.length) clearInterval(id)
    }, 28)
    return () => clearInterval(id)
  }, [full, tab])

  return (
    <section ref={ref} className="bg-[#0A0A0A] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <h2 className="font-black uppercase leading-[0.95] tracking-tight text-white">
            <span
              className="block text-4xl text-transparent md:text-7xl"
              style={{ WebkitTextStroke: '2px #ffffff' }}
            >
              Escríbelo
            </span>
            <span className="block text-4xl md:text-7xl">como se te</span>
            <span className="block text-4xl text-[#E8344E] md:text-7xl">ocurra.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-[#94A3B8]">
            FREEPOL fue entrenada para entender cómo hablan los empresarios de Latinoamérica. Sin
            tecnicismos.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {INDUSTRIAS.map((ind) => (
              <button
                key={ind}
                type="button"
                data-cursor="pointer"
                onClick={() => setTab(ind)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  tab === ind
                    ? 'bg-[#E8344E] text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          <motion.span
            className="absolute -left-2 -top-10 z-10 text-4xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            🤖
          </motion.span>
          <div className="absolute -right-4 top-4 z-10 hidden sm:block">
            <Sticker rotation={5} bgColor="#E8344E" borderClass="border border-white/40">
              AI powered
            </Sticker>
          </div>

          <div className="rounded-2xl border-2 border-[#E8344E] bg-[#0D0D0D] p-4 shadow-2xl">
            <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-2 font-mono text-xs text-white/40">prompt.freepol.ai</span>
            </div>
            <p className="min-h-[120px] font-mono text-sm leading-relaxed text-[#22C55E] md:text-base">
              {typed}
              <span className="ml-0.5 inline-block min-w-[0.5ch] animate-pulse font-mono text-[#22C55E]">
                │
              </span>
            </p>
          </div>
          <motion.div
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#22C55E]/20 px-4 py-2 text-sm font-bold text-[#22C55E]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Check size={18} strokeWidth={3} />
            </motion.span>
            Reglas y premios detectados automáticamente
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
