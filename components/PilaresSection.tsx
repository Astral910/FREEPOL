'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, Share2, ShieldCheck } from 'lucide-react'
import { Marquee } from '@/components/ui/Marquee'

const CARDS = [
  {
    titulo: 'Motor de IA',
    descripcion:
      'Escribe como hablas. La IA convierte tu descripción en una campaña técnicamente perfecta.',
    bg: 'bg-[#E8344E] text-white',
    badge: 'natural language',
    icon: Brain,
    iconWrap: 'bg-white/15 text-white',
  },
  {
    titulo: 'Omnicanal',
    descripcion:
      'WhatsApp y Telegram activos desde el primer día. Instagram y más próximamente.',
    bg: 'bg-white text-[#0A0A0A]',
    badge: 'channels',
    icon: Share2,
    iconWrap: 'bg-[#E8344E]/15 text-[#E8344E]',
  },
  {
    titulo: 'Soberanía de datos',
    descripcion:
      'Tu base de datos. Tus clientes. Tu remarketing. FREEPOL no retiene nada.',
    bg: 'bg-[#1A1B4B] text-white',
    badge: 'data ownership',
    icon: ShieldCheck,
    iconWrap: 'bg-[#E8344E]/25 text-[#F2839A]',
  },
]

/**
 * Pilares — contraste negro / cards de color / marquee divisor.
 */
export default function PilaresSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <>
      <div className="bg-[#0A0A0A] py-3">
        <Marquee speed={22} className="py-2 font-black uppercase tracking-widest text-[#E8344E]">
          <span>Fideliza</span>
          <span>·</span>
          <span>Automatiza</span>
          <span>·</span>
          <span>Escala</span>
          <span>·</span>
          <span>Fideliza</span>
          <span>·</span>
          <span>Automatiza</span>
          <span>·</span>
          <span>Escala</span>
          <span>·</span>
        </Marquee>
      </div>

      <section ref={ref} className="bg-[#0A0A0A] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 md:mb-16">
            <motion.h2
              className="font-black uppercase leading-[0.95] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55 }}
            >
              <span
                className="block text-[56px] text-transparent sm:text-[80px] md:text-[120px]"
                style={{ WebkitTextStroke: '3px #E8344E' }}
              >
                TODO
              </span>
              <span className="block text-[32px] text-white sm:text-4xl md:text-6xl">
                LO QUE NECESITAS
              </span>
              <span className="block text-[32px] text-[#E8344E] sm:text-4xl md:text-6xl">
                PARA FIDELIZAR
              </span>
            </motion.h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.article
                  key={card.titulo}
                  className={`rounded-3xl p-8 md:p-10 ${card.bg} hover:scale-[1.03] transition-transform duration-300`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <div
                    className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconWrap}`}
                  >
                    <Icon size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 text-2xl font-black md:text-3xl">{card.titulo}</h3>
                  <p className="mb-6 text-base font-medium leading-relaxed opacity-95">
                    {card.descripcion}
                  </p>
                  <span className="inline-block rotate-2 rounded-lg bg-black/20 px-3 py-1 text-xs font-black uppercase tracking-wide">
                    {card.badge}
                  </span>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
