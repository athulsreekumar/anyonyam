import { cn } from '@/lib/cn'
import { org } from '@/content/site'

const SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
} as const

export interface LogoProps {
  size?: keyof typeof SIZE_CLASSES
  className?: string
  /** Show the Malayalam/English wordmark next to the mark. */
  withWordmark?: boolean
}

export function Logo({ size = 'md', className, withWordmark = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <img src="/logo.png" alt={`${org.name} logo`} className={cn('rounded-full object-cover', SIZE_CLASSES[size])} />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-medium text-maroon-900">{org.malayalamName}</span>
          <span className="font-body text-xs tracking-wide text-charcoal-600 uppercase">{org.name}</span>
        </span>
      )}
    </span>
  )
}
