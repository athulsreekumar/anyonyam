import { buttonVariants } from '@/components/atoms/Button'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { NavLink } from '@/components/molecules/NavLink'
import { org } from '@/content/site'
import { cn } from '@/lib/cn'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-maroon-900">
      <img
        src="/gallery/varshikam/varshikam-03.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon-900 via-maroon-900/70 to-maroon-900/30" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
        <span className="font-body text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
          Tripunithura · Since 1998
        </span>
        <Heading level="display" as="h1" className="max-w-3xl text-cream-50">
          {org.malayalamName}
        </Heading>
        <Text tone="onDark" size="lg" className="max-w-xl text-cream-50/85">
          {org.tagline}
        </Text>
        <div className="mt-4 flex flex-wrap gap-4">
          <NavLink to="/gallery" className={cn(buttonVariants({ size: 'lg' }), '!text-cream-50')}>
            Explore the Gallery
          </NavLink>
          <NavLink
            to="/about/history"
            className={cn(buttonVariants({ intent: 'secondary', size: 'lg' }), 'bg-cream-50/10 !text-cream-50 hover:bg-cream-50/20')}
          >
            Our Story
          </NavLink>
        </div>
      </div>
    </section>
  )
}
