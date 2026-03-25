'use client'

import { UtensilsCrossed, ShoppingBag, Fuel, Globe, Smartphone, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

interface TipsPanelProps {
  open: boolean
  onClose: () => void
  onUsarEjemplo: (prompt: string) => void
}

const ejemplos = [
  {
    id: 'restaurante',
    label: 'Restaurantes',
    icon: UtensilsCrossed,
    titulo: 'Para restaurantes y cafeterías',
    prompt: `Quiero una ruleta para mi restaurante La Italiana este mes de junio. Los clientes validan su correo y pueden girar una vez. Premios: pizza personal gratis (20%), 30% de descuento (50%), bebida gratis (30%). Del 1 al 30 de junio en WhatsApp.`,
    tips: [
      'Especifica el mes o fechas exactas',
      'Menciona si es solo en horario de negocio',
      'Puedes pedir que el código expire en X horas',
    ],
  },
  {
    id: 'retail',
    label: 'Retail',
    icon: ShoppingBag,
    titulo: 'Para tiendas y retail',
    prompt: `Crea un sistema de puntos para mi tienda de ropa. Mis clientes suben su factura por WhatsApp. Por cada $25 de compra = 1 punto. Con 30 puntos les doy $15 de descuento. Sin límite de participaciones.`,
    tips: [
      'Define el monto mínimo de compra',
      'Especifica cuántos puntos equivalen al premio',
      'Indica si los puntos expiran',
    ],
  },
  {
    id: 'gasolinera',
    label: 'Gasolineras',
    icon: Fuel,
    titulo: 'Para gasolineras y combustible',
    prompt: `Alianza con el supermercado local. Facturas de más de $30 del super = puntos para combustible. 1 punto por cada $10 de compra. 50 puntos = $5 descuento en gasolina. Solo martes y jueves de 7am a 7pm por Telegram.`,
    tips: [
      'Especifica los días y horarios de la alianza',
      'Define el monto de conversión de puntos',
      'Menciona el canal principal (Telegram recomendado)',
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: Globe,
    titulo: 'Para tiendas en línea',
    prompt: `Cupones flash para mi tienda online. Los clientes ingresan su correo en Instagram y reciben un código único de 25% de descuento. Máximo 500 cupones. El botón los lleva directo a mi tienda en línea para aplicar el descuento.`,
    tips: [
      'Indica el límite de cupones disponibles',
      'Especifica el porcentaje o monto fijo del descuento',
      'Agrega la URL de tu tienda para el deep link',
    ],
  },
  {
    id: 'apps',
    label: 'Apps móviles',
    icon: Smartphone,
    titulo: 'Para aplicaciones móviles',
    prompt: `Campaña para aumentar usuarios de mi app. Landing page donde el cliente pone su nombre, recibe un código de descuento único y un botón gigante que los lleva directo a descargar mi app. Detener cuando lleguemos a 2000 registros.`,
    tips: [
      'Incluye el link de descarga de tu app',
      'Define el límite de participantes',
      'Especifica qué datos recopilar del usuario',
    ],
  },
]

/**
 * Panel lateral deslizante con guía de prompts por industria.
 * Permite copiar ejemplos directamente al textarea del chat.
 */
export default function TipsPanel({ open, onClose, onUsarEjemplo }: TipsPanelProps) {
  const [copiado, setCopiado] = useState<string | null>(null)

  const handleUsarEjemplo = (id: string, prompt: string) => {
    onUsarEjemplo(prompt)
    setCopiado(id)
    setTimeout(() => setCopiado(null), 2000)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-0 bg-white border-l border-[#E5E7EB] overflow-hidden flex flex-col"
      >
        {/* Header con gradiente */}
        <div className="gradient-bg p-6 flex-shrink-0">
          <SheetHeader>
            <SheetTitle className="text-white font-bold text-xl">Guía de Prompts</SheetTitle>
            <SheetDescription className="text-white/70 text-sm">
              Ejemplos listos por industria — haz clic para usarlos
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="restaurante" className="w-full">
            <div className="px-4 pt-4 sticky top-0 bg-white z-10 pb-2 border-b border-[#F1F5F9]">
              <TabsList className="w-full bg-[#F8FAFC] border border-[#E5E7EB] h-auto p-1 grid grid-cols-5 gap-1">
                {ejemplos.map((e) => {
                  const Icon = e.icon
                  return (
                    <TabsTrigger
                      key={e.id}
                      value={e.id}
                      className="flex flex-col items-center gap-1 py-2 px-1 text-[#64748B] data-[state=active]:bg-white data-[state=active]:text-[#E8344E] data-[state=active]:shadow-sm rounded-lg"
                    >
                      <Icon size={14} />
                      <span className="text-[10px] leading-tight text-center">{e.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {ejemplos.map((e) => (
              <TabsContent key={e.id} value={e.id} className="p-4 mt-0 space-y-4">
                <p className="text-[#0F172A] text-sm font-medium">{e.titulo}</p>

                {/* Prompt estilo terminal */}
                <div className="rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm">
                  <div className="bg-[#F8FAFC] px-3 py-2 flex items-center gap-2 border-b border-[#E5E7EB]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                    </div>
                    <span className="text-[#64748B] text-xs font-mono ml-1">prompt.txt</span>
                  </div>
                  <div className="bg-white p-4">
                    <pre className="text-[#15803D] text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                      {e.prompt}
                    </pre>
                  </div>
                </div>

                {/* Badge de validación */}
                <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-3 py-2">
                  <Check size={14} className="text-[#15803D] flex-shrink-0" />
                  <span className="text-[#15803D] text-xs font-medium">
                    FREEPOL puede hacer esto exactamente
                  </span>
                </div>

                {/* Botón usar ejemplo */}
                <Button
                  onClick={() => handleUsarEjemplo(e.id, e.prompt)}
                  className="w-full gradient-bg text-white rounded-lg flex items-center gap-2 hover:opacity-90"
                >
                  {copiado === e.id ? (
                    <>
                      <Check size={15} />
                      ¡Copiado al chat!
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Usar este ejemplo
                    </>
                  )}
                </Button>

                {/* Tips adicionales */}
                <div className="space-y-2">
                  <p className="text-[#64748B] text-xs uppercase tracking-widest font-medium">
                    Tips para mejores resultados
                  </p>
                  {e.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#E8344E] text-xs mt-0.5 flex-shrink-0">→</span>
                      <span className="text-[#64748B] text-xs leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Card de secreto del buen prompt */}
          <div className="mx-4 mb-6 bg-[#FFF0F2] border border-[#F9B8C4] rounded-xl p-4">
            <p className="text-[#E8344E] font-semibold text-sm mb-3">
              💡 El secreto de un buen prompt
            </p>
            <ul className="space-y-2">
              {[
                'Menciona el nombre de tu negocio',
                'Di qué tipo de premio quieres dar',
                'Especifica las fechas de vigencia',
                'Indica el canal preferido (WhatsApp, Telegram, etc)',
                'Entre más detalle, mejor resultado de la IA',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#E8344E] font-bold text-xs mt-0.5 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-[#64748B] text-xs leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
