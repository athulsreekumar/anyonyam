import { Compass, Sparkles } from 'lucide-react'
import { Card } from '@/components/molecules/Card'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { mission, vision } from '@/content/site'
import { cn } from '@/lib/cn'

function RevealCard({ icon: Icon, title, body }: { icon: typeof Compass; title: string; body: string }) {
  const [ref, visible] = useScrollReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      )}
    >
      <Card surface="tinted" padding="lg" className="h-full">
        <Icon aria-hidden className="h-8 w-8 text-gold-500" />
        <Heading level="h3" className="mt-4">
          {title}
        </Heading>
        <Text tone="muted" className="mt-3">
          {body}
        </Text>
      </Card>
    </div>
  )
}

export function VisionMissionSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <RevealCard icon={Compass} title="Vision" body={vision} />
        <RevealCard icon={Sparkles} title="Mission" body={mission} />
      </div>
    </section>
  )
}
