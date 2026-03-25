import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0F172A] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8344E] focus-visible:border-[#E8344E] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
