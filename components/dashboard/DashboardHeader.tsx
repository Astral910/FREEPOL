'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Empresa } from '@/lib/empresa'
import { BRAND_PRIMARY, BRAND_ACCENT } from '@/lib/brand'

interface DashboardHeaderProps {
  empresa: Empresa
  nombreUsuario?: string
  campanasActivas: number
}

function saludar(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Buenos días'
  if (h >= 12 && h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const PLAN_LABEL: Record<string, string> = {
  free: 'Free', starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise',
}

/**
 * Header de bienvenida personalizado con datos de la empresa.
 */
export default function DashboardHeader({ empresa, nombreUsuario, campanasActivas }: DashboardHeaderProps) {
  const saludo = saludar()

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <p className="text-[#64748B] text-sm">
          {saludo}{nombreUsuario ? `, ${nombreUsuario}` : ''}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mt-0.5">
          {empresa.nombre}
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          {campanasActivas > 0
            ? `${campanasActivas} campaña${campanasActivas !== 1 ? 's' : ''} activa${campanasActivas !== 1 ? 's' : ''}`
            : 'Sin campañas activas'}
          {' · '}
          Plan {PLAN_LABEL[empresa.plan] ?? empresa.plan}
        </p>
      </div>

      <Link
        href="/chat"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity self-start sm:self-auto flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})` }}
      >
        <Plus size={15} />
        Nueva campaña
      </Link>
    </motion.div>
  )
}
