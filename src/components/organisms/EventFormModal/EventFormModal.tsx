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
import { eventFormSchema } from '@/validators/eventSchemas'
import type { EventFormValues } from '@/validators/eventSchemas'
import type { EventItem } from '@/types/event'

export interface EventFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present to edit an existing event; omitted to create a new one. */
  event?: EventItem | null
  onSaved: () => void
}

const EMPTY_VALUES: EventFormValues = { title: '', event_date: '', venue: '', description: '' }

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

export function EventFormModal({ open, onOpenChange, event, onSaved }: EventFormModalProps) {
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const isEditing = Boolean(event)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!open) return
    reset(
      event
        ? { title: event.title, event_date: event.event_date, venue: event.venue, description: event.description }
        : EMPTY_VALUES,
    )
  }, [open, event, reset])

  async function onSubmit(values: EventFormValues) {
    setSubmitting(true)
    try {
      if (event) {
        await api.put(`/events/${event.id}`, values)
        showToast('Event updated.', 'success')
      } else {
        await api.post('/events', values)
        showToast('Event created.', 'success')
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      showToast(errorMessage(err, 'Failed to save the event.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={isEditing ? 'Edit Event' : 'Add an Event'}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <FormField label="Title" error={errors.title?.message}>
          <Input {...register('title')} autoFocus />
        </FormField>
        <FormField label="Date" error={errors.event_date?.message}>
          <Input type="date" {...register('event_date')} />
        </FormField>
        <FormField label="Venue" error={errors.venue?.message}>
          <Input {...register('venue')} />
        </FormField>
        <FormField label="Description" error={errors.description?.message} hint="Optional">
          <Input {...register('description')} />
        </FormField>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" intent="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEditing ? 'Save Changes' : 'Add Event'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
