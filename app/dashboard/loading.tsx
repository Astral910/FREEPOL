import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton de carga específico del dashboard.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navbar skeleton */}
      <div className="h-16 bg-[#0A0A0A] border-b border-[#1A1B4B] px-8 flex items-center justify-between">
        <Skeleton className="h-6 w-28 bg-[#1A1B4B]" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24 bg-[#1A1B4B]" />
          <Skeleton className="h-4 w-24 bg-[#1A1B4B]" />
          <Skeleton className="h-8 w-8 rounded-full bg-[#1A1B4B]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-[#1A1B4B]" />
          <Skeleton className="h-4 w-40 bg-[#1A1B4B]" />
        </div>

        {/* Métricas skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#1A1B4B] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 bg-[#2D2F5E]" />
                <Skeleton className="h-8 w-8 rounded-xl bg-[#2D2F5E]" />
              </div>
              <Skeleton className="h-8 w-20 bg-[#2D2F5E]" />
              <Skeleton className="h-3 w-32 bg-[#2D2F5E]" />
            </div>
          ))}
        </div>

        {/* Tabla skeleton */}
        <div className="bg-[#1A1B4B] rounded-2xl p-5 space-y-4">
          <Skeleton className="h-6 w-40 bg-[#2D2F5E]" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="h-4 w-48 bg-[#2D2F5E]" />
                <Skeleton className="h-6 w-20 rounded-full bg-[#2D2F5E]" />
                <Skeleton className="h-4 w-16 bg-[#2D2F5E]" />
                <Skeleton className="h-4 w-16 bg-[#2D2F5E]" />
                <Skeleton className="h-8 w-8 rounded-lg bg-[#2D2F5E] ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
