import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#E8344E] text-white',
        secondary: 'border-transparent bg-[#F8FAFC] text-[#64748B]',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'text-[#0F172A] border-[#E5E7EB]',
        purple: 'border-[#F9B8C4] bg-[#F0F0FF] text-[#E8344E]',
        green: 'border-[#86EFAC] bg-[#F0FDF4] text-[#22C55E]',
        blue: 'border-[#93C5FD] bg-[#EFF6FF] text-[#3B82F6]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
