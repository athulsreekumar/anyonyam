import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      tone: {
        onLight: 'text-maroon-700 hover:bg-maroon-100',
        onDark: 'text-cream-50 hover:bg-cream-50/10',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
      },
    },
    defaultVariants: { tone: 'onLight', size: 'md' },
  },
)

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Required — an icon-only button must always name its action for assistive tech. */
  'aria-label': string
  children: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, tone, size, children, ...props }, ref) => {
    return (
      <button ref={ref} type="button" className={cn(iconButtonVariants({ tone, size }), className)} {...props}>
        {children}
      </button>
    )
  },
)
IconButton.displayName = 'IconButton'
