'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Building2, Trophy, Calendar, MessageCircle, Gift,
  UtensilsCrossed, ShoppingBag, Fuel, Globe, Briefcase,
  CheckCircle, ArrowRight,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import MarketingChrome from '@/components/marketing/MarketingChrome'
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader'
import { Marquee } from '@/components/ui/Marquee'

const EJEMPLOS_INDUSTRIA = [
  {
    id: 'restaurantes',
    nombre: 'Restaurantes',
    icono: UtensilsCrossed,
    basico: `Quiero una ruleta para mi restaurante Los Pollos del 1 al 30 de junio. Los clientes validan su correo, 1 giro. Premios: 15% dto (60%), postre gratis (30%), menú gratis (10%). Por WhatsApp.`,
    avanzado: `Campaña de puntos para mi cadena de restaurantes La Italiana. Por cada $25 de consumo el cliente gana 1 punto. Al llegar a 10 puntos recibe una pizza personal gratis. Sin fecha de vencimiento, por WhatsApp y Telegram. Máximo 2000 participantes.`,
    configura: ['Tipo de campaña (ruleta)', 'Canal (WhatsApp)', 'Condición (validar correo)', '3 premios con probabilidades', 'Fecha inicio y fin'],
  },
  {
    id: 'retail',
    nombre: 'Retail',
    icono: ShoppingBag,
    basico: `Crea un sistema de puntos para mi tienda de ropa StyleMx. Por cada $25 de compra = 1 punto. Con 30 puntos = $15 de descuento. Por WhatsApp.`,
    avanzado: `Sistema de fidelización para mi cadena de tiendas TechStore con 5 sucursales. Los clientes suben su factura por Telegram para ganar puntos. $10 = 1 punto. Meta: 50 puntos para canjear un accesorio gratis valorado en $30. Sin límite de participantes. Solo de lunes a viernes.`,
    configura: ['Sistema de puntos', 'Mecánica de canje', 'Canal (Telegram)', 'Horario específico'],
  },
  {
    id: 'gasolineras',
    nombre: 'Gasolineras',
    icono: Fuel,
    basico: `Alianza con supermercado local. Facturas de más de $30 = puntos para combustible. 1 punto por cada $10. 50 puntos = $5 descuento en gasolina. Por Telegram.`,
    avanzado: `Alianza Gasolineras Puma + Walmart. El cliente sube su ticket de Walmart de más de $30 por Telegram. Gana 1 punto por cada $10. Al llegar a 100 puntos = $10 de descuento en combustible. Solo martes y jueves de 7am a 7pm. Vigente todo julio.`,
    configura: ['Validación por factura', 'Mecánica de puntos', 'Horario (Mar/Jue)', 'Canal (Telegram)', 'Fechas de vigencia'],
  },
  {
    id: 'ecommerce',
    nombre: 'E-commerce',
    icono: Globe,
    basico: `Cupones flash para mi tienda online. Los clientes ingresan su correo y reciben un código de 25% de descuento. Máximo 500 cupones. El botón los lleva a mi tienda.`,
    avanzado: `Campaña de lanzamiento para mi app de delivery FoodRush. Landing page donde el cliente pone su correo y recibe un cupón único de $5 de descuento en su primer pedido. El botón los lleva directo a descargar la app. Límite: 2000 registros. Válido del 15 al 31 de julio.`,
    configura: ['Cupón directo', 'Deep linking a app/tienda', 'Límite de participantes', 'Fechas de vigencia'],
  },
  {
    id: 'servicios',
    nombre: 'Servicios',
    icono: Briefcase,
    basico: `Ruleta de bienvenida para nuevos clientes de mi gimnasio FitLife. Los clientes validan su correo y giran 1 vez. Premios: 1 mes gratis (10%), clase de prueba gratis (40%), 20% de descuento (50%).`,
    avanzado: `Sistema de referidos para mi salón de belleza Glam. El cliente registra su teléfono por WhatsApp. Por cada amigo que trae = 1 punto de servicio. Con 3 puntos = un servicio de coloración gratis valorado en $45. Sin fecha de vencimiento.`,
    configura: ['Condición de participación', 'Premio con probabilidades', 'Canal (WhatsApp)', 'Frecuencia (1 vez total)'],
  },
]

const FAQ = [
  { q: '¿Puedo pedir campañas en inglés?', a: 'Sí. La IA de FREEPOL entiende prompts en español e inglés. Sin embargo, los mensajes de bienvenida se generarán en el idioma del prompt.' },
  { q: '¿Qué pasa si pido algo que FREEPOL no puede hacer?', a: 'La IA lo detecta automáticamente y te sugiere la alternativa más cercana. Verás una tabla naranja en los resultados con "Lo que pediste" vs "La alternativa de FREEPOL".' },
  { q: '¿Cuántos premios puede tener una ruleta?', a: 'Un máximo de 3 premios por ruleta. Puedes configurar las probabilidades de cada uno siempre que sumen 100%.' },
  { q: '¿Puedo cambiar la campaña después de lanzarla?', a: 'En este momento las campañas se crean como versión final. Próximamente agregaremos la opción de pausar, editar y relanzar desde el dashboard.' },
  { q: '¿Cómo funciona el sistema anti-fraude?', a: 'Cada participante está vinculado a su correo o teléfono. Además usamos verificación por IP para detectar registros múltiples desde el mismo dispositivo. Los códigos incluyen un hash SHA-256 que verifica su autenticidad.' },
  { q: '¿Los códigos de premio pueden expirar?', a: 'Sí. Puedes configurar la expiración en el wizard: 24h, 48h, 72h o 1 semana. Después de ese tiempo el cajero no podrá validar el código.' },
  { q: '¿Puedo tener varias campañas activas al mismo tiempo?', a: 'Con el plan Free tienes hasta 2 campañas activas simultáneas. El plan Starter sube a 5 y el Pro ofrece campañas ilimitadas.' },
  { q: '¿Cómo ven mis clientes la campaña?', a: 'Reciben un link directo a la landing page generada automáticamente (freepol.app/c/tu-campana) por WhatsApp, Telegram, Instagram o cualquier canal que configures.' },
]

export default function GuiaPageClient() {
  return (
    <MarketingChrome>
      <div className="min-h-screen bg-[#0A0A0A]">
        <MarketingSubpageHeader subtitle="Guía" />
        <section className="px-4 pb-8 pt-12 text-center md:px-8 md:pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black uppercase leading-tight text-white md:text-7xl"
          >
            Domina los{' '}
            <span className="text-[#E8344E]">prompts</span>
          </motion.h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#94A3B8]">
            Entre más específico seas, mejor configura la IA tu campaña.
          </p>
        </section>

        <div className="bg-[#1A1B4B] py-2">
          <Marquee speed={24} className="font-black uppercase tracking-widest text-[#F2839A]">
            <span>Tips</span><span>·</span><span>Prompts</span><span>·</span>
            <span>Industria</span><span>·</span><span>Resultados</span><span>·</span>
          </Marquee>
        </div>

        <main className="mx-auto max-w-4xl space-y-16 px-4 py-14 md:px-8">
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white">¿Qué es un buen prompt?</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-red-500/40 bg-red-950/40 p-6">
                <h3 className="font-black text-red-200">Prompt vago</h3>
                <div className="rounded-xl border border-red-500/30 bg-[#0A0A0A] p-4 font-mono text-sm text-red-100">
                  &ldquo;Quiero una campaña de descuentos&rdquo;
                </div>
              </div>
              <div className="space-y-3 rounded-2xl border border-[#22C55E]/40 bg-emerald-950/30 p-6">
                <h3 className="font-black text-[#22C55E]">Prompt con garra</h3>
                <div className="rounded-xl border border-[#22C55E]/30 bg-[#0A0A0A] p-4 font-mono text-sm text-[#22C55E]">
                  &ldquo;Quiero una ruleta para Los Pollos del 1 al 30 de junio. Clientes validan correo, 1 giro. Premios: 15% dto (60%), postre (30%), menú (10%). WhatsApp.&rdquo;
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white">Los 5 ingredientes</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {[
                { icono: Building2, color: '#E8344E', titulo: 'El nombre de tu negocio', descripcion: 'Siempre menciona el nombre. La IA lo usa para personalizar mensajes y landing.', ejemplo: '"para mi restaurante Los Pollos"' },
                { icono: Trophy, color: '#F59E0B', titulo: 'El tipo de campaña', descripcion: 'Ruleta, puntos, cupón o factura.', ejemplo: '"una ruleta", "sistema de puntos"' },
                { icono: Calendar, color: '#22C55E', titulo: 'Las fechas', descripcion: 'Inicio, fin y horarios si aplica.', ejemplo: '"del 1 al 30 de junio"' },
                { icono: MessageCircle, color: '#38BDF8', titulo: 'El canal', descripcion: 'WhatsApp, Telegram y más.', ejemplo: '"por WhatsApp y Telegram"' },
                { icono: Gift, color: '#F2839A', titulo: 'Los premios', descripcion: 'Probabilidades que sumen 100% en ruletas; metas claras en puntos.', ejemplo: '"15% dto (60%), postre (40%)"' },
              ].map((item, i) => {
                const Icono = item.icono
                return (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5"
                  >
                    <AccordionTrigger className="py-4 font-bold text-white hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${item.color}33` }}
                        >
                          <Icono size={16} style={{ color: item.color }} />
                        </div>
                        {item.titulo}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pb-4 pl-11">
                        <p className="text-[#94A3B8]">{item.descripcion}</p>
                        <p className="rounded-lg bg-[#E8344E]/15 px-3 py-2 font-mono text-xs text-[#F2839A]">
                          Ejemplo: {item.ejemplo}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-white">Ejemplos por industria</h2>
            <div className="space-y-6">
              {EJEMPLOS_INDUSTRIA.map((ind) => {
                const Icono = ind.icono
                return (
                  <div
                    key={ind.id}
                    className="space-y-5 rounded-2xl border border-white/10 bg-[#1A1B4B] p-6"
                  >
                    <div className="flex items-center gap-2">
                      <Icono size={18} className="text-[#E8344E]" />
                      <h3 className="text-lg font-black text-white">{ind.nombre}</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[{ label: 'Básico', prompt: ind.basico }, { label: 'Avanzado', prompt: ind.avanzado }].map((ej) => (
                        <div key={ej.label} className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wide text-[#64748B]">
                            {ej.label}
                          </span>
                          <div className="rounded-xl border border-[#22C55E]/25 bg-[#0A0A0A] p-4 font-mono text-sm leading-relaxed text-[#22C55E]">
                            &ldquo;{ej.prompt}&rdquo;
                          </div>
                          <Link
                            href="/chat"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8344E] hover:text-[#F2839A]"
                          >
                            Usar en el chat →
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[#64748B]">La IA configurará:</span>
                      {ind.configura.map((c) => (
                        <span
                          key={c}
                          className="flex items-center gap-1 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-2.5 py-1 text-xs text-[#22C55E]"
                        >
                          <CheckCircle size={10} />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black text-white">FAQ</h2>
            <Accordion type="single" collapsible className="space-y-0">
              {FAQ.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-bold text-white">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-[#94A3B8]">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="rounded-3xl bg-[#E8344E] p-10 text-center">
            <h2 className="text-3xl font-black text-white md:text-4xl">A probarlo</h2>
            <p className="mt-3 text-white/85">Escribe y deja que la IA arme la campaña.</p>
            <Link
              href="/chat"
              data-cursor="pointer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-8 py-4 font-black text-white hover:brightness-110"
            >
              Abrir asistente <ArrowRight size={16} />
            </Link>
          </section>
        </main>
      </div>
    </MarketingChrome>
  )
}
