import { z } from 'zod'
import { phone } from './memberSchemas'

/** Mirrors backend/validators/schemas.js createBookingSchema. */
export const FOOD_COST_PER_HEAD = 100

export const poojaBookingSchema = z
  .object({
    requesterName: z.string().trim().min(1, 'Name is required').max(100),
    requesterPhone: phone,
    requesterEmail: z.string().trim().email('Enter a valid email').max(255).optional().or(z.literal('')),
    poojaType: z.string().trim().min(1, 'Pooja type is required').max(100),
    // Optional - a first-time requester often doesn't know yet which open
    // date they want and would rather have the admin help pick one.
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional()
      .or(z.literal('')),
    foodRequired: z.boolean(),
    mealType: z.enum(['breakfast', 'lunch', 'dinner']).optional(),
    // Stays a string (matching the <input> value RHF actually holds) rather
    // than z.coerce.number() - see adminSchemas.ts's numericString comment
    // for why coerce doesn't reconcile with react-hook-form's generics.
    headcount: z
      .string()
      .trim()
      .refine((v) => v === '' || (Number.isInteger(Number(v)) && Number(v) > 0 && Number(v) <= 2000), 'Enter how many people')
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => !data.foodRequired || data.mealType, {
    message: 'Choose a meal',
    path: ['mealType'],
  })
  .refine((data) => !data.foodRequired || (data.headcount && data.headcount !== ''), {
    message: 'Enter the headcount',
    path: ['headcount'],
  })

export type PoojaBookingFormValues = z.infer<typeof poojaBookingSchema>
