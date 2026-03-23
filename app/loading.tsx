import Image from 'next/image'

/**
 * Pantalla de carga global que aparece durante la navegación entre páginas.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center gap-6">
      {/* Logo animado */}
      <div className="animate-pulse">
        <Image src="/logo-dark.svg" alt="FREEPOL" width={160} height={40} priority />
      </div>
      {/* Barra de progreso infinita */}
      <div className="w-48 h-1 bg-[#1E293B] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #5B5CF6, #A855F7)',
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
