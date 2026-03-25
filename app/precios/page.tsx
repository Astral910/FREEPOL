'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, X, Zap, ArrowRight } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { createClient } from '@/lib/supabase'

const PLANES = [
  {
    id: 'free', nombre: 'Free', mensual: 0, anual: 0,
    subtitulo: 'Para empezar y probar',
    color: '#64748B', borderClass: 'border-[#E5E7EB]',
    destacado: false, oscuro: false,
    botonLabel: 'Empezar gratis',
    botonClass: 'border border-[#E5E7EB] text-[#0F172A] hover:bg-[#F8FAFC]',
    features: [
      { label: '2 campañas activas', ok: true },
      { label: 'Hasta 1,000 participantes/mes', ok: true },
      { label: 'Landing page generada', ok: true },
      { label: 'Bot de Telegram', ok: true },
      { label: 'Códigos QR únicos', ok: true },
      { label: 'WhatsApp Business', ok: false },
      { label: 'Dashboard con métricas', ok: false },
      { label: 'Exportar participantes CSV', ok: false },
      { label: 'Soporte por email', ok: false },
    ],
  },
  {
    id: 'starter', nombre: 'Starter', mensual: 19, anual: 15,
    subtitulo: 'Para negocios locales',
    color: '#22C55E', borderClass: 'border-[#22C55E]',
    destacado: false, oscuro: false,
    botonLabel: 'Empezar con Starter',
    botonClass: 'bg-[#22C55E] text-white hover:opacity-90',
    badge: 'Para negocios locales',
    features: [
      { label: '5 campañas activas', ok: true },
      { label: 'Hasta 3,000 participantes/mes', ok: true },
      { label: 'Landing page generada', ok: true },
      { label: 'Bot de Telegram', ok: true },
      { label: 'Códigos QR únicos', ok: true },
      { label: 'WhatsApp Business básico', ok: true },
      { label: 'Dashboard con métricas', ok: true },
      { label: 'Exportar participantes CSV', ok: true },
      { label: 'Soporte por email', ok: true },
    ],
  },
  {
    id: 'pro', nombre: 'Pro', mensual: 49, anual: 39,
    subtitulo: 'Para negocios en crecimiento',
    color: '#E8344E', borderClass: 'border-[#E8344E]',
    destacado: true, oscuro: false,
    botonLabel: 'Empezar con Pro',
    botonClass: 'gradient-bg text-white hover:opacity-90 shadow-lg shadow-[#E8344E]/20',
    badge: 'Más popular',
    features: [
      { label: 'Campañas ilimitadas', ok: true },
      { label: 'Hasta 10,000 participantes/mes', ok: true },
      { label: 'Todo lo de Starter', ok: true },
      { label: 'Bot de Instagram', ok: true },
      { label: 'Personalización de marca completa', ok: true },
      { label: 'Colaboraciones entre empresas', ok: true },
      { label: 'Soporte prioritario 24/7', ok: true },
      { label: 'OCR de facturas', ok: false },
      { label: 'API REST para integraciones', ok: false },
    ],
  },
  {
    id: 'enterprise', nombre: 'Enterprise', mensual: 149, anual: 119,
    subtitulo: 'Para cadenas y empresas grandes',
    color: '#E2E8F0', borderClass: 'border-[#2D2F5E]',
    destacado: false, oscuro: true,
    botonLabel: 'Contactar ventas',
    botonClass: 'border border-white/30 text-white hover:bg-white/10',
    features: [
      { label: 'Participantes ilimitados', ok: true },
      { label: 'Todo lo de Pro', ok: true },
      { label: 'OCR de facturas con IA', ok: true },
      { label: 'Red de alianzas múltiples', ok: true },
      { label: 'API REST para integraciones', ok: true },
      { label: 'Múltiples usuarios y roles', ok: true },
      { label: 'Dominio personalizado', ok: true },
      { label: 'SLA 99.9% disponibilidad', ok: true },
      { label: 'Onboarding personalizado', ok: true },
    ],
  },
]

const FAQ_PRECIOS = [
  { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí. Puedes subir o bajar de plan cuando quieras desde la configuración de tu cuenta. Los cambios aplican en el próximo ciclo de facturación.' },
  { q: '¿Qué pasa si supero el límite de participantes?', a: 'Tu campaña seguirá activa pero no aceptará nuevos registros hasta el siguiente mes. Te notificaremos cuando estés llegando al límite para que puedas actualizar tu plan.' },
  { q: '¿Hay contrato de permanencia?', a: 'No. Todos los planes son mes a mes. El plan anual requiere pago adelantado del año completo pero no tiene penalización por cancelación.' },
  { q: '¿Ofrecen descuentos para ONGs?', a: 'Sí. Las organizaciones sin fines de lucro reciben 40% de descuento en cualquier plan. Contáctanos en ventas@freepol.app con tu documentación.' },
  { q: '¿Cómo funciona la prueba gratuita?', a: 'El plan Free no tiene fecha de vencimiento. Es funcional para siempre con sus limitaciones. No necesitas tarjeta de crédito para empezar.' },
]

export default function PreciosPage() {
  const router = useRouter()
  const [anual, setAnual] = useState(false)

  /** Seleccionar un plan: si hay sesión y empresa → actualizar plan directo;
   *  si no hay empresa → onboarding con plan pre-seleccionado;
   *  enterprise → mailto */
  const handleElegirPlan = async (planId: string) => {
    if (planId === 'enterprise') {
      window.location.href = 'mailto:ventas@freepol.app?subject=Plan Enterprise FREEPOL'
      return
    }
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      // Sin sesión: ir al onboarding con el plan pre-elegido
      router.push(`/onboarding?plan=${planId}`)
      return
    }

    // Con sesión: verificar si ya tiene empresa
    const { getEmpresaDelUsuario } = await import('@/lib/empresa')
    const empresa = await getEmpresaDelUsuario(data.session.user.id)

    if (!empresa) {
      // Tiene sesión pero no empresa → onboarding con plan pre-elegido
      router.push(`/onboarding?plan=${planId}`)
      return
    }

    // Ya tiene empresa → actualizar el plan directamente
    const { actualizarEmpresa } = await import('@/lib/empresa')
    await actualizarEmpresa(empresa.id, { plan: planId as 'free' | 'starter' | 'pro' | 'enterprise' })
    router.push('/dashboard?plan_actualizado=1')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar mínimo */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            <span className="text-[#E8344E]">FREE</span><span className="text-[#0F172A]">POL</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/guia" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Guía</Link>
            <Link href="/chat" className="px-4 py-2 rounded-xl bg-[#E8344E] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Probar gratis →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-20">

        {/* Hero */}
        <section className="text-center space-y-5">
          <span className="inline-block bg-[#FFF0F2] border border-[#F9B8C4] text-[#E8344E] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide">
            Precios
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A]">
            Simple, transparente,<br />
            <span className="gradient-text">sin sorpresas</span>
          </h1>
          <p className="text-[#64748B] text-lg">Empieza gratis. Escala cuando lo necesites.</p>

          {/* Toggle mensual/anual */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!anual ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>Mensual</span>
            <button
              onClick={() => setAnual(!anual)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${anual ? 'bg-[#E8344E]' : 'bg-[#E5E7EB]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${anual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium ${anual ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
              Anual
              <span className="ml-2 text-xs bg-[#F0FDF4] text-[#22C55E] border border-[#BBF7D0] px-2 py-0.5 rounded-full font-medium">
                Ahorra 20%
              </span>
            </span>
          </div>
        </section>

        {/* Planes */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {PLANES.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl border-2 p-6 space-y-5 flex flex-col relative ${plan.borderClass} ${plan.oscuro ? 'bg-[#0A0A0A]' : plan.destacado ? 'bg-[#F8FAFC] shadow-xl shadow-[#E8344E]/10' : 'bg-white'}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${plan.destacado ? 'gradient-bg text-white' : 'bg-[#22C55E] text-white'}`}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  <p className={`font-bold text-lg ${plan.oscuro ? 'text-white' : 'text-[#0F172A]'}`}>{plan.nombre}</p>
                  <p className={`text-sm mt-0.5 ${plan.oscuro ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{plan.subtitulo}</p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black ${plan.oscuro ? 'text-white' : 'text-[#0F172A]'}`}>
                      ${anual ? plan.anual : plan.mensual}
                    </span>
                    <span className={`text-sm ${plan.oscuro ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>/mes</span>
                  </div>
                  {anual && plan.mensual > 0 && (
                    <p className="text-xs text-[#22C55E] mt-0.5">Facturado anualmente</p>
                  )}
                </div>

                <button
                  onClick={() => handleElegirPlan(plan.id)}
                  className={`block w-full py-3 rounded-xl text-center font-semibold text-sm transition-opacity cursor-pointer ${plan.botonClass}`}
                >
                  {plan.botonLabel}
                </button>

                <ul className="space-y-2.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {f.ok
                        ? <Check size={14} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
                        : <X size={14} className="text-[#CBD5E1] flex-shrink-0 mt-0.5" />}
                      <span className={`text-sm ${f.ok ? plan.oscuro ? 'text-[#E2E8F0]' : 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ de precios */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] text-center">Preguntas sobre precios</h2>
          <Accordion type="single" collapsible className="space-y-0">
            {FAQ_PRECIOS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-[#0F172A] font-medium text-left">{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA */}
        <section className="gradient-bg rounded-3xl p-10 text-center space-y-5">
          <h2 className="text-3xl font-bold text-white">Empieza gratis hoy</h2>
          <p className="text-white/80">Sin tarjeta de crédito. Cancela cuando quieras.</p>
          <Link href="/chat" className="inline-flex items-center gap-2 bg-white text-[#E8344E] font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg">
            Crear mi primera campaña <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  )
}
