import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad — FREEPOL',
  description: 'Cómo FREEPOL recopila, usa y protege los datos de las empresas y sus participantes.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            <span className="text-[#E8344E]">FREE</span><span className="text-[#0F172A]">POL</span>
          </Link>
          <Link href="/" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Política de Privacidad</h1>
        <p className="text-[#64748B] text-sm mb-10">Última actualización: Marzo 2026</p>

        <Section titulo="1. ¿Qué datos recopilamos?">
          <p>FREEPOL recopila distintos tipos de datos según el rol del usuario:</p>
          <p className="mt-3 font-semibold text-[#0F172A]">Datos de la empresa:</p>
          <ul className="mt-1 space-y-1">
            <li>Nombre de la empresa y nombre completo del administrador.</li>
            <li>Correo electrónico corporativo.</li>
            <li>Sitio web e industria (opcional).</li>
            <li>Colores de marca personalizados.</li>
          </ul>
          <p className="mt-3 font-semibold text-[#0F172A]">Datos de participantes de campaña:</p>
          <ul className="mt-1 space-y-1">
            <li>Correo electrónico o número de teléfono (según la condición de la campaña).</li>
            <li>ID de usuario de Telegram (si la campaña es por Telegram).</li>
            <li>Dirección IP (para prevención de fraude).</li>
            <li>Fecha y hora de participación.</li>
          </ul>
          <p className="mt-3 font-semibold text-[#0F172A]">Datos de uso:</p>
          <ul className="mt-1 space-y-1">
            <li>Campañas creadas y su configuración.</li>
            <li>Métricas de participación y canje.</li>
            <li>Historial de prompts enviados al asistente de IA.</li>
          </ul>
        </Section>

        <Section titulo="2. ¿Cómo usamos los datos?">
          <p>Los datos recopilados se utilizan exclusivamente para:</p>
          <ul className="mt-3 space-y-1">
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
            Los datos de participantes son propiedad de la empresa que los recopiló a través de su campaña.
            FREEPOL actúa únicamente como procesador de datos.
          </p>
          <p className="mt-3">
            <strong>FREEPOL no vende datos a terceros.</strong> Sin embargo, podemos compartir datos con:
          </p>
          <ul className="mt-2 space-y-1">
            <li><strong>Supabase</strong> — proveedor de base de datos y autenticación.</li>
            <li><strong>Upstash</strong> — caché Redis para prevención de fraude.</li>
            <li><strong>Resend</strong> — proveedor de envío de correos transaccionales.</li>
            <li><strong>Groq</strong> — proveedor de IA para análisis de prompts (solo el texto del prompt, sin datos personales).</li>
          </ul>
        </Section>

        <Section titulo="4. Soberanía de Datos">
          Las empresas tienen control total sobre sus datos:
          <ul className="mt-3 space-y-1">
            <li>Exportar todos los participantes en formato CSV desde el dashboard.</li>
            <li>Eliminar campañas y sus datos asociados en cualquier momento.</li>
            <li>Solicitar la eliminación completa de la cuenta y todos sus datos.</li>
          </ul>
          <p className="mt-3">
            Para solicitar eliminación de datos, escribe a:{' '}
            <a href="mailto:privacidad@freepol.app" className="text-[#E8344E] hover:underline">privacidad@freepol.app</a>
          </p>
        </Section>

        <Section titulo="5. Cookies y Sesiones">
          FREEPOL utiliza cookies de sesión gestionadas por Supabase Auth para mantener a los usuarios autenticados. No usamos cookies de rastreo publicitario de terceros. Las cookies de sesión se eliminan al cerrar sesión o al expirar (7 días por defecto).
        </Section>

        <Section titulo="6. Seguridad de los Datos">
          Implementamos las siguientes medidas de seguridad:
          <ul className="mt-3 space-y-1">
            <li>Todos los datos están cifrados en tránsito (HTTPS/TLS).</li>
            <li>Los códigos de premio se validan con hash SHA-256.</li>
            <li>Row Level Security (RLS) en Supabase garantiza el aislamiento de datos entre empresas.</li>
            <li>Las contraseñas nunca se almacenan en texto plano (gestionado por Supabase Auth).</li>
            <li>Redis con expiración automática para claves de antifraude.</li>
          </ul>
        </Section>

        <Section titulo="7. Retención de Datos">
          <ul className="mt-2 space-y-1">
            <li>Datos de campañas activas: se conservan mientras la cuenta esté activa.</li>
            <li>Datos de campañas terminadas: se conservan 1 año para análisis histórico.</li>
            <li>Tras cancelación de cuenta: datos eliminados en 30 días.</li>
            <li>IPs en Redis (antifraude): expiración automática de 24 horas.</li>
          </ul>
        </Section>

        <Section titulo="8. Derechos del Usuario">
          Conforme a las leyes de protección de datos aplicables, tienes derecho a:
          <ul className="mt-3 space-y-1">
            <li><strong>Acceso</strong> — solicitar una copia de tus datos.</li>
            <li><strong>Rectificación</strong> — corregir datos incorrectos.</li>
            <li><strong>Eliminación</strong> — solicitar que borremos tus datos.</li>
            <li><strong>Portabilidad</strong> — exportar tus datos en formato legible.</li>
            <li><strong>Oposición</strong> — oponerte a ciertos usos de tus datos.</li>
          </ul>
        </Section>

        <Section titulo="9. Menores de Edad">
          FREEPOL no está dirigido a menores de 18 años. No recopilamos intencionalmente datos de menores. Si identificamos que un menor ha proporcionado datos, los eliminamos de inmediato.
        </Section>

        <Section titulo="10. Cambios a esta Política" id="cookies">
          Esta política puede actualizarse periódicamente. Notificaremos cambios significativos por correo electrónico con 15 días de anticipación. El uso continuado del servicio tras esa fecha implica la aceptación de los cambios.
        </Section>

        <Section titulo="11. Contacto">
          Para ejercer tus derechos o resolver dudas sobre privacidad:{' '}
          <a href="mailto:privacidad@freepol.app" className="text-[#E8344E] hover:underline">privacidad@freepol.app</a>
        </Section>

        <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex gap-6 text-sm">
          <Link href="/terminos" className="text-[#E8344E] hover:underline">Términos de Servicio</Link>
          <Link href="/precios" className="text-[#64748B] hover:text-[#0F172A]">Precios</Link>
          <Link href="/" className="text-[#64748B] hover:text-[#0F172A]">Inicio</Link>
        </div>
      </main>
    </div>
  )
}

function Section({ titulo, children, id }: { titulo: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="mb-8" id={id}>
      <h2 className="text-lg font-bold text-[#0F172A] mb-3">{titulo}</h2>
      <div className="text-[#374151] leading-relaxed text-[15px] space-y-2">{children}</div>
    </section>
  )
}
