import { cn } from '@/lib/utils'

interface GradientBadgeProps {
  children: React.ReactNode
  variant?: 'purple' | 'green' | 'blue'
  className?: string
}

const variantStyles = {
  purple: 'bg-[#F0F0FF] border-[#F9B8C4] text-[#E8344E]',
  green: 'bg-[#F0FDF4] border-[#86EFAC] text-[#22C55E]',
  blue: 'bg-[#EFF6FF] border-[#93C5FD] text-[#3B82F6]',
}

/**
 * Badge reutilizable de sección con variantes de color.
 * Usado para etiquetar cada sección de la página de inicio.
 */
export function GradientBadge({
  children,
  variant = 'purple',
  className,
}: GradientBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
