import { buttonVariants } from '@/components/atoms/Button'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { NavLink } from '@/components/molecules/NavLink'
import { cn } from '@/lib/cn'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-32 text-center">
      <span className="font-display text-6xl text-gold-500">404</span>
      <Heading level="h2">Page not found</Heading>
      <Text tone="muted">The page you’re looking for doesn’t exist or has moved.</Text>
      <NavLink to="/" className={cn(buttonVariants(), 'mt-2 !text-cream-50')}>
        Back to Home
      </NavLink>
    </div>
  )
}
