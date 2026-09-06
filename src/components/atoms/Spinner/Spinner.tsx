import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const spinnerVariants = cva('animate-spin rounded-full border-current border-t-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-2',
      lg: 'h-10 w-10 border-[3px]',
    },
  },
  defaultVariants: { size: 'md' },
})

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  label?: string
}

export function Spinner({ size, className, label = 'Loading' }: SpinnerProps) {
  return (
    <output className={cn(spinnerVariants({ size }), className)}>
      <span className="sr-only">{label}</span>
    </output>
  )
}
