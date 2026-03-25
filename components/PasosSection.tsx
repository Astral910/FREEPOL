'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { PenLine, Brain, Settings2, Rocket } from 'lucide-react'
import { GradientBadge } from '@/components/ui/GradientBadge'
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation'

const pasos = [
  {
    numero: '01',
    icon: PenLine,
    iconColor: '#E8344E',
    titulo: 'Describe tu campaña',
    texto: 'Escribe en el chat qué tipo de campaña quieres, los premios y las reglas.',
  },
  {
    numero: '02',
    icon: Brain,
    iconColor: '#F2839A',
    titulo: 'La IA analiza',
    texto:
      'FREEPOL identifica qué puede hacer y te ofrece alternativas para lo que no.',
  },
  {
    numero: '03',
    icon: Settings2,
    iconColor: '#3B82F6',
    titulo: 'Confirma en el wizard',
    texto:
      'Revisa la configuración pre-llenada paso a paso y ajusta lo que necesites.',
  },
  {
    numero: '04',
    icon: Rocket,
    iconColor: '#22C55E',
    titulo: 'Campaña en vivo',
    texto:
      'Tus clientes participan desde WhatsApp o la landing generada. Métricas en tiempo real.',
  },
]

/**
 * Sección de pasos del proceso de creación de campañas.
 * Incluye línea conectora decorativa en desktop.
 */
const PasosSection = memo(function PasosSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <GradientBadge variant="blue" className="mb-4">
            El proceso
          </GradientBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-4 mb-4">
            De la idea a la campaña{' '}
            <span className="gradient-text">en vivo</span>
          </h2>
          <p className="text-[#64748B] text-lg">
            En menos de 5 minutos, sin código, sin reuniones técnicas
          </p>
        </div>

        {/* Pasos */}
        <div ref={ref} className="relative">
          {/* Línea conectora (solo desktop) */}
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px border-t-2 border-dashed border-[#E5E7EB] z-0" />

          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10"
          >
            {pasos.map((paso) => {
              const Icon = paso.icon
              return (
                <motion.div
                  key={paso.numero}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
                    },
                  }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Número grande */}
                  <span className="text-5xl font-black gradient-text leading-none mb-3">
                    {paso.numero}
                  </span>

                  {/* Ícono */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center mb-4">
                    <Icon size={22} style={{ color: paso.iconColor }} />
                  </div>

                  {/* Texto */}
                  <h3 className="text-base font-bold text-[#0F172A] mb-2">{paso.titulo}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{paso.texto}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
})

export default PasosSection
