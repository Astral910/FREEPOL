'use client'

import { Gift, Plus, Trash2, AlertTriangle, Check } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'

/** Colores para cada premio de la ruleta */
const COLORES_PREMIOS = ['#5B5CF6', '#22C55E', '#F59E0B']

/** Calcula el ángulo de cada sección del SVG de la ruleta */
function RuletaPreview({ premios }: { premios: { nombre: string; probabilidad: number }[] }) {
  const total = premios.reduce((a, p) => a + (p.probabilidad || 0), 0)
  let angulo = 0
  const cx = 80
  const cy = 80
  const r = 70

  const secciones = premios.map((p, i) => {
    const porcentaje = total > 0 ? p.probabilidad / total : 1 / premios.length
    const angInicio = angulo
    const angFin = angulo + porcentaje * 360
    angulo = angFin

    const rad1 = (angInicio - 90) * (Math.PI / 180)
    const rad2 = (angFin - 90) * (Math.PI / 180)
    const x1 = cx + r * Math.cos(rad1)
    const y1 = cy + r * Math.sin(rad1)
    const x2 = cx + r * Math.cos(rad2)
    const y2 = cy + r * Math.sin(rad2)
    const largeArc = porcentaje > 0.5 ? 1 : 0

    return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`, color: COLORES_PREMIOS[i % 3], nombre: p.nombre }
  })

  return (
    <svg viewBox="0 0 160 160" className="w-32 h-32">
      {secciones.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} opacity={0.85} stroke="#0F172A" strokeWidth="1" />
      ))}
      <circle cx={cx} cy={cy} r="12" fill="#0F172A" />
    </svg>
  )
}

/** Vista para ruleta */
function PremiosRuleta() {
  const { config, setConfig, errores } = useWizardStore()
  const premios = config.premios ?? []
  const totalProb = premios.reduce((a, p) => a + (Number(p.probabilidad) || 0), 0)

  const actualizarPremio = (i: number, campo: 'nombre' | 'probabilidad', val: string) => {
    const copia = [...premios]
    copia[i] = {
      ...copia[i],
      [campo]: campo === 'probabilidad' ? Number(val) : val,
    }
    setConfig('premios', copia)
  }

  const agregarPremio = () => {
    if (premios.length < 3) {
      setConfig('premios', [...premios, { nombre: '', probabilidad: 0 }])
    }
  }

  const eliminarPremio = (i: number) => {
    setConfig('premios', premios.filter((_, idx) => idx !== i))
  }

  const colorBarra =
    totalProb === 100 ? 'bg-[#22C55E]' : totalProb > 100 ? 'bg-red-500' : 'bg-orange-400'
  const textoBarra =
    totalProb === 100 ? 'text-[#22C55E]' : totalProb > 100 ? 'text-red-400' : 'text-orange-400'

  return (
    <div className="space-y-5">
      {/* Preview de ruleta */}
      <div className="flex items-center gap-5 bg-[#0F172A] rounded-xl p-4 border border-[#334155]">
        <RuletaPreview premios={premios} />
        <div className="space-y-2">
          {premios.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORES_PREMIOS[i % 3] }} />
              <span className="text-[#94A3B8] text-xs">{p.nombre || `Premio ${i + 1}`} ({p.probabilidad || 0}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filas de premios */}
      {premios.map((p, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: COLORES_PREMIOS[i % 3] }}
          >
            {i + 1}
          </div>
          <input
            type="text"
            value={p.nombre}
            onChange={(e) => actualizarPremio(i, 'nombre', e.target.value)}
            placeholder={`Premio ${i + 1}`}
            className="flex-1 bg-[#1E293B] border border-[#334155] rounded-xl py-2.5 px-3 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6] text-sm"
          />
          <div className="flex items-center gap-1 bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2.5 w-24 flex-shrink-0">
            <input
              type="number"
              min="0"
              max="100"
              value={p.probabilidad || ''}
              onChange={(e) => actualizarPremio(i, 'probabilidad', e.target.value)}
              placeholder="0"
              className="w-10 bg-transparent text-[#E2E8F0] text-sm focus:outline-none"
            />
            <span className="text-[#475569] text-sm">%</span>
          </div>
          {i >= 2 && (
            <button onClick={() => eliminarPremio(i)} className="text-[#475569] hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}

      {/* Barra de probabilidad total */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[#64748B] text-xs">Total de probabilidades</span>
          <span className={`font-bold text-sm ${textoBarra}`}>{totalProb}% de 100%</span>
        </div>
        <div className="h-2 bg-[#334155] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colorBarra}`}
            style={{ width: `${Math.min(totalProb, 100)}%` }}
          />
        </div>
        {totalProb !== 100 && (
          <div className="flex items-center gap-2 text-xs text-orange-400">
            <AlertTriangle size={12} />
            {totalProb > 100
              ? 'Reduce los porcentajes. La suma no puede superar 100%'
              : 'Las probabilidades deben sumar exactamente 100% para continuar'}
          </div>
        )}
        {totalProb === 100 && (
          <div className="flex items-center gap-2 text-xs text-[#22C55E]">
            <Check size={12} />
            Perfecto. Las probabilidades suman 100%
          </div>
        )}
      </div>

      {/* Botón agregar premio */}
      {premios.length < 3 && (
        <button
          onClick={agregarPremio}
          className="flex items-center gap-2 text-[#5B5CF6] text-sm hover:text-[#A855F7] transition-colors"
        >
          <Plus size={16} />
          Agregar premio {premios.length + 1} (opcional)
        </button>
      )}
    </div>
  )
}

/** Vista para puntos o factura */
function PremiosPuntos() {
  const { config, setConfig } = useWizardStore()

  const puntosPorMonto = config.puntos_por_monto ?? 1
  const montoBase = config.monto_base ?? 10
  const metaCanje = config.meta_canje ?? 50

  const comprasParaCanjear = metaCanje / puntosPorMonto
  const montoTotalParaCanjear = comprasParaCanjear * montoBase

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <label className="text-[#94A3B8] text-sm">¿Cuántos puntos por cada $X de compra?</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-3 flex-1">
            <input
              type="number"
              min="1"
              value={puntosPorMonto}
              onChange={(e) => setConfig('puntos_por_monto', Number(e.target.value))}
              className="w-16 bg-transparent text-[#E2E8F0] text-sm focus:outline-none"
            />
            <span className="text-[#475569] text-sm">puntos</span>
          </div>
          <span className="text-[#64748B] text-sm">por cada</span>
          <div className="flex items-center gap-2 bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-3 flex-1">
            <span className="text-[#475569] text-sm">$</span>
            <input
              type="number"
              min="1"
              value={montoBase}
              onChange={(e) => setConfig('monto_base', Number(e.target.value))}
              className="w-16 bg-transparent text-[#E2E8F0] text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[#94A3B8] text-sm">¿Cuántos puntos necesita para canjear?</label>
        <input
          type="number"
          min="1"
          value={metaCanje}
          onChange={(e) => setConfig('meta_canje', Number(e.target.value))}
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6]"
        />
      </div>

      {/* Calculadora visual */}
      <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4 space-y-1">
        <p className="text-[#64748B] text-xs uppercase tracking-wide">Calculadora</p>
        <p className="text-[#94A3B8] text-sm">
          Si un cliente compra{' '}
          <span className="text-[#E2E8F0] font-semibold">${montoBase}</span>, gana{' '}
          <span className="text-[#5B5CF6] font-semibold">{puntosPorMonto} punto{puntosPorMonto !== 1 ? 's' : ''}</span>.
        </p>
        <p className="text-[#94A3B8] text-sm">
          Necesita{' '}
          <span className="text-[#22C55E] font-semibold">{comprasParaCanjear.toFixed(0)} compra{comprasParaCanjear !== 1 ? 's' : ''}</span>{' '}
          (~${montoTotalParaCanjear.toFixed(0)}) para canjear.
        </p>
      </div>
    </div>
  )
}

/** Vista para cupón directo */
function PremiosCupon() {
  const { config, setConfig } = useWizardStore()
  const [conDeepLink, setConDeepLink] = useState(!!config.deep_link_url)

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-[#94A3B8] text-sm">¿Qué descuento o beneficio recibe el cliente?</label>
        <input
          type="text"
          value={config.premios[0]?.nombre ?? ''}
          onChange={(e) => setConfig('premios', [{ nombre: e.target.value, probabilidad: 100 }])}
          placeholder="Ej: 25% de descuento en tu próxima compra"
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6]"
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-[#1E293B] border border-[#334155] rounded-xl">
        <div
          className={`w-10 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${conDeepLink ? 'bg-[#5B5CF6]' : 'bg-[#334155]'}`}
          onClick={() => setConDeepLink(!conDeepLink)}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${conDeepLink ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
        <div>
          <p className="text-[#E2E8F0] text-sm font-medium">¿Agregar deep linking?</p>
          <p className="text-[#64748B] text-xs">Botón que lleva directo a tu app o tienda</p>
        </div>
      </div>

      {conDeepLink && (
        <input
          type="url"
          value={config.deep_link_url ?? ''}
          onChange={(e) => setConfig('deep_link_url', e.target.value)}
          placeholder="https://tutienda.com/producto"
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#5B5CF6] focus:border-[#5B5CF6]"
        />
      )}
    </div>
  )
}

// Necesita importar useState para PremiosCupon
import { useState } from 'react'

export default function Paso5Premios() {
  const { config } = useWizardStore()

  const titulosPorTipo: Record<string, { titulo: string; subtitulo: string }> = {
    ruleta: {
      titulo: 'Configura los premios de tu ruleta',
      subtitulo: 'Máximo 3 premios. Las probabilidades deben sumar 100%',
    },
    puntos: {
      titulo: 'Configura la mecánica de puntos',
      subtitulo: 'Define cuánto vale cada punto y cuándo se puede canjear',
    },
    factura: {
      titulo: 'Configura la mecánica de puntos por factura',
      subtitulo: 'El cliente sube su ticket y acumula puntos automáticamente',
    },
    cupon: {
      titulo: 'Configura el descuento',
      subtitulo: 'Define el beneficio que recibirá cada cliente registrado',
    },
  }

  const { titulo, subtitulo } = titulosPorTipo[config.tipo] ?? titulosPorTipo.ruleta

  return (
    <PasoLayout icono={Gift} titulo={titulo} subtitulo={subtitulo}>
      {config.tipo === 'ruleta' && <PremiosRuleta />}
      {(config.tipo === 'puntos' || config.tipo === 'factura') && <PremiosPuntos />}
      {config.tipo === 'cupon' && <PremiosCupon />}
    </PasoLayout>
  )
}
