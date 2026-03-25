'use client'

import { motion } from 'framer-motion'
import { Sparkles, Trophy, Star, Ticket, Receipt } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import type { TipoCampana } from '@/types/campana'

const TIPOS = [
  {
    valor: 'ruleta' as TipoCampana,
    icono: Trophy,
    color: '#F59E0B',
    colorBg: '#451A03',
    nombre: 'Ruleta de Premios',
    descripcion: 'El cliente gira y gana según probabilidades',
  },
  {
    valor: 'puntos' as TipoCampana,
    icono: Star,
    color: '#22C55E',
    colorBg: '#052E16',
    nombre: 'Sistema de Puntos',
    descripcion: 'Acumulación por compras y canje de premios',
  },
  {
    valor: 'cupon' as TipoCampana,
    icono: Ticket,
    color: '#E8344E',
    colorBg: '#1A1B4B',
    nombre: 'Cupón Directo',
    descripcion: 'Código único de descuento por registro',
  },
  {
    valor: 'factura' as TipoCampana,
    icono: Receipt,
    color: '#F2839A',
    colorBg: '#2E1065',
    nombre: 'Puntos por Factura',
    descripcion: 'Valida compras con foto del ticket',
  },
]

export default function Paso1TipoCampana() {
  const { config, setConfig } = useWizardStore()

  return (
    <PasoLayout
      icono={Sparkles}
      titulo="¿Qué tipo de campaña quieres crear?"
      subtitulo="Confirma o cambia el tipo que detectó la IA"
      badge="Pre-detectado por IA"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIPOS.map((tipo) => {
          const Icono = tipo.icono
          const seleccionado = config.tipo === tipo.valor
          return (
            <motion.button
              key={tipo.valor}
              onClick={() => setConfig('tipo', tipo.valor)}
              whileTap={{ scale: 0.97 }}
              className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer ${
                seleccionado
                  ? 'border-[#E8344E] bg-[#1A1B4B] shadow-lg shadow-[#E8344E]/15'
                  : 'border-[#2D2F5E] bg-[#1A1B4B] hover:border-[#E8344E]/50'
              }`}
            >
              {/* Ícono */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: tipo.colorBg }}
              >
                <Icono size={24} style={{ color: tipo.color }} />
              </div>

              <p className="font-bold text-[#E2E8F0] text-base">{tipo.nombre}</p>
              <p className="text-[#64748B] text-sm mt-1">{tipo.descripcion}</p>

              {/* Indicador de selección */}
              {seleccionado && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full gradient-bg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </PasoLayout>
  )
}
