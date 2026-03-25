import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2, Trophy, Calendar, MessageCircle, Gift,
  UtensilsCrossed, ShoppingBag, Fuel, Globe, Briefcase,
  Copy, CheckCircle, ArrowRight, Search,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Guía de Prompts — FREEPOL',
  description: 'Aprende a escribir prompts efectivos para la IA de FREEPOL y crea campañas perfectas en minutos.',
}

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

export default function GuiaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar mínimo */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-bold text-xl"><span className="text-[#E8344E]">FREE</span><span className="text-[#0F172A]">POL</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/precios" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Precios</Link>
            <Link href="/chat" className="px-4 py-2 rounded-xl bg-[#E8344E] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Probar IA →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16 space-y-20">

        {/* Hero */}
        <section className="text-center space-y-4">
          <span className="inline-block bg-[#FFF0F2] border border-[#F9B8C4] text-[#E8344E] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide">
            Guía completa
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
            Aprende a hablar con<br />
            <span className="gradient-text">la IA de FREEPOL</span>
          </h1>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Entre más detalle en tu prompt, mejor resultado. Aquí tienes todo lo que necesitas saber.
          </p>
        </section>

        {/* Sección 1 — Comparación */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">¿Qué es un buen prompt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Malo */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">❌</span>
                <h3 className="font-bold text-red-700">Prompt vago</h3>
              </div>
              <div className="bg-white rounded-xl p-4 font-mono text-sm text-[#0F172A] border border-red-100">
                &ldquo;Quiero una campaña de descuentos&rdquo;
              </div>
              <p className="text-red-600 text-sm">
                La IA no sabe el tipo, el canal, las fechas ni los premios. Resultado genérico e incompleto.
              </p>
            </div>
            {/* Bueno */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <h3 className="font-bold text-green-700">Prompt detallado</h3>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl p-4 font-mono text-sm text-[#22C55E] border border-green-900">
                &ldquo;Quiero una ruleta para Los Pollos del 1 al 30 de junio. Clientes validan correo, 1 giro. Premios: 15% dto (60%), postre gratis (30%), menú gratis (10%). Por WhatsApp.&rdquo;
              </div>
              <p className="text-green-700 text-sm">
                Tipo, negocio, fechas, canal, condición y premios. La IA configura todo exactamente.
              </p>
            </div>
          </div>
        </section>

        {/* Sección 2 — 5 ingredientes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">Los 5 ingredientes de un prompt perfecto</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              { icono: Building2, color: '#E8344E', titulo: 'El nombre de tu negocio', descripcion: 'Siempre menciona el nombre. La IA lo usa para personalizar los mensajes, los códigos de premio y la landing page.', ejemplo: '"para mi restaurante Los Pollos"' },
              { icono: Trophy, color: '#F59E0B', titulo: 'El tipo de campaña', descripcion: 'Ruleta, puntos por compra, cupón directo o validación de facturas. Si no lo dices, la IA elige el más apropiado.', ejemplo: '"una ruleta", "sistema de puntos", "un cupón de descuento"' },
              { icono: Calendar, color: '#22C55E', titulo: 'Las fechas', descripcion: 'Fechas de inicio y fin. Opcionalmente días de la semana y horario específico. La IA las pone automáticamente en la campaña.', ejemplo: '"del 1 al 30 de junio", "los martes y jueves de 8am a 6pm"' },
              { icono: MessageCircle, color: '#38BDF8', titulo: 'El canal', descripcion: 'WhatsApp, Telegram, Instagram o Landing Page. Puedes pedir varios a la vez y la IA los configura todos.', ejemplo: '"por WhatsApp y Telegram", "en Instagram"' },
              { icono: Gift, color: '#F2839A', titulo: 'Los premios', descripcion: 'Para ruletas: nombre y porcentaje de cada premio (deben sumar 100%). Para puntos: cuántos puntos por cuánto dinero y cuál es el premio al canjear.', ejemplo: '"15% descuento (60%), postre gratis (40%)", "$25 = 1 punto, a 50 puntos = $10 de descuento"' },
            ].map((item, i) => {
              const Icono = item.icono
              return (
                <AccordionItem key={i} value={`item-${i}`} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-5 overflow-hidden">
                  <AccordionTrigger className="text-[#0F172A] font-semibold hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}20` }}>
                        <Icono size={16} style={{ color: item.color }} />
                      </div>
                      {item.titulo}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-11 space-y-2 pb-2">
                      <p>{item.descripcion}</p>
                      <p className="text-xs font-mono text-[#E8344E] bg-[#FFF0F2] rounded-lg px-3 py-2">Ejemplo: {item.ejemplo}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </section>

        {/* Sección 3 — Ejemplos por industria */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">Ejemplos por industria</h2>
          <div className="space-y-6">
            {EJEMPLOS_INDUSTRIA.map((ind) => {
              const Icono = ind.icono
              return (
                <div key={ind.id} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <Icono size={18} className="text-[#E8344E]" />
                    <h3 className="font-bold text-[#0F172A] text-lg">{ind.nombre}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[{ label: 'Básico', prompt: ind.basico }, { label: 'Avanzado', prompt: ind.avanzado }].map((ej) => (
                      <div key={ej.label} className="space-y-2">
                        <span className="text-xs text-[#64748B] font-medium uppercase tracking-wide">{ej.label}</span>
                        <div className="bg-[#0A0A0A] rounded-xl p-4 font-mono text-sm text-[#22C55E] leading-relaxed">
                          &ldquo;{ej.prompt}&rdquo;
                        </div>
                        <Link href={`/chat`} className="inline-flex items-center gap-1.5 text-xs text-[#E8344E] hover:text-[#F2839A] transition-colors">
                          Usar este prompt →
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-[#64748B]">La IA configurará:</span>
                    {ind.configura.map((c) => (
                      <span key={c} className="flex items-center gap-1 bg-[#F0FDF4] text-[#22C55E] text-xs px-2.5 py-1 rounded-full border border-[#BBF7D0]">
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

        {/* Sección 4 — FAQ */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible className="space-y-0">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-[#0F172A] font-medium text-left">{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA Final */}
        <section className="gradient-bg rounded-3xl p-10 text-center space-y-5">
          <h2 className="text-3xl font-bold text-white">¿Listo para crear tu primera campaña?</h2>
          <p className="text-white/80">Escribe lo que tienes en mente y la IA hace el resto.</p>
          <Link href="/chat" className="inline-flex items-center gap-2 bg-white text-[#E8344E] font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg">
            Abrir el asistente <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  )
}
