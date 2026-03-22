'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation'

interface CTAFinalProps {
  onOpenAuth: (tab?: 'login' | 'register') => void
}

/**
 * Sección de llamada a la acción final con gradiente IA.
 * Incluye elementos decorativos y dos botones principales.
 */
const CTAFinal = memo(function CTAFinal({ onOpenAuth }: CTAFinalProps) {
  const router = useRouter()
  const { ref, isInView } = useScrollAnimation()

  return (
    <section className="relative overflow-hidden py-32 gradient-bg">
      {/* Elementos decorativos */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"
      />

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            ¿Listo para tu primera campaña?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Únete a las empresas que ya fidelizan con inteligencia artificial
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="px-10 py-4 h-auto rounded-xl bg-white text-[#5B5CF6] font-bold text-base hover:bg-white/90 shadow-xl transition-all duration-200"
                onClick={() => router.push('/chat')}
              >
                Crear cuenta gratis
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="px-10 py-4 h-auto rounded-xl border-white/40 text-white bg-transparent hover:bg-white/10 text-base transition-all duration-200"
              >
                Ver una demo
              </Button>
            </motion.div>
          </div>

          <p className="text-white/60 text-sm">
            Sin tarjeta de crédito · Cancela cuando quieras
          </p>
        </motion.div>
      </div>
    </section>
  )
})

export default CTAFinal
