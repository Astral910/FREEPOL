'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed, ShoppingBag, Fuel, Globe, CheckCircle } from 'lucide-react'
import { GradientBadge } from '@/components/ui/GradientBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation'

const prompts = [
  {
    id: 'restaurante',
    label: 'Restaurante',
    icon: UtensilsCrossed,
    prompt: `Quiero una ruleta para mi restaurante este mes de junio.
Los clientes validan su correo y pueden girar una vez al día.
Premios: 10% descuento (50%), postre gratis (35%),
combo completo gratis (15%).
Vigente del 1 al 30 de junio.`,
    nota: '✓ La IA puede hacer esto exactamente',
  },
  {
    id: 'retail',
    label: 'Retail',
    icon: ShoppingBag,
    prompt: `Crea un sistema donde mis clientes suban su factura
de compra por WhatsApp. Por cada $25 de compra les doy
1 punto. Cuando lleguen a 40 puntos quiero darles $10
de descuento en su próxima compra en tienda.`,
    nota: '✓ La IA puede hacer esto exactamente',
  },
  {
    id: 'gasolinera',
    label: 'Gasolinera',
    icon: Fuel,
    prompt: `Quiero una alianza con el supermercado de la zona.
Los clientes que compren más de $30 en el super reciben
puntos canjeables en combustible. Necesito que funcione
por Telegram y que sea los martes y jueves de 8am a 6pm.`,
    nota: '✓ La IA puede hacer esto exactamente',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: Globe,
    prompt: `Lanza una promo de cupones flash para mi tienda online.
Los clientes ingresan su correo y reciben un código único
de 20% de descuento. Máximo 1000 cupones. Quiero un botón
que los lleve directo a mi tienda Shopify.`,
    nota: '✓ Deep linking incluido automáticamente',
  },
]

/**
 * Sección de panel de IA con guía de prompts.
 * Muestra ejemplos reales de prompts en formato terminal.
 */
const IAPanel = memo(function IAPanel() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="prompts" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
        >
          {/* Columna izquierda — sticky */}
          <div className="lg:sticky lg:top-28">
            <GradientBadge variant="purple" className="mb-4">
              Guía de prompts
            </GradientBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mt-4 mb-4 leading-tight">
              Escríbelo como se te ocurra.{' '}
              <span className="gradient-text">La IA lo entiende.</span>
            </h2>
            <p className="text-[#64748B] text-lg leading-relaxed mb-8">
              No necesitas saber programar ni usar términos técnicos. FREEPOL fue
              entrenada para entender cómo hablan los empresarios.
            </p>
            <Button
              variant="outline"
              className="border-[#5B5CF6] text-[#5B5CF6] hover:bg-[#F0F0FF] rounded-lg"
            >
              Acceder a la guía completa →
            </Button>
          </div>

          {/* Columna derecha — tabs con prompts */}
          <div>
            <Tabs defaultValue="restaurante" className="w-full">
              <TabsList className="w-full mb-6 grid grid-cols-4 h-auto p-1">
                {prompts.map((p) => {
                  const Icon = p.icon
                  return (
                    <TabsTrigger
                      key={p.id}
                      value={p.id}
                      className="flex flex-col items-center gap-1 py-2 text-xs"
                    >
                      <Icon size={14} />
                      <span className="hidden sm:inline">{p.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {prompts.map((p) => (
                <TabsContent key={p.id} value={p.id}>
                  <div className="rounded-xl overflow-hidden border border-[#1E293B] shadow-lg">
                    {/* Barra de terminal */}
                    <div className="bg-[#1E293B] px-4 py-2 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                      <span className="ml-2 text-xs text-[#475569] font-mono">
                        prompt.txt
                      </span>
                    </div>
                    {/* Contenido del prompt */}
                    <div className="bg-[#0F172A] p-5">
                      <pre className="text-[#22C55E] text-sm font-mono leading-relaxed whitespace-pre-wrap">
                        {p.prompt}
                      </pre>
                    </div>
                  </div>

                  {/* Badge de confirmación */}
                  <div className="mt-4 flex items-center gap-2 bg-[#F0FDF4] border border-[#86EFAC] rounded-lg px-4 py-3">
                    <CheckCircle size={16} className="text-[#22C55E] flex-shrink-0" />
                    <span className="text-sm text-[#22C55E] font-medium">{p.nota}</span>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </motion.div>
      </div>
    </section>
  )
})

export default IAPanel
