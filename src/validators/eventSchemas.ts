import { z } from 'zod'
import { dateString, optionalText } from './memberSchemas'

/** Mirrors backend/validators/schemas.js createEventSchema / updateEventSchema. */
export const eventFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255),
  event_date: dateString,
  venue: optionalText(255),
  description: optionalText(2000),
})
export type EventFormValues = z.infer<typeof eventFormSchema>
