import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Text } from '@/components/atoms/Text'
import { Modal } from '@/components/molecules/Modal'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  destructive?: boolean
  onConfirm: () => Promise<void> | void
}

/**
 * Replaces window.confirm() for destructive actions (e.g. deleting a
 * member) - consistent with the rest of the design system instead of a
 * jarring native browser dialog, and testable the same way as everything
 * else here.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = useState(false)

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await onConfirm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <Text tone="muted">{description}</Text>
      <div className="mt-6 flex justify-end gap-3">
        <Button intent="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
          Cancel
        </Button>
        <Button intent={destructive ? 'danger' : 'primary'} loading={submitting} onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
