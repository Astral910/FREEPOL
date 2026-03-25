'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Check,
  AlertTriangle,
  Rocket,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ResultadoAnalisis } from '@/types/campana'
import { TIPO_CAMPANA_LABEL, CANAL_LABEL, FRECUENCIA_LABEL } from '@/types/campana'

interface ResultadosAnalisisProps {
  resultado: ResultadoAnalisis
  onContinuarWizard: () => void
  onAjustar: () => void
  onReiniciar: () => void
}

/**
 * Pantalla de resultados que aparece tras el análisis de la IA.
 * Muestra qué puede y qué no puede hacer FREEPOL, con alternativas,
 * y el resumen de configuración extraído del prompt.
 */
export default function ResultadosAnalisis({
  resultado,
  onContinuarWizard,
  onAjustar,
  onReiniciar,
}: ResultadosAnalisisProps) {
  const { puede_hacer, no_puede_hacer, alternativas, config } = resultado

  const resumenCards = [
    { label: 'Tipo de campaña', valor: TIPO_CAMPANA_LABEL[config.tipo] ?? config.tipo },
    { label: 'Canal', valor: CANAL_LABEL[config.canal] ?? config.canal },
    {
      label: 'Condición',
      valor:
        config.condicion === 'correo'
          ? 'Validar correo'
          : config.condicion === 'telefono'
            ? 'Validar teléfono'
            : config.condicion === 'quiz'
              ? 'Quiz 3 preguntas'
              : 'Libre',
    },
    { label: 'Frecuencia', valor: FRECUENCIA_LABEL[config.frecuencia] ?? config.frecuencia },
    {
      label: 'Vigencia',
      valor: config.fecha_fin ? `Hasta ${config.fecha_fin}` : 'Sin fecha límite',
    },
    {
      label: 'Premios / Puntos',
      valor:
        config.tipo === 'ruleta'
          ? `${config.premios.length} premios`
          : config.tipo === 'puntos' || config.tipo === 'factura'
            ? `Meta: ${config.meta_canje ?? '—'} pts`
            : 'Descuento directo',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className="max-w-3xl mx-auto w-full"
    >
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-6">

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#F0FDF4] border border-[#86EFAC] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} className="text-[#22C55E]" />
          </div>
          <div>
            <h2 className="text-[#0F172A] font-bold text-xl leading-tight">
              ¡Tu campaña está lista para configurar!
            </h2>
            <p className="text-[#64748B] text-sm mt-1">
              Esto es lo que FREEPOL construirá para ti:
            </p>
            {config.nombre_campana && (
              <div className="mt-2 inline-flex items-center gap-2 bg-[#FFF0F2] border border-[#F9B8C4]/80 rounded-lg px-3 py-1">
                <span className="text-[#64748B] text-xs">Campaña:</span>
                <span className="text-[#E8344E] text-sm font-semibold">
                  {config.nombre_campana}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sección VERDE — lo que sí se puede */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3">
            <Check size={16} className="text-[#15803D] flex-shrink-0" />
            <span className="text-[#15803D] font-semibold text-sm">
              Lo que configuraremos perfectamente
            </span>
          </div>
          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {puede_hacer.map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                }}
                className="flex items-start gap-3 bg-[#F0FDF4]/80 border border-[#D1FAE5]/80 rounded-lg px-3 py-2"
              >
                <Check size={13} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
                <span className="text-[#166534] text-sm leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sección NARANJA — ajustes y alternativas (solo si hay) */}
        {no_puede_hacer.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-[#FFF7ED] border border-[#FED7AA] rounded-lg p-3">
              <AlertTriangle size={16} className="text-[#EA580C] flex-shrink-0" />
              <span className="text-[#C2410C] font-semibold text-sm">
                Ajustes que hicimos
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                    {['Lo que pediste', 'Limitación', 'Alternativa de FREEPOL'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[#64748B] text-xs uppercase tracking-wider font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alternativas.map((alt, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}
                    >
                      <td className="px-4 py-3 text-[#0F172A]">{alt.pidio}</td>
                      <td className="px-4 py-3 text-[#64748B]">{alt.razon}</td>
                      <td className="px-4 py-3 text-[#15803D] font-medium">
                        {alt.alternativa}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resumen de configuración */}
        <div className="space-y-3">
          <p className="text-[#64748B] text-xs uppercase tracking-widest font-medium">
            Resumen de configuración
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {resumenCards.map((card) => (
              <div
                key={card.label}
                className="bg-[#F8FAFC] rounded-lg p-3 text-center border border-[#E5E7EB]"
              >
                <p className="text-[#64748B] text-xs mb-1">{card.label}</p>
                <p className="text-[#0F172A] font-semibold text-sm leading-tight">
                  {card.valor}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              onClick={onContinuarWizard}
              className="w-full gradient-bg text-white px-8 py-3 h-auto rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90"
            >
              <Rocket size={16} />
              Continuar al wizard →
            </Button>
          </motion.div>

          <Button
            variant="outline"
            onClick={onAjustar}
            className="bg-white border-[#E5E7EB] text-[#0F172A] rounded-xl px-6 py-3 h-auto hover:bg-[#F8FAFC]"
          >
            <RotateCcw size={14} className="mr-2" />
            Ajustar descripción
          </Button>
        </div>

        <div className="text-center">
          <button
            onClick={onReiniciar}
            className="text-[#64748B] text-sm hover:text-[#E8344E] transition-colors flex items-center gap-1.5 mx-auto"
          >
            <Trash2 size={13} />
            Empezar de cero
          </button>
        </div>
      </div>
    </motion.div>
  )
}
