/**
 * Resuelve la URL pública base para links compartibles y QRs.
 * En el navegador usa el origen actual (localhost, preview de Vercel, producción).
 */
export function resolverUrlPublicaCliente(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '')
  }
  const desdeEnv =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
  return desdeEnv.replace(/\/$/, '')
}
