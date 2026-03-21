'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation'

const marcas = ['Pollo Campero', 'Walmart', "McDonald's", 'Grupo Puma', 'Claro']

/**
 * Barra de logos de marcas de referencia.
 * Se anima al entrar en el viewport con fadeIn.
 */
const LogosBar = memo(function LogosBar() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section className="bg-[#F8FAFC] border-y border-[#E5E7EB] py-12">
      <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm text-[#64748B] uppercase tracking-widest font-medium mb-8"
        >
          Confiado por marcas líderes
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center items-center gap-8 md:gap-12 flex-wrap"
        >
          {marcas.map((marca, index) => (
            <motion.span
              key={marca}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
              className="text-xl font-bold text-[#CBD5E1] hover:text-[#94A3B8] transition-colors duration-200 cursor-default select-none"
            >
              {marca}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
})

export default LogosBar
