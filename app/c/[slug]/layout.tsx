/**
 * Layout independiente para las landing pages públicas de campañas.
 * Sobreescribe el layout raíz para que las campañas no hereden
 * el navbar ni el footer de FREEPOL — se ven como páginas propias
 * de cada marca.
 */
export default function CampanaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
