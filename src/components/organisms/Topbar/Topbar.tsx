import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/atoms/Logo'
import { IconButton } from '@/components/atoms/IconButton'
import { buttonVariants } from '@/components/atoms/Button'
import { Text } from '@/components/atoms/Text'
import { NavLink } from '@/components/molecules/NavLink'
import { MobileNav } from '@/components/organisms/MobileNav'
import { getAuthNavItems, publicNavItems } from '@/content/nav'
import { useAuth } from '@/auth/AuthContext'
import { cn } from '@/lib/cn'

export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, isAdmin, memberNo, name } = useAuth()

  const navItems = isAuthenticated ? getAuthNavItems(memberNo, isAdmin) : publicNavItems

  return (
    <header className="sticky top-0 z-30 border-b border-cream-100 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" end aria-label="Anyonyam home" className="shrink-0">
          <Logo withWordmark />
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            name && (
              <Text size="sm" tone="muted" className="hidden md:block">
                Hi, {name}
              </Text>
            )
          ) : (
            <NavLink to="/login" className={cn(buttonVariants({ size: 'sm' }), 'hidden !text-cream-50 md:inline-flex')}>
              Member Login
            </NavLink>
          )}
          <IconButton aria-label="Open menu" className="md:hidden" onClick={() => setMenuOpen(true)}>
            <Menu aria-hidden className="h-6 w-6" />
          </IconButton>
        </div>
      </div>

      <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
    </header>
  )
}
