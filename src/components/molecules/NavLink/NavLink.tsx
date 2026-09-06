import { NavLink as RouterNavLink } from 'react-router-dom'
import type { NavLinkProps as RouterNavLinkProps } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const navLinkVariants = cva(
  'font-body text-sm font-medium tracking-wide transition-colors duration-150 ease-out',
  {
    variants: {
      tone: {
        onLight: 'text-charcoal-900 hover:text-maroon-700 aria-[current=page]:text-maroon-700',
        onDark: 'text-cream-50/85 hover:text-cream-50 aria-[current=page]:text-cream-50',
      },
    },
    defaultVariants: { tone: 'onLight' },
  },
)

export interface NavLinkProps extends Omit<RouterNavLinkProps, 'className'>, VariantProps<typeof navLinkVariants> {
  className?: string
}

export function NavLink({ tone, className, ...props }: NavLinkProps) {
  return <RouterNavLink className={cn(navLinkVariants({ tone }), className)} {...props} />
}
