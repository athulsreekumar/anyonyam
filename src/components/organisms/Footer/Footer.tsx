import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/atoms/Logo'
import { Text } from '@/components/atoms/Text'
import { NavLink } from '@/components/molecules/NavLink'
import { publicNavItems } from '@/content/nav'
import { contact, org } from '@/content/site'
import { useAuth } from '@/auth/AuthContext'

function Copyright() {
  return (
    <Text tone="onDark" size="sm" className="text-cream-50/60">
      © {new Date().getFullYear()} {org.name}. All rights reserved.
    </Text>
  )
}

export function Footer() {
  const { isAuthenticated } = useAuth()

  // The full footer (nav, contact details, tagline) sells the org to a
  // visitor - once someone is signed in and working (profile, search,
  // admin), that pitch is no longer needed and just pushes real content
  // down, so a signed-in member gets a slim copyright bar instead.
  if (isAuthenticated) {
    return (
      <footer className="bg-maroon-900 text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center sm:px-6 lg:px-8">
          <Copyright />
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-maroon-900 text-cream-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Logo size="md" />
            <Text tone="onDark" size="sm" className="max-w-xs text-cream-50/75">
              {org.tagline}
            </Text>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <Text tone="onDark" size="sm" className="font-medium tracking-wide text-gold-300 uppercase">
              Explore
            </Text>
            {publicNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} tone="onDark">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <Text tone="onDark" size="sm" className="font-medium tracking-wide text-gold-300 uppercase">
              Contact
            </Text>
            <a href={contact.phoneHref} className="flex items-center gap-2 text-cream-50/85 hover:text-cream-50">
              <Phone aria-hidden className="h-4 w-4" />
              <span>{contact.phone}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-cream-50/85 hover:text-cream-50">
              <Mail aria-hidden className="h-4 w-4" />
              <span>{contact.email}</span>
            </a>
            <p className="flex items-start gap-2 text-cream-50/85">
              <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{contact.addressLines.join(', ')}</span>
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-cream-50/15 pt-6">
          <Copyright />
        </div>
      </div>
    </footer>
  )
}
