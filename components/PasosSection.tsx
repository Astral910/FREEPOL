'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageSquare, Cpu, CheckCircle, Rocket } from 'lucide-react'

const PASOS = [
  {
    num: '01',
    titulo: 'Describe tu campaña',
    desc: 'Cuéntale a la IA qué quieres en lenguaje natural.',
    icon: MessageSquare,
  },
  {
    num: '02',
    titulo: 'La IA analiza y configura',
    desc: 'Detecta reglas, premios y canales compatibles.',
    icon: Cpu,
  },
  {
    num: '03',
    titulo: 'Confirmas paso a paso',
    desc: 'Revisas en el wizard todo antes de publicar.',
    icon: CheckCircle,
  },
  {
    num: '04',
    titulo: 'Tu campaña en vivo',
    desc: 'Landing y bots listos para tus clientes.',
    icon: Rocket,
  },
]

/**
 * Pasos — fondo navy, números decorativos gigantes y pasos claros.
 */
export default function PasosSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-[#1A1B4B] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-12 space-y-1 font-black uppercase leading-[0.92] md:mb-16"
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <h2
            className="text-[40px] text-transparent sm:text-[56px] md:text-[90px]"
            style={{ WebkitTextStroke: '2px #ffffff' }}
          >
            DE LA IDEA
          </h2>
          <h2 className="text-[40px] text-[#E8344E] sm:text-[56px] md:text-[90px]">
            A LA CAMPAÑA
          </h2>
          <h2 className="text-[40px] text-white sm:text-[56px] md:text-[90px]">EN VIVO.</h2>
        </motion.div>

        <div className="relative grid gap-10 md:grid-cols-4 md:gap-4">
          {/* Línea punteada desktop */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px border-t border-dashed border-white/40 md:block"
            style={{ width: 'calc(100% - 4rem)', marginLeft: '2rem' }}
            aria-hidden
          />

          {PASOS.map((paso, i) => {
            const Icon = paso.icon
            return (
              <motion.div
                key={paso.num}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.12 }}
              >
                <div className="relative mb-6 flex h-28 w-full items-start justify-center md:justify-start">
                  <span
                    className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-[100px] font-black leading-none text-[#E8344E]/20 sm:text-[140px] md:-left-2 md:translate-x-0 md:text-[180px]"
                    aria-hidden
                  >
                    {paso.num}
                  </span>
                  <div className="relative z-[1] mt-10 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white text-[#1A1B4B] shadow-lg">
                    <Icon size={26} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-black text-white">{paso.titulo}</h3>
                <p className="max-w-[220px] text-sm leading-relaxed text-[#94A3B8]">
                  {paso.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          className="mt-10 hidden text-right text-2xl text-white/50 md:block"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          aria-hidden
        >
          →
        </motion.p>
      </div>
    </section>
  )
}
