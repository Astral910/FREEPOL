'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Copy, Check, Loader2, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import confetti from 'canvas-confetti'
import type { CampanaRow } from '@/app/c/[slug]/page'

type EstadoRuleta = 'esperando' | 'girando' | 'resultado'

interface ResultadoGiro {
  premio: string
  prize_index: number
  codigo: string
  expira_en: string
}

interface Props {
  campana: CampanaRow
  participanteId: string
}

const COLORES_PREMIOS = ['#5B5CF6', '#22C55E', '#F59E0B', '#EF4444']

/** Convierte grados a radianes */
const toRad = (deg: number) => (deg * Math.PI) / 180

/** Calcula el punto X en el arco del SVG */
const px = (cx: number, r: number, angRad: number) => cx + r * Math.cos(angRad)

/** Calcula el punto Y en el arco del SVG */
const py = (cy: number, r: number, angRad: number) => cy + r * Math.sin(angRad)

interface SeccionRuleta {
  nombre: string
  probabilidad: number
  color: string
  angInicio: number
  angFin: number
  angCentro: number
}

function construirSecciones(premios: { nombre: string; probabilidad: number }[]): SeccionRuleta[] {
  const total = premios.reduce((a, p) => a + p.probabilidad, 0) || 100
  let angActual = -90 // empezamos desde arriba (12 en punto)
  return premios.map((p, i) => {
    const arco = (p.probabilidad / total) * 360
    const inicio = angActual
    const fin = angActual + arco
    const centro = inicio + arco / 2
    angActual = fin
    return {
      nombre: p.nombre,
      probabilidad: p.probabilidad,
      color: COLORES_PREMIOS[i % COLORES_PREMIOS.length],
      angInicio: inicio,
      angFin: fin,
      angCentro: centro,
    }
  })
}

/** Genera el path SVG de un arco para la ruleta */
function pathArco(seccion: SeccionRuleta, cx: number, cy: number, r: number): string {
  const radInicio = toRad(seccion.angInicio)
  const radFin = toRad(seccion.angFin)
  const x1 = px(cx, r, radInicio)
  const y1 = py(cy, r, radInicio)
  const x2 = px(cx, r, radFin)
  const y2 = py(cy, r, radFin)
  const arcoGrande = seccion.angFin - seccion.angInicio > 180 ? 1 : 0
  return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${arcoGrande},1 ${x2},${y2} Z`
}

function RuletaSVG({
  secciones,
  rotacion,
  girando,
}: {
  secciones: SeccionRuleta[]
  rotacion: number
  girando: boolean
}) {
  const cx = 150
  const cy = 150
  const r = 135
  const rTexto = 95

  return (
    <div className="relative w-full max-w-xs mx-auto select-none">
      {/* Puntero fijo arriba */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
        <svg width="24" height="28" viewBox="0 0 24 28">
          <polygon points="12,28 0,0 24,0" fill="#0F172A" />
          <polygon points="12,24 2,2 22,2" fill="white" opacity="0.15" />
        </svg>
      </div>

      {/* Ruleta giratoria */}
      <svg
        viewBox="0 0 300 300"
        className="w-full"
        style={{
          transform: `rotate(${rotacion}deg)`,
          transition: girando ? 'none' : 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          willChange: 'transform',
        }}
      >
        {/* Sombra exterior */}
        <circle cx={cx} cy={cy} r={r + 5} fill="#E5E7EB" />

        {/* Secciones */}
        {secciones.map((s, i) => (
          <g key={i}>
            <path d={pathArco(s, cx, cy, r)} fill={s.color} stroke="white" strokeWidth="2" />
            {/* Texto del premio rotado al centro de la sección */}
            <text
              x={px(cx, rTexto, toRad(s.angCentro))}
              y={py(cy, rTexto, toRad(s.angCentro))}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="11"
              fontWeight="700"
              transform={`rotate(${s.angCentro}, ${px(cx, rTexto, toRad(s.angCentro))}, ${py(cy, rTexto, toRad(s.angCentro))})`}
              className="pointer-events-none"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              {s.nombre.length > 12 ? s.nombre.substring(0, 11) + '…' : s.nombre}
            </text>
          </g>
        ))}

        {/* Círculo central */}
        <circle cx={cx} cy={cy} r={28} fill="white" stroke="#E5E7EB" strokeWidth="2" />
      </svg>
    </div>
  )
}

export default function ComponenteRuleta({ campana, participanteId }: Props) {
  const cfg = campana.configuracion
  const premios = cfg.premios ?? []
  const secciones = construirSecciones(premios)

  const [estado, setEstado] = useState<EstadoRuleta>('esperando')
  const [rotacion, setRotacion] = useState(0)
  const [resultado, setResultado] = useState<ResultadoGiro | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rotacionRef = useRef(0)

  const girar = async () => {
    if (estado !== 'esperando') return
    setEstado('girando')
    setError(null)

    // Giro visual rápido inicial mientras espera la API
    const vueltasIniciales = 720
    rotacionRef.current += vueltasIniciales
    setRotacion(rotacionRef.current)

    try {
      const res = await fetch('/api/girar-ruleta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campana_id: campana.id,
          participante_id: participanteId,
        }),
      })
      const data = await res.json() as ResultadoGiro & { error?: string }

      if (!res.ok) {
        const mensajes: Record<string, string> = {
          ya_participo: 'Ya participaste en esta campaña.',
        }
        setError(mensajes[data.error ?? ''] ?? data.error ?? 'Error al girar')
        setEstado('esperando')
        return
      }

      // Calcular ángulo de parada en la sección ganadora
      const seccionGanadora = secciones[data.prize_index]
      const angCentro = seccionGanadora?.angCentro ?? 0
      // El puntero está en -90°. Para que quede apuntando a angCentro:
      // necesitamos que la ruleta rote hasta que angCentro quede en -90°
      const variacion = (Math.random() - 0.5) * 20 // ±10°
      const vueltasFinales = 5 * 360 // 5 vueltas completas adicionales
      const angParada = -angCentro - 90 + variacion
      rotacionRef.current = Math.ceil(rotacionRef.current / 360) * 360 + vueltasFinales + angParada

      setRotacion(rotacionRef.current)
      setResultado(data)

      // Esperar a que termine la animación CSS de 3s antes de mostrar resultado
      setTimeout(() => {
        setEstado('resultado')
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#5B5CF6', '#22C55E', '#A855F7', '#F59E0B'],
        })
      }, 3200)
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setEstado('esperando')
    }
  }

  const copiarCodigo = async () => {
    if (!resultado?.codigo) return
    await navigator.clipboard.writeText(resultado.codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const descargarQR = () => {
    if (!resultado?.codigo) return
    const svg = document.querySelector('#qr-codigo svg') as SVGElement | null
    if (!svg) return

    const canvas = document.createElement('canvas')
    const size = 300
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const a = document.createElement('a')
      a.download = `codigo-${resultado.codigo}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  // Mostrar resultado si ya hay uno guardado
  if (estado === 'resultado' && resultado) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {/* Encabezado del resultado */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#FEF9C3] flex items-center justify-center mx-auto">
              <Trophy size={32} className="text-[#F59E0B]" />
            </div>
            <h2 className="text-3xl font-black text-[#0F172A]">¡Ganaste!</h2>
            <p className="text-xl font-bold text-[#5B5CF6]">{resultado.premio}</p>
          </div>

          <div className="h-px bg-[#E5E7EB]" />

          {/* Código */}
          <div className="space-y-2">
            <p className="text-sm text-[#64748B] text-center">Tu código de premio:</p>
            <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
              <span className="flex-1 text-2xl font-mono font-bold text-[#0F172A] text-center tracking-widest">
                {resultado.codigo}
              </span>
              <button
                onClick={copiarCodigo}
                className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors"
                aria-label="Copiar código"
              >
                {copiado ? (
                  <Check size={16} className="text-[#22C55E]" />
                ) : (
                  <Copy size={16} className="text-[#64748B]" />
                )}
              </button>
            </div>
          </div>

          {/* QR */}
          <div id="qr-codigo" className="flex flex-col items-center gap-3">
            <QRCodeSVG
              value={resultado.codigo}
              size={200}
              marginSize={4}
              bgColor="#ffffff"
              fgColor="#0F172A"
            />
            <button
              onClick={descargarQR}
              className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#5B5CF6] transition-colors"
            >
              <Download size={14} />
              Descargar QR
            </button>
          </div>

          {/* Expiración */}
          <p className="text-sm text-[#64748B] text-center">
            Válido hasta{' '}
            <strong>
              {new Date(resultado.expira_en).toLocaleString('es-GT', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </strong>{' '}
            — Muéstralo en caja
          </p>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="space-y-6">
      {/* Ruleta SVG */}
      <RuletaSVG secciones={secciones} rotacion={rotacion} girando={estado === 'girando'} />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center">
          {error}
        </div>
      )}

      {/* Botón girar */}
      <button
        onClick={girar}
        disabled={estado === 'girando'}
        className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all hover:opacity-90 disabled:opacity-60 gradient-bg shadow-lg shadow-[#5B5CF6]/20"
      >
        {estado === 'girando' ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Girando...
          </>
        ) : (
          '¡Girar la ruleta!'
        )}
      </button>

      {/* Leyenda de premios */}
      <div className="space-y-2">
        {secciones.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-[#0F172A]">{s.nombre}</span>
            <span className="text-xs text-[#94A3B8] ml-auto">{s.probabilidad}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
