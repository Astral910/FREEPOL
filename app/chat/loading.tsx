import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton de carga específico del chat de IA.
 */
export default function ChatLoading() {
  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex w-72 bg-[#1A1B4B] border-r border-[#2D2F5E] flex-col p-4 gap-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-28 bg-[#2D2F5E]" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl bg-[#2D2F5E]" />
        <div className="space-y-2 mt-2">
          <Skeleton className="h-3 w-20 bg-[#2D2F5E]" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
              <Skeleton className="h-4 w-4 rounded bg-[#2D2F5E]" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-32 bg-[#2D2F5E]" />
                <Skeleton className="h-2 w-16 bg-[#2D2F5E]" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Área central — ícono pulsante */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center animate-pulse"
            style={{ background: 'linear-gradient(135deg, #E8344E, #F2839A)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            </svg>
          </div>
          <p className="text-[#64748B] text-sm animate-pulse">Cargando el asistente...</p>
        </div>
      </div>
    </div>
  )
}
