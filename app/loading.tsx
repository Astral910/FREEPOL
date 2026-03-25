import Image from 'next/image'

/**
 * Pantalla de carga global que aparece durante la navegación entre páginas.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
      {/* Logo animado */}
      <div className="animate-pulse">
        <Image src="/logo-dark.svg" alt="FREEPOL" width={160} height={40} priority />
      </div>
      {/* Barra de progreso infinita */}
      <div className="w-48 h-1 bg-[#1A1B4B] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #E8344E, #F2839A)',
            animation: 'slide-progress 1.5s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes slide-progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
