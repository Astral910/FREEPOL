'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface PasoLayoutProps {
  titulo: string
  subtitulo: string
  icono: LucideIcon
  children: React.ReactNode
  badge?: string
}

/**
 * Wrapper reutilizable para cada paso del wizard.
 * Muestra ícono en círculo con gradiente, badge opcional,
 * título, subtítulo y el contenido del paso.
 */
export default function PasoLayout({
  titulo,
  subtitulo,
  icono: Icono,
  children,
  badge,
}: PasoLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className="space-y-6"
    >
      {/* Encabezado del paso */}
      <div className="space-y-4">
        {/* Ícono */}
        <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-[#E8344E]/20">
          <Icono size={26} className="text-white" />
        </div>

        {/* Badge opcional */}
        {badge && (
          <span className="inline-block bg-[#FFF0F2] border border-[#F9B8C4] text-[#E8344E] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {badge}
          </span>
        )}

        {/* Título y subtítulo */}
        <div>
          <h2 className="text-2xl font-bold text-white leading-tight">{titulo}</h2>
          <p className="text-[#94A3B8] text-base mt-1.5 leading-relaxed">{subtitulo}</p>
        </div>

        {/* Separador */}
        <div className="h-px bg-[#2D2F5E]" />
      </div>

      {/* Contenido del paso */}
      <div>{children}</div>
    </motion.div>
  )
}
