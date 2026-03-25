'use client'

import { useState, useEffect } from 'react'
import { Zap, CheckCircle, XCircle, Loader2, RotateCcw } from 'lucide-react'
import type { ResultadoValidacion } from '@/lib/codigos'

type EstadoValidacion = 'esperando' | 'validando' | 'valido' | 'invalido'

const FORMATO_CODIGO = /^[A-Z]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/

/**
 * Página de validación de códigos para cajeros.
 * Mobile-first, accesible sin autenticación.
 * Se auto-envía cuando el código tiene el formato correcto.
 */
export default function ValidarPage() {
  const [codigo, setCodigo] = useState('')
  const [estado, setEstado] = useState<EstadoValidacion>('esperando')
  const [resultado, setResultado] = useState<ResultadoValidacion | null>(null)

  const formatearCodigo = (valor: string): string => {
    const limpio = valor.replace(/[^A-Z0-9]/gi, '').toUpperCase()
    if (limpio.length <= 4) return limpio
    if (limpio.length <= 8) return `${limpio.slice(0, 4)}-${limpio.slice(4)}`
    return `${limpio.slice(0, 4)}-${limpio.slice(4, 8)}-${limpio.slice(8, 12)}`
  }

  const handleCambio = (val: string) => {
    const formateado = formatearCodigo(val)
    setCodigo(formateado)
  }

  const validar = async (codigoAValidar: string) => {
    if (!codigoAValidar.trim() || estado === 'validando') return
    setEstado('validando')
    setResultado(null)

    try {
      const res = await fetch('/api/validar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoAValidar }),
      })
      const data = await res.json() as ResultadoValidacion
      setResultado(data)
      setEstado(data.valido ? 'valido' : 'invalido')
    } catch {
      setResultado({ valido: false, razon: 'Error de conexión' })
      setEstado('invalido')
    }
  }

  // Prefill desde ?codigo= (QR o link compartido)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = new URLSearchParams(window.location.search).get('codigo')
    if (!raw) return
    try {
      const decodificado = decodeURIComponent(raw)
      const limpio = decodificado.replace(/[^A-Z0-9]/gi, '').toUpperCase()
      if (limpio.length < 12) return
      const formateado =
        limpio.length <= 4
          ? limpio
          : limpio.length <= 8
            ? `${limpio.slice(0, 4)}-${limpio.slice(4)}`
            : `${limpio.slice(0, 4)}-${limpio.slice(4, 8)}-${limpio.slice(8, 12)}`
      setCodigo(formateado)
    } catch {
      /* ignorar query mal formada */
    }
  }, [])

  // Auto-enviar cuando el código tiene 14 caracteres (XXXX-XXXX-XXXX)
  useEffect(() => {
    if (FORMATO_CODIGO.test(codigo)) {
      validar(codigo)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo])

  const reiniciar = () => {
    setCodigo('')
    setEstado('esperando')
    setResultado(null)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-start pt-12 px-4">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <Zap size={20} className="text-[#E8344E]" />
            <span className="font-bold text-xl">
              <span className="text-[#E8344E]">FREE</span>
              <span className="text-[#0F172A]">POL</span>
            </span>
          </div>
          <h1 className="text-lg font-bold text-[#0F172A]">Validar código de premio</h1>
          <p className="text-sm text-[#64748B]">
            Ingresa o escanea el código del cliente
          </p>
        </div>

        {/* Pantalla de resultado válido */}
        {estado === 'valido' && resultado && (
          <div className="bg-[#F0FDF4] border-2 border-[#22C55E] rounded-2xl p-6 text-center space-y-3">
            <CheckCircle size={52} className="text-[#22C55E] mx-auto" />
            <h2 className="text-xl font-bold text-green-700">¡Código válido!</h2>
            <div className="bg-white rounded-xl p-4 space-y-1">
              <p className="text-base font-bold text-[#0F172A]">{resultado.premio}</p>
              {resultado.negocio && (
                <p className="text-sm text-[#64748B]">{resultado.negocio}</p>
              )}
            </div>
            <p className="text-sm text-green-700 font-medium">
              ✓ Código canjeado exitosamente
            </p>
            <p className="text-xs text-green-600 font-mono bg-green-50 rounded-lg px-3 py-2">
              {codigo}
            </p>
            <button
              onClick={reiniciar}
              className="w-full py-3 rounded-xl bg-[#22C55E] text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Validar otro código
            </button>
          </div>
        )}

        {/* Pantalla de resultado inválido */}
        {estado === 'invalido' && resultado && (
          <div className="bg-[#FEF2F2] border-2 border-[#EF4444] rounded-2xl p-6 text-center space-y-3">
            <XCircle size={52} className="text-[#EF4444] mx-auto" />
            <h2 className="text-xl font-bold text-red-700">Código inválido</h2>
            <p className="text-sm text-red-600">{resultado.razon}</p>
            <button
              onClick={reiniciar}
              className="w-full py-3 rounded-xl bg-[#EF4444] text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Intentar otro código
            </button>
          </div>
        )}

        {/* Formulario de entrada (visible cuando no hay resultado) */}
        {(estado === 'esperando' || estado === 'validando') && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="codigo" className="text-sm font-medium text-[#0F172A]">
                Código del premio
              </label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => handleCambio(e.target.value)}
                placeholder="POLL-A2F9-K7M3"
                maxLength={14}
                autoFocus
                autoComplete="off"
                autoCapitalize="characters"
                className="w-full border-2 border-[#E5E7EB] rounded-xl py-4 px-4 font-mono text-xl text-center text-[#0F172A] tracking-widest placeholder:text-[#CBD5E1] placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-[#E8344E] transition-colors"
              />
              <p className="text-xs text-[#94A3B8] text-center">
                Formato: XXXX-XXXX-XXXX · Se valida automáticamente
              </p>
            </div>

            <button
              onClick={() => validar(codigo)}
              disabled={estado === 'validando' || codigo.length < 14}
              className="w-full py-4 rounded-xl bg-[#E8344E] text-white font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {estado === 'validando' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar código'
              )}
            </button>
          </div>
        )}

        {/* Pie de página */}
        <p className="text-xs text-[#CBD5E1] text-center">
          Panel de validación FREEPOL · Solo para uso interno
        </p>
      </div>
    </div>
  )
}
