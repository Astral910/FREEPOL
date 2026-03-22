import type { Metadata } from 'next'
import Link from 'next/link'
import { Trophy, Handshake, Smartphone, ArrowRight, Terminal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Demos en vivo — FREEPOL',
  description: 'Mira tres campañas reales funcionando: ruleta, puntos por factura y cupón con deep link.',
}

const DEMOS = [
  {
    numero: '01',
    categoria: 'Restaurante',
    empresa: 'Pollo Campero',
    campana: 'Sabor Ganador',
    slug: 'sabor-ganador-campero',
    tipo: '🎰 Ruleta de Premios',
    descripcion: 'Campaña mensual gamificada. El cliente valida su correo, gira la ruleta y recibe su código QR único que expira en 24 horas.',
    metricas: ['3 premios', '1 giro por correo', 'QR en 24h'],
    colorTop: '#E8000D',
    colorHeader: 'bg-[#E8000D]',
    colorBorde: 'border-t-4',
    icono: Trophy,
    prompt: `Configura la campaña "Sabor Ganador" para Pollo Campero. Ruleta con 3 premios: 15% descuento (60%), pieza gratis (30%), menú completo (10%). Un giro por correo. Códigos QR que expiran en 24h. Por WhatsApp e Instagram.`,
    promptChat: 'Configura la campaña Sabor Ganador para Pollo Campero. Ruleta con 3 premios: 15% descuento (60%), pieza gratis (30%), menú completo (10%). Un giro por correo. Vigente este mes en WhatsApp.',
    colorBtn: 'bg-[#E8000D] hover:bg-[#C00008]',
  },
  {
    numero: '02',
    categoria: 'Alianza Empresarial',
    empresa: 'Walmart + Grupo Puma',
    campana: 'Eco-Puntos',
    slug: 'eco-puntos-walmart-puma',
    tipo: '📸 Puntos por Factura',
    descripcion: 'Alianza entre retail y gasolinera. El cliente sube su factura de Walmart por Telegram, la IA la lee y asigna puntos canjeables en combustible.',
    metricas: ['$10 = 1 punto', 'Meta 50 pts', '$5 descuento gasolina'],
    colorTop: '#0071CE',
    colorHeader: 'bg-[#0071CE]',
    colorBorde: 'border-t-4',
    icono: Handshake,
    prompt: `Alianza Walmart + Gasolineras Puma. Los clientes suben su factura de Walmart por Telegram. Por cada $10 de compra = 1 punto. Al llegar a 50 puntos reciben $5 de descuento en combustible. Sin límite de participaciones.`,
    promptChat: 'Crea una alianza Walmart-Puma. Los usuarios suben su factura de Walmart por Telegram. Por cada $10 de compra = 1 Eco-Punto. Meta 50 puntos = $5 de descuento en combustible Puma.',
    colorBtn: 'bg-[#0071CE] hover:bg-[#005BA6]',
  },
  {
    numero: '03',
    categoria: 'E-commerce',
    empresa: "McDonald's Guatemala",
    campana: 'Cupones Flash',
    slug: 'cupones-flash-mcdonalds',
    tipo: '🎟️ Cupón con Deep Linking',
    descripcion: 'Convierte seguidores de Instagram en usuarios de la app. Código único por persona con botón que abre directamente la app de McDonald\'s.',
    metricas: ['Código único', '72h validez', 'Límite 5,000'],
    colorTop: '#FFC72C',
    colorHeader: 'bg-[#FFC72C]',
    colorBorde: 'border-t-4',
    icono: Smartphone,
    prompt: `Cupones flash para McDonald's Guatemala desde Instagram. Los clientes ingresan su correo y reciben un código único de Cuarto de Libra gratis. El botón los lleva directo a la app de McDonald's. Máximo 5,000 cupones. Vigente 15 días.`,
    promptChat: "Lanza Cupones Flash para McDonalds. Landing page donde el cliente pone su correo y recibe código único de descuento para un Cuarto de Libra. Botón de deep linking a la app. Máximo 5000 cupones.",
    colorBtn: 'bg-[#FFC72C] hover:bg-[#E6B020] text-[#0F172A]',
  },
]

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar simple */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            <span className="text-[#5B5CF6]">FREE</span><span className="text-[#0F172A]">POL</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/precios" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Precios</Link>
            <Link href="/chat" className="px-4 py-2 rounded-xl bg-[#5B5CF6] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Crear campaña →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-5">
          <span className="inline-block bg-[#EEF2FF] border border-[#C4B5FD] text-[#5B5CF6] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide">
            Casos de uso reales
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
            Mira FREEPOL
            <span className="gradient-text"> en acción</span>
          </h1>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Tres empresas reales, tres tipos de campaña. Todos funcionando en vivo ahora mismo.
          </p>
        </section>

        {/* Cards de demos */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {DEMOS.map((demo) => {
            const Icono = demo.icono
            return (
              <div
                key={demo.slug}
                className={`rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${demo.colorBorde}`}
                style={{ borderTopColor: demo.colorTop }}
              >
                {/* Header coloreado */}
                <div className={`${demo.colorHeader} px-5 py-4 flex items-center justify-between`}>
                  <div>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Caso {demo.numero}</p>
                    <p className="text-white font-bold text-sm mt-0.5">{demo.categoria}</p>
                  </div>
                  <Icono size={22} className="text-white/80" />
                </div>

                <div className="p-5 space-y-4">
                  {/* Info */}
                  <div>
                    <p className="font-bold text-[#0F172A] text-base">{demo.empresa}</p>
                    <p className="text-[#64748B] text-sm">{demo.campana}</p>
                  </div>

                  <span className="inline-block bg-[#F8FAFC] border border-[#E5E7EB] text-[#64748B] text-xs px-3 py-1 rounded-full font-medium">
                    {demo.tipo}
                  </span>

                  <p className="text-[#374151] text-sm leading-relaxed">{demo.descripcion}</p>

                  {/* Métricas */}
                  <div className="flex flex-wrap gap-1.5">
                    {demo.metricas.map((m) => (
                      <span key={m} className="text-xs bg-[#F1F5F9] text-[#64748B] px-2.5 py-1 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Prompt */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                      <Terminal size={11} />
                      Prompt usado
                    </div>
                    <div className="bg-[#0F172A] rounded-xl p-3 font-mono text-xs text-[#22C55E] leading-relaxed max-h-24 overflow-hidden relative">
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0F172A] to-transparent" />
                      &ldquo;{demo.prompt}&rdquo;
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      href={`/c/${demo.slug}`}
                      target="_blank"
                      className={`w-full py-3 rounded-xl text-white font-bold text-sm text-center transition-opacity ${demo.colorBtn}`}
                    >
                      Probar demo →
                    </Link>
                    <Link
                      href={`/chat?prompt=${encodeURIComponent(demo.promptChat)}`}
                      className="w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[#64748B] text-sm text-center hover:bg-[#F8FAFC] transition-colors"
                    >
                      Ver en el chat →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* CTA Final */}
        <section className="gradient-bg rounded-3xl p-10 text-center space-y-5">
          <h2 className="text-3xl font-bold text-white">¿Quieres crear tu propia campaña?</h2>
          <p className="text-white/80">Describe lo que necesitas en lenguaje natural. La IA configura todo.</p>
          <Link href="/chat" className="inline-flex items-center gap-2 bg-white text-[#5B5CF6] font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg">
            Abrir el asistente de IA <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  )
}
