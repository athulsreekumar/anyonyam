import { Mail, MapPin, Phone } from 'lucide-react'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { Card } from '@/components/molecules/Card'
import { Text } from '@/components/atoms/Text'
import { contact } from '@/content/site'

export function ContactPanel() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Get in touch" title="Visit or Reach Out" />

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Card surface="outlined">
          <MapPin aria-hidden className="h-6 w-6 text-gold-500" />
          <Text className="mt-3 font-medium">Address</Text>
          <Text tone="muted" size="sm" className="mt-1">
            {contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Text>
        </Card>

        <Card surface="outlined">
          <Phone aria-hidden className="h-6 w-6 text-gold-500" />
          <Text className="mt-3 font-medium">Phone</Text>
          <a href={contact.phoneHref} className="mt-1 block text-sm text-charcoal-600 hover:text-maroon-700">
            {contact.phone}
          </a>
        </Card>

        <Card surface="outlined">
          <Mail aria-hidden className="h-6 w-6 text-gold-500" />
          <Text className="mt-3 font-medium">Email</Text>
          <a href={`mailto:${contact.email}`} className="mt-1 block text-sm text-charcoal-600 hover:text-maroon-700">
            {contact.email}
          </a>
        </Card>
      </div>
    </section>
  )
}
