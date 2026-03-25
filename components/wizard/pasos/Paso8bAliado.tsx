'use client'

import { useState } from 'react'
import { Handshake, Info, Mail, Building2 } from 'lucide-react'
import PasoLayout from '@/components/wizard/PasoLayout'
import { useWizardStore } from '@/store/wizardStore'
import { Checkbox } from '@/components/ui/checkbox'

/** Datos de aliado almacenados en el store como metadata extra */
export interface DatosAliado {
  correo: string
  nombre_empresa?: string
  entendido: boolean
}

const LS_KEY_ALIADO = 'freepol_aliado'

/** Guarda los datos del aliado en localStorage para usarlos en Paso 10 */
export function guardarAliado(datos: DatosAliado) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_KEY_ALIADO, JSON.stringify(datos))
  }
}

/** Lee los datos del aliado desde localStorage */
export function leerAliado(): DatosAliado | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(LS_KEY_ALIADO)
  if (!raw) return null
  try { return JSON.parse(raw) as DatosAliado } catch { return null }
}

/** Elimina los datos del aliado del localStorage */
export function limpiarAliado() {
  if (typeof window !== 'undefined') localStorage.removeItem(LS_KEY_ALIADO)
}

/**
 * Paso opcional del wizard: configurar una empresa aliada.
 * Aparece entre el Paso 8 (Límites) y el Paso 9 (Mensaje).
 * CERO tokens de Groq — solo lógica de formulario.
 */
export default function Paso8bAliado() {
  const { config } = useWizardStore()
  const [conAliado, setConAliado] = useState(false)
  const [correo, setCorreo] = useState('')
  const [nombreEmpresa, setNombreEmpresa] = useState('')
  const [entendido, setEntendido] = useState(false)
  const [error, setError] = useState('')

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)

  const handleToggle = (valor: boolean) => {
    setConAliado(valor)
    if (!valor) {
      limpiarAliado()
      setCorreo('')
      setNombreEmpresa('')
      setEntendido(false)
      setError('')
    }
  }

  const handleCorreoChange = (v: string) => {
    setCorreo(v)
    setError('')
    if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError('Ingresa un correo válido')
    }
    // Guardar en localStorage en tiempo real
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      guardarAliado({ correo: v, nombre_empresa: nombreEmpresa, entendido })
    }
  }

  const handleNombreChange = (v: string) => {
    setNombreEmpresa(v)
    guardarAliado({ correo, nombre_empresa: v, entendido })
  }

  const handleEntendido = (val: boolean) => {
    setEntendido(val)
    guardarAliado({ correo, nombre_empresa: nombreEmpresa, entendido: val })
  }

  return (
    <PasoLayout
      icono={Handshake}
      titulo="¿Esta campaña tiene una empresa aliada?"
      subtitulo="Ideal para alianzas como retail + gasolinera o tienda + restaurante"
      badge="Opcional"
    >
      <div className="space-y-5">
        {/* Toggle activar aliado */}
        <div className="flex items-center gap-3 p-4 bg-[#1A1B4B] border border-[#2D2F5E] rounded-xl">
          <div
            className={`w-10 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${conAliado ? 'bg-[#E8344E]' : 'bg-[#2D2F5E]'}`}
            onClick={() => handleToggle(!conAliado)}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${conAliado ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <div>
            <p className="text-[#E2E8F0] text-sm font-medium">Agregar empresa aliada</p>
            <p className="text-[#64748B] text-xs">Comparte los premios de esta campaña con otro negocio</p>
          </div>
        </div>

        {!conAliado && (
          <div className="bg-[#0A0A0A] border border-[#2D2F5E] rounded-xl p-4 space-y-2">
            <p className="text-[#64748B] text-sm leading-relaxed">
              Las alianzas te permiten que los cajeros de otra empresa puedan
              validar los códigos QR de esta campaña desde su panel{' '}
              <span className="text-[#E8344E]">/validar</span>.
              Ideal para campañas de puntos cruzados.
            </p>
            <p className="text-[#475569] text-xs">Activa el switch para configurar un aliado.</p>
          </div>
        )}

        {conAliado && (
          <div className="space-y-4">
            {/* Card informativa */}
            <div className="flex items-start gap-3 bg-[#1E3A5F]/50 border border-[#1D4ED8]/30 rounded-xl p-4">
              <Info size={15} className="text-[#60A5FA] flex-shrink-0 mt-0.5" />
              <p className="text-[#93C5FD] text-sm leading-relaxed">
                La empresa aliada podrá validar los códigos QR que genere esta campaña
                desde su panel <strong>/validar</strong>. Les enviaremos una invitación
                por correo para que la acepten.
              </p>
            </div>

            {/* Correo del aliado */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#94A3B8] text-sm">
                <Mail size={13} />
                Correo de la empresa aliada
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => handleCorreoChange(e.target.value)}
                placeholder="admin@empresa-aliada.com"
                className={`w-full bg-[#1A1B4B] border rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#E8344E] focus:border-[#E8344E] transition-all ${error ? 'border-red-500' : 'border-[#2D2F5E]'}`}
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <p className="text-[#475569] text-xs">
                Le enviaremos una invitación para que acepte la colaboración.
              </p>
            </div>

            {/* Nombre del aliado (opcional) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#94A3B8] text-sm">
                <Building2 size={13} />
                Nombre de la empresa aliada
                <span className="text-[#475569] text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                value={nombreEmpresa}
                onChange={(e) => handleNombreChange(e.target.value)}
                placeholder="Ej: Gasolineras Puma"
                className="w-full bg-[#1A1B4B] border border-[#2D2F5E] rounded-xl py-3 px-4 text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#E8344E] focus:border-[#E8344E] transition-all"
              />
            </div>

            {/* Checkbox de confirmación */}
            <div className="flex items-start gap-3 p-4 bg-[#1A1B4B] border border-[#2D2F5E] rounded-xl">
              <Checkbox
                id="check-aliado"
                checked={entendido}
                onCheckedChange={(v) => handleEntendido(v === true)}
                className="mt-0.5"
              />
              <label htmlFor="check-aliado" className="text-[#94A3B8] text-sm leading-relaxed cursor-pointer">
                Entiendo que el aliado debe aceptar la invitación para que la colaboración
                esté activa. Los códigos se crearán normalmente aunque no haya aceptado aún.
              </label>
            </div>
          </div>
        )}
      </div>
    </PasoLayout>
  )
}
