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
import { createMemberSchema } from '@/validators/adminSchemas'
import type { CreateMemberFormValues } from '@/validators/adminSchemas'

export interface CreateMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

const EMPTY_VALUES: CreateMemberFormValues = {
  Name: '',
  Mobile: '',
  DOB: '',
  Illam: '',
  Area: '',
  Subscription: '',
}

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

export function CreateMemberModal({ open, onOpenChange, onCreated }: CreateMemberModalProps) {
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMemberFormValues>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (open) reset(EMPTY_VALUES)
  }, [open, reset])

  async function onSubmit(values: CreateMemberFormValues) {
    setSubmitting(true)
    try {
      await api.post('/newmember', { ...values, Subscription: values.Subscription ? Number(values.Subscription) : 0 })
      showToast('Member added successfully!', 'success')
      onCreated()
      onOpenChange(false)
    } catch (err) {
      showToast(errorMessage(err, 'Failed to add member.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create a New Member">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
        <FormField label="Name" error={errors.Name?.message}>
          <Input {...register('Name')} autoFocus />
        </FormField>
        <FormField label="Mobile" error={errors.Mobile?.message}>
          <Input {...register('Mobile')} />
        </FormField>
        <FormField label="Date of Birth" error={errors.DOB?.message}>
          <Input type="date" {...register('DOB')} />
        </FormField>
        <FormField label="Illam" error={errors.Illam?.message}>
          <Input {...register('Illam')} />
        </FormField>
        <FormField label="Area" error={errors.Area?.message}>
          <Input {...register('Area')} />
        </FormField>
        <FormField label="Pending Subscription" error={errors.Subscription?.message} hint="Leave blank for ₹0">
          <Input type="number" min="0" step="1" {...register('Subscription')} />
        </FormField>

        <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
          <Button type="button" intent="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Add Member
          </Button>
        </div>
      </form>
    </Modal>
  )
}
