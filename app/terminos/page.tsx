import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos de Servicio — FREEPOL',
  description: 'Términos y condiciones de uso de la plataforma FREEPOL.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            <span className="text-[#5B5CF6]">FREE</span><span className="text-[#0F172A]">POL</span>
          </Link>
          <Link href="/" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Términos de Servicio</h1>
        <p className="text-[#64748B] text-sm mb-10">Última actualización: Marzo 2026</p>

        <Section titulo="1. Aceptación de los Términos">
          Al acceder y utilizar la plataforma FREEPOL, aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguno de estos términos, no debes usar el servicio. El uso continuado de FREEPOL constituye la aceptación de cualquier modificación a estos términos.
        </Section>

        <Section titulo="2. Descripción del Servicio">
          FREEPOL es una plataforma SaaS (Software como Servicio) que permite a empresas crear y gestionar campañas de fidelización de clientes mediante inteligencia artificial. Las funcionalidades incluyen:
          <ul className="mt-3 space-y-1 text-[#374151]">
            <li>Creación de campañas de ruleta, puntos, cupones y validación de facturas.</li>
            <li>Despliegue automático en canales como WhatsApp, Telegram e Instagram.</li>
            <li>Generación de códigos únicos y códigos QR para premios.</li>
            <li>Dashboard de métricas en tiempo real.</li>
            <li>Herramientas de colaboración entre empresas aliadas.</li>
          </ul>
        </Section>

        <Section titulo="3. Uso Aceptable">
          Las empresas pueden usar FREEPOL para:
          <ul className="mt-3 space-y-1 text-[#374151]">
            <li>Crear campañas de fidelización legítimas para sus clientes.</li>
            <li>Recopilar datos de participantes con su consentimiento.</li>
            <li>Analizar el desempeño de sus campañas.</li>
          </ul>
          <p className="mt-4">Usos <strong>prohibidos</strong>:</p>
          <ul className="mt-2 space-y-1 text-[#374151]">
            <li>Envío de spam o comunicaciones no solicitadas.</li>
            <li>Fraude, engaño o representación falsa hacia los participantes.</li>
            <li>Uso de la plataforma para actividades ilegales.</li>
            <li>Intentar acceder a cuentas o datos de otras empresas.</li>
            <li>Sobrecargar o atacar la infraestructura de FREEPOL.</li>
          </ul>
        </Section>

        <Section titulo="4. Datos y Privacidad">
          Los datos de participantes (correo electrónico, teléfono) recopilados a través de las campañas son propiedad de la empresa que crea la campaña. FREEPOL actúa como procesador de datos y no vende ni comparte esta información con terceros. Consulta nuestra{' '}
          <Link href="/privacidad" className="text-[#5B5CF6] hover:underline">Política de Privacidad</Link>{' '}
          para más detalles.
        </Section>

        <Section titulo="5. Planes y Pagos">
          FREEPOL ofrece cuatro planes: Free, Starter ($19/mes), Pro ($49/mes) y Enterprise ($149/mes). Los precios están sujetos a cambio con 30 días de aviso previo. Los pagos son procesados de forma segura. En caso de downgrade, los límites del nuevo plan aplican al siguiente ciclo de facturación.
        </Section>

        <Section titulo="6. Disponibilidad del Servicio">
          FREEPOL aspira a una disponibilidad del 99.9% en el plan Enterprise. En planes inferiores, el servicio se brinda &quot;tal cual está&quot; sin garantías de tiempo de actividad. Podemos realizar mantenimientos programados con aviso previo de 24 horas.
        </Section>

        <Section titulo="7. Limitación de Responsabilidad">
          FREEPOL no es responsable de: pérdidas económicas derivadas del uso del servicio, errores en el OCR de facturas, fallos en la entrega de notificaciones por correo, o interrupciones de servicio de terceros (Supabase, Telegram, WhatsApp). La responsabilidad máxima de FREEPOL se limita al monto pagado en el último mes de servicio.
        </Section>

        <Section titulo="8. Propiedad Intelectual">
          FREEPOL y todos sus componentes (logotipo, código, diseño, prompts de IA) son propiedad de FREEPOL. Las campañas creadas por los usuarios y los datos de sus participantes pertenecen a cada empresa usuaria.
        </Section>

        <Section titulo="9. Cancelación y Terminación">
          Puedes cancelar tu cuenta en cualquier momento desde la configuración del dashboard. Al cancelar, los datos se conservan 30 días antes de ser eliminados definitivamente. FREEPOL puede terminar cuentas que violen estos términos sin previo aviso.
        </Section>

        <Section titulo="10. Modificaciones">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entran en vigor 30 días después de su publicación. El uso continuado del servicio tras ese período implica la aceptación de los nuevos términos.
        </Section>

        <Section titulo="11. Contacto">
          Para consultas legales o dudas sobre estos términos, escríbenos a:{' '}
          <a href="mailto:legal@freepol.app" className="text-[#5B5CF6] hover:underline">legal@freepol.app</a>
        </Section>

        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex gap-6 text-sm">
          <Link href="/privacidad" className="text-[#5B5CF6] hover:underline">Política de Privacidad</Link>
          <Link href="/precios" className="text-[#64748B] hover:text-[#0F172A]">Precios</Link>
          <Link href="/" className="text-[#64748B] hover:text-[#0F172A]">Inicio</Link>
        </div>
      </main>
    </div>
  )
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-[#0F172A] mb-3">{titulo}</h2>
      <div className="text-[#374151] leading-relaxed text-[15px]">{children}</div>
    </section>
  )
}
