import { z } from 'zod'
import { dateString, optionalText, phone } from './memberSchemas'

/**
 * Numeric fields stay strings in the schema (matching the <input> value RHF
 * actually holds) rather than z.coerce.number() - coerce gives the field an
 * "unknown" input type distinct from its "number" output type, which
 * react-hook-form's generics can't reconcile with a single TFieldValues.
 * Callers Number(...) the value at submit time instead.
 */
const numericString = (message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) >= 0), message)
    .optional()
    .or(z.literal(''))

/** Mirrors backend/validators/schemas.js createNewMemberSchema - POST /newmember auto-assigns MemberNo and forces RELATIONSHIP=MEMBER server-side. */
export const createMemberSchema = z.object({
  Name: z.string().trim().min(1, 'Name is required').max(100),
  Mobile: phone,
  DOB: dateString,
  Illam: optionalText(100),
  Area: optionalText(100),
  Subscription: numericString('Enter a valid non-negative amount'),
})
export type CreateMemberFormValues = z.infer<typeof createMemberSchema>

/** Mirrors backend/validators/schemas.js recordPaymentSchema. */
export const recordPaymentSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Enter an amount greater than 0')
    .refine((v) => Number(v) > 0, 'Enter an amount greater than 0'),
})
export type RecordPaymentFormValues = z.infer<typeof recordPaymentSchema>
