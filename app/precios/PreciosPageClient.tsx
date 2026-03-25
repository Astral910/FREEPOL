'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { createClient } from '@/lib/supabase'
import MarketingChrome from '@/components/marketing/MarketingChrome'
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader'
import { Sticker } from '@/components/ui/Sticker'

const PLANES = [
  {
    id: 'free', nombre: 'Free', mensual: 0, anual: 0,
    subtitulo: 'Para empezar y probar',
    color: '#64748B', borderClass: 'border-[#E5E7EB]',
    destacado: false, oscuro: false,
    botonLabel: 'Empezar gratis',
    botonClass: 'border border-[#0A0A0A]/15 text-[#0A0A0A] hover:bg-[#FFF5F6]',
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
    botonClass: 'bg-[#E8344E] text-white hover:brightness-110 shadow-lg shadow-[#E8344E]/25',
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
    color: '#E2E8F0', borderClass: 'border-white/20',
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

export default function PreciosPageClient() {
  const router = useRouter()
  const [anual, setAnual] = useState(false)

  const handleElegirPlan = async (planId: string) => {
    if (planId === 'enterprise') {
      window.location.href = 'mailto:ventas@freepol.app?subject=Plan Enterprise FREEPOL'
      return
    }
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      router.push(`/onboarding?plan=${planId}`)
      return
    }

    const { getEmpresaDelUsuario } = await import('@/lib/empresa')
    const empresa = await getEmpresaDelUsuario(data.session.user.id)

    if (!empresa) {
      router.push(`/onboarding?plan=${planId}`)
      return
    }

    const { actualizarEmpresa } = await import('@/lib/empresa')
    await actualizarEmpresa(empresa.id, { plan: planId as 'free' | 'starter' | 'pro' | 'enterprise' })
    router.push('/dashboard?plan_actualizado=1')
  }

  return (
    <MarketingChrome>
      <div className="min-h-screen bg-[#FFF5F6]">
        <MarketingSubpageHeader subtitle="Precios" />
        <section className="bg-[#E8344E] px-4 py-14 text-center md:px-8 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex justify-center">
              <Sticker rotation={3} bgColor="#0A0A0A">Sin letra chica</Sticker>
            </div>
            <h1 className="text-5xl font-black uppercase text-white md:text-7xl">
              Precios que{' '}
              <span className="text-[#0A0A0A]">escalan</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-white/90">
              Empieza gratis. Activa WhatsApp y Telegram cuando crezcas.
            </p>
          </motion.div>

          <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!anual ? 'text-white' : 'text-white/50'}`}>Mensual</span>
            <button
              type="button"
              data-cursor="pointer"
              onClick={() => setAnual(!anual)}
              className={`relative h-8 w-14 rounded-full transition-colors ${anual ? 'bg-[#0A0A0A]' : 'bg-white/30'}`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  anual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-bold ${anual ? 'text-white' : 'text-white/50'}`}>
              Anual
              <span className="ml-2 rounded-full bg-[#22C55E] px-2 py-0.5 text-xs text-white">-20%</span>
            </span>
          </div>
        </section>

        <main className="mx-auto max-w-6xl space-y-16 px-4 py-14 md:px-8">
          <section>
            <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PLANES.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col space-y-5 rounded-2xl border-2 p-6 ${
                    plan.oscuro
                      ? 'border-white/15 bg-[#1A1B4B] text-white'
                      : plan.destacado
                        ? 'border-[#E8344E] bg-white shadow-xl shadow-[#E8344E]/15'
                        : 'border-[#E5E7EB] bg-white'
                  }`}
                >
                  {plan.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-black ${
                        plan.destacado ? 'bg-[#E8344E] text-white' : 'bg-[#22C55E] text-white'
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}
                  <div>
                    <p className={`text-lg font-black ${plan.oscuro ? 'text-white' : 'text-[#0A0A0A]'}`}>
                      {plan.nombre}
                    </p>
                    <p className={`mt-0.5 text-sm ${plan.oscuro ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      {plan.subtitulo}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black ${plan.oscuro ? 'text-white' : 'text-[#0A0A0A]'}`}>
                        ${anual ? plan.anual : plan.mensual}
                      </span>
                      <span className={`text-sm ${plan.oscuro ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>/mes</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-cursor="pointer"
                    onClick={() => handleElegirPlan(plan.id)}
                    className={`block w-full cursor-pointer rounded-xl py-3 text-center text-sm font-black ${plan.botonClass}`}
                  >
                    {plan.botonLabel}
                  </button>
                  <ul className="space-y-2.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {f.ok ? (
                          <Check size={14} className="mt-0.5 flex-shrink-0 text-[#22C55E]" />
                        ) : (
                          <X size={14} className="mt-0.5 flex-shrink-0 text-[#CBD5E1]" />
                        )}
                        <span
                          className={`text-sm ${
                            f.ok
                              ? plan.oscuro
                                ? 'text-[#E2E8F0]'
                                : 'text-[#0F172A]'
                              : 'text-[#94A3B8]'
                          }`}
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-[#E5E7EB] bg-white p-8">
            <h2 className="text-center text-2xl font-black text-[#0A0A0A]">Preguntas sobre precios</h2>
            <Accordion type="single" collapsible className="space-y-0">
              {FAQ_PRECIOS.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-bold text-[#0A0A0A]">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-[#64748B]">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="rounded-3xl bg-[#0A0A0A] p-10 text-center">
            <h2 className="text-3xl font-black text-white md:text-4xl">Empieza gratis hoy</h2>
            <p className="mt-3 text-[#94A3B8]">Sin tarjeta. Tu primera campaña en minutos.</p>
            <Link
              href="/chat"
              data-cursor="pointer"
              className="btn-shimmer relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#E8344E] px-8 py-4 font-black text-white"
            >
              Crear mi primera campaña <ArrowRight size={16} />
            </Link>
          </section>
        </main>
      </div>
    </MarketingChrome>
  )
}
