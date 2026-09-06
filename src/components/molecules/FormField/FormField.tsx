import { useId } from 'react'
import type { ReactElement } from 'react'
import { cloneElement, isValidElement } from 'react'
import { Label } from '@/components/atoms/Label'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export interface FormFieldProps {
  label: string
  /** A single form control, e.g. <Input />. Gets id/aria-describedby/aria-invalid wired up automatically. */
  children: ReactElement<{ id?: string; 'aria-describedby'?: string; invalid?: boolean }>
  error?: string
  hint?: string
  className?: string
}

export function FormField({ label, children, error, hint, className }: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined

  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        'aria-describedby': describedBy,
        invalid: Boolean(error),
      })
    : children

  return (
    <div className={cn(className)}>
      <Label htmlFor={id}>{label}</Label>
      {control}
      {hint && !error && (
        <Text as="p" id={hintId} tone="muted" size="sm" className="mt-1">
          {hint}
        </Text>
      )}
      {error && (
        <Text as="p" id={errorId} size="sm" className="mt-1 text-error" role="alert">
          {error}
        </Text>
      )}
    </div>
  )
}
