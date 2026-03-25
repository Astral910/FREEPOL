import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// En desarrollo usar onboarding@resend.dev hasta verificar el dominio
const FROM_PREMIOS = process.env.NODE_ENV === 'production' ? 'premios@freepol.app' : 'onboarding@resend.dev'
const FROM_HOLA = process.env.NODE_ENV === 'production' ? 'hola@freepol.app' : 'onboarding@resend.dev'

function templateBase(contenido: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB;">
        <!-- Header gradiente -->
        <tr>
          <td style="background:linear-gradient(135deg,#E8344E,#F2839A);padding:28px 40px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">
              <span style="color:#FFFFFF;">FREE</span>POL
            </p>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">
              Plataforma de fidelización con IA
            </p>
          </td>
        </tr>
        <!-- Contenido -->
        <tr><td style="padding:36px 40px;">${contenido}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F8FAFC;padding:20px 40px;border-top:1px solid #E5E7EB;">
            <p style="margin:0;font-size:12px;color:#94A3B8;text-align:center;">
              Powered by FREEPOL · <a href="https://freepol.app" style="color:#E8344E;text-decoration:none;">freepol.app</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/**
 * Envía el correo de premio ganado con el código único al participante.
 * Si Resend falla, hace console.error y devuelve false para no interrumpir el flujo principal.
 */
export async function enviarCodigoPremio({
  correo,
  nombre_negocio,
  nombre_campana,
  premio,
  codigo,
  expira_en,
}: {
  correo: string
  nombre_negocio: string
  nombre_campana: string
  premio: string
  codigo: string
  expira_en: string
}): Promise<boolean> {
  const fechaExpira = new Date(expira_en).toLocaleDateString('es-GT', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const html = templateBase(`
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0F172A;">
      🎉 ¡Ganaste un premio!
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;">
      Tu participación en <strong>${nombre_campana}</strong> de <strong>${nombre_negocio}</strong> fue exitosa.
    </p>
    <div style="background:#F8FAFC;border:2px dashed #E5E7EB;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#64748B;text-transform:uppercase;letter-spacing:1px;">Tu premio</p>
      <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#E8344E;">${premio}</p>
      <p style="margin:0 0 4px;font-size:12px;color:#94A3B8;">Código único</p>
      <p style="margin:0;font-size:28px;font-weight:900;color:#0F172A;font-family:'Courier New',monospace;letter-spacing:2px;">${codigo}</p>
    </div>
    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:14px 18px;margin:0 0 24px;">
      <p style="margin:0;font-size:13px;color:#C2410C;">
        ⏰ <strong>Válido hasta:</strong> ${fechaExpira}
      </p>
    </div>
    <p style="margin:0;font-size:14px;color:#64748B;">
      Muestra este correo o el código en caja para hacer válido tu premio. 🏪
    </p>
  `)

  try {
    const { error } = await resend.emails.send({
      from: FROM_PREMIOS,
      to: correo,
      subject: `🎉 Tu premio en ${nombre_campana} — ${codigo}`,
      html,
    })
    if (error) {
      console.error('[email] Error Resend enviarCodigoPremio:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('[email] Excepción enviarCodigoPremio:', err)
    return false
  }
}

/**
 * Envía correo de bienvenida al registrarse en una campaña.
 * Si Resend falla, devuelve false sin interrumpir el flujo.
 */
export async function enviarBienvenida({
  correo,
  nombre_negocio,
  nombre_campana,
  url_campana,
}: {
  correo: string
  nombre_negocio: string
  nombre_campana: string
  url_campana: string
}): Promise<boolean> {
  const urlCompleta = url_campana.startsWith('http')
    ? url_campana
    : `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://freepol.app'}${url_campana}`

  const html = templateBase(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0F172A;">
      ¡Bienvenido a ${nombre_campana}! 🎊
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;">
      <strong>${nombre_negocio}</strong> te invita a participar en su campaña de fidelización.
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#374151;">
      Participa ahora y gana premios exclusivos. La campaña tiene tiempo limitado.
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="${urlCompleta}"
        style="display:inline-block;background:linear-gradient(135deg,#E8344E,#F2839A);color:#FFFFFF;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">
        Participar ahora →
      </a>
    </div>
    <p style="margin:0;font-size:12px;color:#94A3B8;text-align:center;">
      Si no te registraste en esta campaña, ignora este correo.
    </p>
  `)

  try {
    const { error } = await resend.emails.send({
      from: FROM_HOLA,
      to: correo,
      subject: `Bienvenido a ${nombre_campana} de ${nombre_negocio}`,
      html,
    })
    if (error) {
      console.error('[email] Error Resend enviarBienvenida:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('[email] Excepción enviarBienvenida:', err)
    return false
  }
}
