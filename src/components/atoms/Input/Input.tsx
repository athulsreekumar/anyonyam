import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-11 w-full rounded-md border border-charcoal-600/25 bg-cream-50 px-3.5 font-body text-charcoal-900 placeholder:text-charcoal-600/60',
          'transition-colors duration-150 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid && 'border-error focus-visible:outline-error',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
