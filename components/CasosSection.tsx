'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Ticket } from 'lucide-react'
import { GradientBadge } from '@/components/ui/GradientBadge'
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation'

const casos = [
  {
    empresa: 'Pollo Campero',
    colorTop: '#E8000D',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-600',
    badgeLabel: 'Ruleta gamificada',
    icon: Trophy,
    numero: '01',
    titulo: 'Campaña mensual masiva',
    descripcion:
      'Ruleta omnicanal con 3 premios y probabilidades configuradas. El usuario valida su correo, gira una vez y recibe su código QR único en WhatsApp.',
    metricas: '1 giro por correo · 3 premios · QR en 24h',
    linkColor: '#E8000D',
  },
  {
    empresa: 'Walmart + Puma',
    colorTop: '#0071CE',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-600',
    badgeLabel: 'Puntos por factura',
    icon: Star,
    numero: '02',
    titulo: 'Alianza retail-combustible',
    descripcion:
      'El usuario sube su factura de Walmart por Telegram. La IA la lee con OCR, asigna Eco-Puntos y genera descuentos en gasolinera al llegar a la meta.',
    metricas: '$10 = 1 punto · Meta 50 pts · $5 descuento',
    linkColor: '#0071CE',
  },
  {
    empresa: "McDonald's",
    colorTop: '#FFC72C',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-700',
    badgeLabel: 'Cupón + deep link',
    icon: Ticket,
    numero: '03',
    titulo: 'De redes sociales a la app',
    descripcion:
      'Código único por usuario generado desde Instagram. Un clic lleva directo al carrito en la app de McDonald\'s. Control de stock automático.',
    metricas: 'Código único · Deep linking · Límite 5,000 usos',
    linkColor: '#B45309',
  },
]

/**
 * Sección de casos de uso reales de FREEPOL.
 * Cada card entra alternando desde los lados.
 */
const CasosSection = memo(function CasosSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="casos" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <GradientBadge variant="green" className="mb-4">
            Casos reales
          </GradientBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-4">
            Lo que las empresas están construyendo
          </h2>
        </div>

        {/* Cards */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {casos.map((caso, index) => {
            const Icon = caso.icon
            return (
              <motion.div
                key={caso.empresa}
                variants={{
                  hidden: {
                    opacity: 0,
                    x: index % 2 === 0 ? -30 : 30,
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
                  },
                }}
                className="relative bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 p-6"
                style={{ borderTop: `4px solid ${caso.colorTop}` }}
              >
                {/* Número decorativo de fondo */}
                <span
                  className="absolute top-4 right-4 text-8xl font-black leading-none select-none pointer-events-none"
                  style={{ color: `${caso.colorTop}15` }}
                  aria-hidden="true"
                >
                  {caso.numero}
                </span>

                {/* Badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${caso.badgeBg} ${caso.badgeText}`}
                >
                  {caso.badgeLabel}
                </span>

                {/* Ícono */}
                <div className="mb-3">
                  <Icon size={24} style={{ color: caso.colorTop }} />
                </div>

                {/* Empresa y título */}
                <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">
                  {caso.empresa}
                </p>
                <h3 className="text-lg font-bold text-[#0F172A] mb-3">{caso.titulo}</h3>

                {/* Descripción */}
                <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                  {caso.descripcion}
                </p>

                {/* Métricas */}
                <div className="bg-[#F8FAFC] rounded-lg px-3 py-2 mb-4">
                  <p className="text-xs text-[#64748B] font-medium">{caso.metricas}</p>
                </div>

                {/* Link */}
                <a
                  href="#"
                  className="text-sm font-semibold hover:underline transition-colors"
                  style={{ color: caso.linkColor }}
                >
                  Ver demo →
                </a>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
})

export default CasosSection
