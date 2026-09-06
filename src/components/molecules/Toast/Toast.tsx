import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as RadixToast from '@radix-ui/react-toast'
import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

interface ToastEntry {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: 'bg-charcoal-900 text-cream-50' },
  success: { icon: CheckCircle2, className: 'bg-success text-cream-50' },
  warning: { icon: TriangleAlert, className: 'bg-gold-500 text-charcoal-900' },
  error: { icon: CircleAlert, className: 'bg-error text-cream-50' },
}

/**
 * Non-blocking feedback for API results — replaces window.alert(), which
 * halts the whole page and can't be styled, positioned, or auto-dismissed.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message, variant }])
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right" duration={4000}>
        {children}
        {toasts.map((toast) => {
          const { icon: Icon, className } = VARIANT_STYLES[toast.variant]
          return (
            <RadixToast.Root
              key={toast.id}
              className={cn(
                'flex items-start gap-3 rounded-md px-4 py-3 shadow-lifted data-[state=closed]:opacity-0',
                className,
              )}
              onOpenChange={(open) => {
                if (!open) dismiss(toast.id)
              }}
            >
              <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
              <RadixToast.Description className="font-body text-sm">{toast.message}</RadixToast.Description>
              <RadixToast.Close aria-label="Dismiss" className="ml-auto shrink-0">
                <X aria-hidden className="h-4 w-4" />
              </RadixToast.Close>
            </RadixToast.Root>
          )
        })}
        <RadixToast.Viewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
