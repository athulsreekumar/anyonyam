import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { IconButton } from '@/components/atoms/IconButton'
import { Heading } from '@/components/atoms/Heading'
import { cn } from '@/lib/cn'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  className?: string
}

/**
 * Thin wrapper around Radix's Dialog: focus trap, ESC-to-close, and
 * backdrop-click-to-close come for free from the primitive. Every modal in
 * the app goes through this so that behavior is consistent.
 */
export function Modal({ open, onOpenChange, title, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-maroon-900/40 backdrop-blur-[2px] transition-opacity duration-200" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-cream-50 p-6 shadow-lifted focus:outline-none',
            className,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <Dialog.Title asChild>
              <Heading level="h3">{title}</Heading>
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton aria-label="Close dialog">
                <X aria-hidden className="h-5 w-5" />
              </IconButton>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
