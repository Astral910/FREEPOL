'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Sticker } from '@/components/ui/Sticker'

const MARCAS = ['Retail', 'Restaurantes', 'Gasolineras', 'E-commerce', 'Servicios']

/**
 * Franja roja tipo declaración — marcas ficticias / categorías como prueba social.
 */
export default function LogosBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#E8344E] py-14 md:py-16">
      <motion.div
        className="pointer-events-none absolute left-6 top-6 z-10 hidden md:block"
        initial={{ opacity: 0, rotate: -12 }}
        animate={isInView ? { opacity: 1, rotate: -3 } : {}}
        transition={{ duration: 0.4 }}
      >
        <Sticker rotation={-3}>100% SIN CÓDIGO</Sticker>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-6 right-6 z-10 hidden md:block"
        initial={{ opacity: 0, rotate: 12 }}
        animate={isInView ? { opacity: 1, rotate: 3 } : {}}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Sticker rotation={3}>⚡ EN MINUTOS</Sticker>
      </motion.div>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 text-center md:px-8">
        <motion.p
          className="mb-8 inline-block -rotate-1 text-lg font-black uppercase tracking-[0.2em] text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
        >
          Las marcas que ya fidelizan con IA
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-x-5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {MARCAS.map((nombre, i) => (
            <span key={nombre} className="contents">
              <span className="cursor-default text-2xl font-black text-white transition-colors duration-200 hover:bg-white hover:text-black md:text-3xl">
                {nombre}
              </span>
              {i < MARCAS.length - 1 && (
                <span className="text-white/70 select-none">·</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
