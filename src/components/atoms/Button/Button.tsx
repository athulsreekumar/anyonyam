import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Spinner } from '@/components/atoms/Spinner'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-body font-medium transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500',
  {
    variants: {
      intent: {
        primary: 'bg-maroon-700 text-cream-50 hover:bg-maroon-900',
        secondary: 'bg-cream-100 text-maroon-700 hover:bg-maroon-100',
        ghost: 'bg-transparent text-maroon-700 hover:bg-maroon-100',
        danger: 'bg-error text-cream-50 hover:bg-error/90',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-base',
        lg: 'h-13 px-7 text-lg',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ intent, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <span aria-hidden>
            <Spinner size="sm" />
          </span>
        )}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
