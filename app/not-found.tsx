'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'

/**
 * Página 404 personalizada con tema oscuro de FREEPOL.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-[#5B5CF6]/10 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative z-10 text-center space-y-6 max-w-lg">
        {/* Número 404 gigante */}
        <motion.p
          className="text-[10rem] md:text-[12rem] font-black leading-none gradient-text select-none"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.p>

        {/* Ícono */}
        <div className="flex justify-center -mt-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B5CF6] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#5B5CF6]/30">
            <Sparkles size={24} className="text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">Página no encontrada</h1>
          <p className="text-[#94A3B8] text-base">
            La página que buscas no existe o fue movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-[#CBD5E1] font-medium hover:bg-[#334155] transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #5B5CF6, #A855F7)' }}
          >
            <Sparkles size={16} />
            Abrir el asistente
          </Link>
        </div>

        <p className="text-[#475569] text-xs pt-2">
          <span className="text-[#5B5CF6] font-bold">FREE</span>
          <span className="text-[#64748B] font-bold">POL</span>
          {' '}— Plataforma de fidelización con IA
        </p>
      </div>
    </div>
  )
}
