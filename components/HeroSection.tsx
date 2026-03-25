'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ChatMockup from '@/components/ChatMockup'

interface HeroSectionProps {
  onOpenAuth: (tab?: 'login' | 'register') => void
}

/**
 * Sección hero principal de la página de inicio.
 * Incluye badge animado, título con gradiente, subtítulo,
 * botones CTA y mockup del chat de FREEPOL.
 */
const HeroSection = memo(function HeroSection({ onOpenAuth }: HeroSectionProps) {
  const router = useRouter()

  const handleScrollToCasos = () => {
    document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen bg-white overflow-hidden pt-24 md:pt-32 pb-16">
      {/* Fondos decorativos difusos */}
      <div
        aria-hidden="true"
        className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#E8344E]/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-40 right-10 w-80 h-80 rounded-full bg-[#F2839A]/10 blur-3xl pointer-events-none"
      />
      {/* Patrón de puntos SVG */}
      <div
        aria-hidden="true"
        className="absolute inset-0 dot-pattern opacity-40 pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        {/* Badge animado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="inline-flex items-center gap-2 border border-[#E5E7EB] bg-[#F8FAFC] rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse-dot" />
          <span className="text-sm text-[#64748B]">Nuevo — Campañas con IA en minutos</span>
          <ArrowRight size={14} className="text-[#E8344E]" />
        </motion.div>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-5xl md:text-7xl font-bold text-[#0F172A] tracking-tight leading-[1.1] mb-6"
        >
          Tu ecosistema de lealtad
          <br />
          <span className="gradient-text">desplegado por IA</span>
          {' '}
          <span className="text-[#0F172A]">en minutos.</span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-[#64748B] leading-relaxed mb-10"
        >
          Describe en lenguaje natural la campaña que imaginas. FREEPOL la convierte en
          puntos, ruletas y cupones desplegados en WhatsApp, Telegram e Instagram. Sin
          código. Sin fricción.
        </motion.p>

        {/* Botones CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="px-8 py-4 h-auto rounded-xl bg-[#E8344E] text-white text-base font-semibold hover:brightness-110 shadow-lg hover:shadow-xl hover:shadow-[#E8344E]/30 transition-all duration-200"
              onClick={() => router.push('/chat')}
            >
              Crear mi primera campaña gratis →
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="px-8 py-4 h-auto rounded-xl border-[#E5E7EB] text-[#0F172A] text-base hover:bg-[#F8FAFC] transition-all duration-200"
              onClick={handleScrollToCasos}
            >
              Ver casos de uso
            </Button>
          </motion.div>
        </motion.div>

        {/* Nota de confianza */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-[#64748B]"
        >
          ✓ Sin tarjeta de crédito &nbsp;·&nbsp; ✓ Listo en 5 minutos &nbsp;·&nbsp; ✓ Cancela
          cuando quieras
        </motion.p>

        {/* Mockup del chat */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <ChatMockup />
        </motion.div>
      </div>
    </section>
  )
})

export default HeroSection
