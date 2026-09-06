import { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { FormField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { useToast } from '@/components/molecules/Toast'
import { api } from '@/lib/apiClient'
import { recordPaymentSchema } from '@/validators/adminSchemas'
import type { RecordPaymentFormValues } from '@/validators/adminSchemas'

export interface RecordPaymentModalMember {
  UNIQUEID: string
  Name: string
  MemberNo: number
}

export interface RecordPaymentModalProps {
  member: RecordPaymentModalMember | null
  onOpenChange: (open: boolean) => void
  onRecorded: () => void
}

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

export function RecordPaymentModal({ member, onOpenChange, onRecorded }: RecordPaymentModalProps) {
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecordPaymentFormValues>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: { amount: '' },
  })

  useEffect(() => {
    if (member) reset({ amount: undefined })
  }, [member, reset])

  async function onSubmit(values: RecordPaymentFormValues) {
    if (!member) return
    setSubmitting(true)
    try {
      await api.put('/recordPayment', null, { params: { amount: Number(values.amount), UNIQUEID: member.UNIQUEID } })
      showToast('Payment recorded successfully.', 'success')
      onRecorded()
      onOpenChange(false)
    } catch (err) {
      showToast(errorMessage(err, 'Failed to record payment.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={Boolean(member)} onOpenChange={onOpenChange} title="Record a Payment">
      {member && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Member">
            <Input value={`${member.Name} (No. ${member.MemberNo})`} readOnly disabled />
          </FormField>
          <FormField label="Amount" error={errors.amount?.message} className="mt-4">
            <Input type="number" min="1" step="1" {...register('amount')} autoFocus />
          </FormField>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" intent="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Submit
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
