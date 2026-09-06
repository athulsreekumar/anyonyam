import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { Card } from '@/components/molecules/Card'
import { FormField } from '@/components/molecules/FormField'
import { AvailabilityCalendar } from '@/components/molecules/AvailabilityCalendar'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { Text } from '@/components/atoms/Text'
import { useToast } from '@/components/molecules/Toast'
import { useAuth } from '@/auth/AuthContext'
import { api } from '@/lib/apiClient'
import { poojaBookingSchema, FOOD_COST_PER_HEAD } from '@/validators/naalukettuSchemas'
import type { PoojaBookingFormValues } from '@/validators/naalukettuSchemas'
import type { CreateBookingResponse } from '@/types/naalukettu'

const selectClassName =
  'h-11 w-full rounded-md border border-charcoal-600/25 bg-cream-50 px-3.5 font-body text-charcoal-900 transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500'

function emptyValues(requesterName: string): PoojaBookingFormValues {
  return {
    requesterName,
    requesterPhone: '',
    requesterEmail: '',
    poojaType: '',
    eventDate: '',
    foodRequired: false,
    mealType: 'breakfast',
    headcount: '',
  }
}

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

export function PoojaBookingPanel() {
  const { showToast } = useToast()
  const { isAuthenticated, name } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PoojaBookingFormValues>({
    resolver: zodResolver(poojaBookingSchema),
    defaultValues: emptyValues(isAuthenticated && name ? name : ''),
  })

  const eventDate = watch('eventDate')
  const foodRequired = watch('foodRequired')
  const headcount = watch('headcount')
  const estimatedCost = foodRequired && headcount ? Number(headcount) * FOOD_COST_PER_HEAD : 0

  async function onSubmit(values: PoojaBookingFormValues) {
    setSubmitting(true)
    try {
      const res = await api.post<CreateBookingResponse>('/naalukettu/bookings', {
        ...values,
        eventDate: values.eventDate || undefined,
        requesterEmail: values.requesterEmail || undefined,
        mealType: values.foodRequired ? values.mealType : undefined,
        headcount: values.foodRequired && values.headcount ? Number(values.headcount) : undefined,
      })
      showToast(res.data.message, 'success')
      reset(emptyValues(isAuthenticated && name ? name : ''))
    } catch (err) {
      showToast(errorMessage(err, 'Failed to submit your booking request.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Book the hall"
        title="Naalukettu Booking"
        description="Anyone can request the Naalukettu for a personal pooja — no login needed. Pick an open date if you know one, tell us what's needed, and our admin will confirm with you directly. Not sure of a date yet? Leave it blank and the admin will help you find one."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Card surface="outlined" padding="lg">
          <AvailabilityCalendar selectedDate={eventDate || null} onSelectDate={(date) => setValue('eventDate', date, { shouldValidate: true, shouldDirty: true })} />
          {errors.eventDate && (
            <Text size="sm" className="mt-3 text-error" role="alert">
              {errors.eventDate.message}
            </Text>
          )}
        </Card>

        <Card surface="outlined" padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
            <Text tone="muted" size="sm">
              Selected date:{' '}
              <span className="font-medium text-charcoal-900">
                {eventDate || "None — that's fine, pick one from the calendar or leave it blank"}
              </span>
            </Text>

            <FormField label="Type of pooja" error={errors.poojaType?.message}>
              <Input placeholder="e.g. Ganapathi Homam" {...register('poojaType')} />
            </FormField>

            <div className="flex items-center gap-2">
              <input
                id="foodRequired"
                type="checkbox"
                className="h-4 w-4 rounded border-charcoal-600/40 text-maroon-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500"
                {...register('foodRequired')}
              />
              <Label htmlFor="foodRequired">Food required (₹{FOOD_COST_PER_HEAD} per person)</Label>
            </div>

            {foodRequired && (
              <>
                <FormField label="Meal" error={errors.mealType?.message}>
                  <select id="mealType" className={selectClassName} {...register('mealType')}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </FormField>

                <FormField label="Number of people" error={errors.headcount?.message}>
                  <Input type="number" min={1} {...register('headcount')} />
                </FormField>

                <Text size="sm" tone="muted">
                  Estimated food cost: <span className="font-medium text-charcoal-900">₹{estimatedCost}</span> (rough
                  estimate — the admin will confirm the final amount)
                </Text>
              </>
            )}

            <FormField label="Your name" error={errors.requesterName?.message}>
              <Input {...register('requesterName')} />
            </FormField>

            <FormField label="Phone number" error={errors.requesterPhone?.message} hint="So the admin can reach you about this request">
              <Input {...register('requesterPhone')} />
            </FormField>

            <FormField label="Email" error={errors.requesterEmail?.message} hint="Optional">
              <Input type="email" {...register('requesterEmail')} />
            </FormField>

            <Button type="submit" loading={submitting} className="mt-2">
              Send Booking Request
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}
