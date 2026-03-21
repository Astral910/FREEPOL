'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Zap, BarChart3 } from 'lucide-react'
import { GradientBadge } from '@/components/ui/GradientBadge'
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation'

const pilares = [
  {
    icon: MessageSquare,
    iconColor: '#5B5CF6',
    iconBg: '#EEF2FF',
    borderColor: 'border-l-[#5B5CF6]',
    titulo: 'Describe en lenguaje natural',
    texto:
      'Escribe exactamente lo que necesitas. Nuestra IA entiende tu negocio y lo convierte en una campaña funcional sin que toques código.',
    badgeLabel: 'Natural Language AI',
    badgeBg: 'bg-[#EEF2FF]',
    badgeText: 'text-[#5B5CF6]',
  },
  {
    icon: Zap,
    iconColor: '#22C55E',
    iconBg: '#F0FDF4',
    borderColor: 'border-l-[#22C55E]',
    titulo: 'Desplegado en todos los canales',
    texto:
      'Tu campaña aparece en WhatsApp, Telegram e Instagram automáticamente. Una configuración, presencia en todos lados.',
    badgeLabel: 'Omnicanal',
    badgeBg: 'bg-[#F0FDF4]',
    badgeText: 'text-[#22C55E]',
  },
  {
    icon: BarChart3,
    iconColor: '#A855F7',
    iconBg: '#FAF5FF',
    borderColor: 'border-l-[#A855F7]',
    titulo: 'Tus datos, tu control',
    texto:
      'Todos los participantes y comportamientos quedan en tu base de datos. Re-marketing basado en comportamiento real.',
    badgeLabel: 'Data Sovereignty',
    badgeBg: 'bg-[#FAF5FF]',
    badgeText: 'text-[#A855F7]',
  },
]

/**
 * Sección de los 3 pilares de FREEPOL.
 * Cards con stagger animation al entrar en viewport.
 */
const PilaresSection = memo(function PilaresSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <GradientBadge variant="purple" className="mb-4">
            Cómo funciona
          </GradientBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-4 mb-4">
            Todo lo que necesitas para fidelizar
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Tres pilares que trabajan juntos para que tus campañas funcionen solas
          </p>
        </div>

        {/* Cards */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pilares.map((pilar) => {
            const Icon = pilar.icon
            return (
              <motion.div
                key={pilar.titulo}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
                  },
                }}
                className={`bg-[#F8FAFC] border border-[#E5E7EB] border-l-4 ${pilar.borderColor} rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-200`}
              >
                <div
                  className="p-3 rounded-xl inline-block mb-4"
                  style={{ backgroundColor: pilar.iconBg }}
                >
                  <Icon size={24} style={{ color: pilar.iconColor }} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{pilar.titulo}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed mb-4">{pilar.texto}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pilar.badgeBg} ${pilar.badgeText}`}
                >
                  {pilar.badgeLabel}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
})

export default PilaresSection
