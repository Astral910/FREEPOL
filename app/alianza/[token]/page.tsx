'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Handshake, CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getUsuarioActual } from '@/lib/auth-helpers'
import { getEmpresaDelUsuario } from '@/lib/empresa'
import Link from 'next/link'

interface Alianza {
  id: string
  campana_id: string
  correo_aliado: string
  estado: string
  campanas: {
    nombre_campana: string
    nombre_negocio: string
  } | null
}

/**
 * Página pública para aceptar o rechazar una invitación de alianza.
 * Accesible desde el link de invitación enviado por correo.
 */
export default function AlianzaTokenPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const token = params?.token as string

  const [alianza, setAlianza] = useState<Alianza | null>(null)
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [resultado, setResultado] = useState<'aceptada' | 'rechazada' | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      if (!token) {
        setError('Token de invitación inválido.')
        setCargando(false)
        return
      }

      const { data } = await supabase
        .from('campana_aliados')
        .select('id,campana_id,correo_aliado,estado,campanas(nombre_campana,nombre_negocio)')
        .eq('token_invitacion', token)
        .maybeSingle()

      if (!data) {
        setError('Esta invitación no existe o ya expiró.')
      } else {
        setAlianza(data as unknown as Alianza)
      }
      setCargando(false)
    }
    cargar()
  }, [token, supabase])

  const handleAceptar = async () => {
    if (!alianza) return
    setProcesando(true)
    try {
      const usuario = await getUsuarioActual()
      let empresaReceptoraId: string | null = null

      if (usuario) {
        const emp = await getEmpresaDelUsuario(usuario.id)
        empresaReceptoraId = emp?.id ?? null
      }

      const { error: err } = await supabase
        .from('campana_aliados')
        .update({
          estado: 'activa',
          aceptado_en: new Date().toISOString(),
          ...(empresaReceptoraId ? { empresa_receptora_id: empresaReceptoraId } : {}),
        })
        .eq('token_invitacion', token)

      if (err) throw err
      setResultado('aceptada')
    } catch {
      setError('Ocurrió un error al procesar la invitación. Intenta de nuevo.')
    } finally {
      setProcesando(false)
    }
  }

  const handleRechazar = async () => {
    if (!alianza) return
    setProcesando(true)
    try {
      await supabase
        .from('campana_aliados')
        .update({ estado: 'rechazada' })
        .eq('token_invitacion', token)
      setResultado('rechazada')
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setProcesando(false)
    }
  }

  if (cargando) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E8344E] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error || !alianza) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <XCircle size={28} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]">Invitación no encontrada</h1>
        <p className="text-[#64748B] max-w-sm">{error || 'Esta invitación no existe o ya fue procesada.'}</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-[#E8344E] text-white font-semibold hover:opacity-90 transition-opacity">
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (resultado === 'aceptada') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-[#22C55E]" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A]">¡Colaboración activa!</h1>
        <p className="text-[#64748B] max-w-sm">
          Tus cajeros ya pueden validar los códigos de la campaña{' '}
          <strong>{alianza.campanas?.nombre_campana}</strong> desde{' '}
          <Link href="/validar" className="text-[#E8344E] hover:underline">/validar</Link>.
        </p>
        <Link href="/validar" className="px-8 py-4 rounded-xl bg-[#22C55E] text-white font-bold hover:opacity-90 transition-opacity">
          Ir a validar códigos →
        </Link>
      </div>
    )
  }

  if (resultado === 'rechazada') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex items-center justify-center">
          <XCircle size={28} className="text-[#64748B]" />
        </div>
        <h1 className="text-xl font-bold text-[#0F172A]">Invitación rechazada</h1>
        <p className="text-[#64748B]">La colaboración fue rechazada correctamente.</p>
        <Link href="/" className="text-sm text-[#E8344E] hover:underline">Volver al inicio</Link>
      </div>
    )
  }

  // Verificar si ya fue procesada
  if (alianza.estado !== 'pendiente') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center text-center px-4 gap-4">
        <p className="text-[#64748B]">Esta invitación ya fue {alianza.estado === 'activa' ? 'aceptada' : 'rechazada'}.</p>
        <Link href="/" className="text-sm text-[#E8344E] hover:underline">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 max-w-md w-full shadow-sm space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-[#E8344E]" />
          <span className="font-bold text-sm"><span className="text-[#E8344E]">FREE</span>POL</span>
        </div>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
            <Handshake size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">Invitación de colaboración</h1>
            <p className="text-[#64748B] text-sm mt-1">
              <strong>{alianza.campanas?.nombre_negocio ?? 'Una empresa'}</strong> te invita
              a colaborar en su campaña
            </p>
          </div>
        </div>

        {/* Detalles de la campaña */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <p className="text-[#64748B] text-xs uppercase tracking-wide">Campaña</p>
          <p className="text-[#0F172A] font-semibold">{alianza.campanas?.nombre_campana}</p>
          <p className="text-[#64748B] text-xs">de {alianza.campanas?.nombre_negocio}</p>
        </div>

        {/* Qué implica */}
        <div className="bg-[#FFF0F2] border border-[#F9B8C4] rounded-xl p-4">
          <p className="text-[#E8344E] text-sm font-medium mb-2">¿Qué implica aceptar?</p>
          <ul className="space-y-1.5">
            {[
              'Tus cajeros podrán validar los códigos QR de esta campaña',
              'Acceso desde tu panel /validar sin cambios adicionales',
              'Puedes desactivar la colaboración desde tu dashboard',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[#4338CA] text-xs">
                <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={handleRechazar}
            disabled={procesando}
            className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#64748B] font-semibold text-sm hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
          >
            Rechazar
          </button>
          <button
            onClick={handleAceptar}
            disabled={procesando}
            className="flex-1 py-3 rounded-xl bg-[#22C55E] text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {procesando ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
