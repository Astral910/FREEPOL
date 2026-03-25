'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import MarketingChrome from '@/components/marketing/MarketingChrome'
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader'

function Section({ titulo, children, id }: { titulo: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="mb-10" id={id}>
      <h2 className="mb-3 text-xl font-black text-[#0A0A0A]">{titulo}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[#374151]">{children}</div>
    </section>
  )
}

export default function PrivacidadPageClient() {
  return (
    <MarketingChrome>
      <div className="min-h-screen bg-[#FFF5F6]">
        <MarketingSubpageHeader subtitle="Legal" />
        <section className="bg-[#0A0A0A] px-4 py-14 text-center md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black uppercase text-white md:text-6xl"
          >
            Privacidad
          </motion.h1>
          <p className="mt-4 text-[#94A3B8]">Última actualización: Marzo 2026</p>
        </section>
        <main className="mx-auto max-w-3xl px-4 py-14 md:px-8">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm md:p-10">
            <Section titulo="1. ¿Qué datos recopilamos?">
              <p>FREEPOL recopila distintos tipos de datos según el rol del usuario:</p>
              <p className="mt-3 font-bold text-[#0F172A]">Datos de la empresa:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>Nombre de la empresa y nombre completo del administrador.</li>
                <li>Correo electrónico corporativo.</li>
                <li>Sitio web e industria (opcional).</li>
                <li>Colores de marca personalizados.</li>
              </ul>
              <p className="mt-3 font-bold text-[#0F172A]">Datos de participantes de campaña:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>Correo electrónico o número de teléfono (según la condición de la campaña).</li>
                <li>ID de usuario de Telegram (si la campaña es por Telegram).</li>
                <li>Dirección IP (para prevención de fraude).</li>
                <li>Fecha y hora de participación.</li>
              </ul>
              <p className="mt-3 font-bold text-[#0F172A]">Datos de uso:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>Campañas creadas y su configuración.</li>
                <li>Métricas de participación y canje.</li>
                <li>Historial de prompts enviados al asistente de IA.</li>
              </ul>
            </Section>
            <Section titulo="2. ¿Cómo usamos los datos?">
              <p>Los datos recopilados se utilizan exclusivamente para:</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Operar el servicio FREEPOL y sus funcionalidades.</li>
                <li>Enviar notificaciones de premios ganados a los participantes.</li>
                <li>Generar métricas y estadísticas en el dashboard de la empresa.</li>
                <li>Prevenir fraude y abusos en las campañas.</li>
                <li>Mejorar la precisión del asistente de IA.</li>
                <li>Comunicar actualizaciones importantes del servicio.</li>
              </ul>
            </Section>
            <Section titulo="3. ¿Compartimos tus datos?">
              <p>
                Los datos de participantes son propiedad de la empresa que los recopiló a través de su
                campaña. FREEPOL actúa únicamente como procesador de datos.
              </p>
              <p className="mt-3">
                <strong>FREEPOL no vende datos a terceros.</strong> Sin embargo, podemos compartir datos con:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><strong>Supabase</strong> — proveedor de base de datos y autenticación.</li>
                <li><strong>Upstash</strong> — caché Redis para prevención de fraude.</li>
                <li><strong>Resend</strong> — proveedor de envío de correos transaccionales.</li>
                <li>
                  <strong>Anthropic</strong> — proveedor de IA para análisis de prompts (solo el texto del
                  prompt, sin datos personales).
                </li>
              </ul>
            </Section>
            <Section titulo="4. Soberanía de datos">
              <ul className="list-disc space-y-1 pl-5">
                <li>Exportar todos los participantes en formato CSV desde el dashboard.</li>
                <li>Eliminar campañas y sus datos asociados en cualquier momento.</li>
                <li>Solicitar la eliminación completa de la cuenta y todos sus datos.</li>
              </ul>
              <p className="mt-3">
                Para solicitar eliminación de datos, escribe a:{' '}
                <a href="mailto:privacidad@freepol.app" className="font-bold text-[#E8344E] hover:underline">
                  privacidad@freepol.app
                </a>
              </p>
            </Section>
            <Section titulo="5. Cookies y sesiones" id="cookies">
              FREEPOL utiliza cookies de sesión gestionadas por Supabase Auth para mantener a los usuarios
              autenticados. No usamos cookies de rastreo publicitario de terceros.
            </Section>
            <Section titulo="6. Seguridad de los datos">
              <ul className="list-disc space-y-1 pl-5">
                <li>Cifrado en tránsito (HTTPS/TLS).</li>
                <li>Validación de códigos con hash SHA-256.</li>
                <li>Row Level Security (RLS) en Supabase entre empresas.</li>
                <li>Contraseñas nunca en texto plano (Supabase Auth).</li>
                <li>Redis con expiración automática para claves de antifraude.</li>
              </ul>
            </Section>
            <Section titulo="7. Retención de datos">
              <ul className="list-disc space-y-1 pl-5">
                <li>Campañas activas: mientras la cuenta esté activa.</li>
                <li>Campañas terminadas: hasta 1 año para análisis histórico.</li>
                <li>Tras cancelación de cuenta: eliminación en 30 días.</li>
                <li>IPs en Redis (antifraude): expiración automática 24 horas.</li>
              </ul>
            </Section>
            <Section titulo="8. Derechos del usuario">
              <p>Derechos según leyes aplicables:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><strong>Acceso</strong> — copia de tus datos.</li>
                <li><strong>Rectificación</strong> — corregir datos incorrectos.</li>
                <li><strong>Eliminación</strong> — borrar tus datos.</li>
                <li><strong>Portabilidad</strong> — exportar en formato legible.</li>
                <li><strong>Oposición</strong> — oponerte a ciertos usos.</li>
              </ul>
            </Section>
            <Section titulo="9. Menores de edad">
              FREEPOL no está dirigido a menores de 18 años. Si identificamos datos de un menor, los
              eliminamos de inmediato.
            </Section>
            <Section titulo="10. Cambios a esta política">
              Podemos actualizar esta política; los cambios relevantes se comunicarán con antelación razonable.
              El uso continuado implica aceptación.
            </Section>
            <Section titulo="11. Contacto">
              <a href="mailto:privacidad@freepol.app" className="font-bold text-[#E8344E] hover:underline">
                privacidad@freepol.app
              </a>
            </Section>

            <div className="mt-12 flex flex-wrap gap-6 border-t border-[#E5E7EB] pt-8 text-sm">
              <Link href="/terminos" className="font-bold text-[#E8344E] hover:underline">
                Términos
              </Link>
              <Link href="/precios" className="text-[#64748B] hover:text-[#0F172A]">
                Precios
              </Link>
              <Link href="/" className="text-[#64748B] hover:text-[#0F172A]">
                Inicio
              </Link>
            </div>
          </div>
        </main>
      </div>
    </MarketingChrome>
  )
}
