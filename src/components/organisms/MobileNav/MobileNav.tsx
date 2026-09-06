import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { IconButton } from '@/components/atoms/IconButton'
import { buttonVariants } from '@/components/atoms/Button'
import { NavLink } from '@/components/molecules/NavLink'
import { getAuthNavItems, publicNavItems } from '@/content/nav'
import { useAuth } from '@/auth/AuthContext'
import { cn } from '@/lib/cn'

export interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const { isAuthenticated, isAdmin, memberNo, name } = useAuth()
  const navItems = isAuthenticated ? getAuthNavItems(memberNo, isAdmin) : publicNavItems

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-maroon-900/40 md:hidden" />
        <Dialog.Content className="fixed top-0 right-0 z-50 flex h-full w-[min(85vw,22rem)] flex-col gap-8 bg-cream-50 p-6 shadow-lifted focus:outline-none md:hidden">
          <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-lg text-maroon-900">
              {isAuthenticated && name ? `Hi, ${name}` : 'Menu'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton aria-label="Close menu">
                <X aria-hidden className="h-5 w-5" />
              </IconButton>
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-6" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="text-lg" onClick={() => onOpenChange(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {!isAuthenticated && (
            <NavLink
              to="/login"
              className={cn(buttonVariants({ intent: 'primary' }), 'mt-auto justify-center !text-cream-50')}
              onClick={() => onOpenChange(false)}
            >
              Member Login
            </NavLink>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
