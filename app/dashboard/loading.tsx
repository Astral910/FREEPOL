import { Skeleton } from '@/components/ui/skeleton'

/**
 * Estado de carga del dashboard (tema claro).
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="h-16 bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between">
        <Skeleton className="h-6 w-28 bg-[#F1F5F9]" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-24 bg-[#F1F5F9]" />
          <Skeleton className="h-4 w-24 bg-[#F1F5F9]" />
          <Skeleton className="h-8 w-8 rounded-full bg-[#F1F5F9]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header de bienvenida */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-[#F1F5F9]" />
          <Skeleton className="h-4 w-40 bg-[#F1F5F9]" />
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 shadow-sm">
              <Skeleton className="h-3 w-24 bg-[#F1F5F9]" />
              <Skeleton className="h-8 w-16 bg-[#F1F5F9]" />
              <Skeleton className="h-3 w-28 bg-[#F1F5F9]" />
            </div>
          ))}
        </div>

        {/* Lista de campañas placeholder */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4 shadow-sm">
          <Skeleton className="h-5 w-40 bg-[#F1F5F9]" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl bg-[#F1F5F9]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
