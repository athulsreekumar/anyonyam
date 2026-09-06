import { z } from 'zod'

/**
 * Mirrors the shape (not every rule) of the backend's zod schemas in
 * anyonyamBE/backend/validators/schemas.js - client-side validation is a
 * UX nicety so errors show up before a round trip, not the source of
 * truth. The backend re-validates and rejects independently either way.
 */
export const phone = z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
export const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''))

export const editMemberSchema = z.object({
  Name: z.string().trim().min(1, 'Name is required').max(100),
  Mobile: phone,
  RELATIONSHIP: z.string().trim().min(1, 'Relationship is required').max(50),
  DOB: dateString.optional().or(z.literal('')),
  Illam: optionalText(100),
  Area: optionalText(100),
  PROFESSION: optionalText(100),
  EDUCATION: optionalText(100),
  Address: optionalText(255),
  AMMATH: optionalText(100),
  GRAMAM: optionalText(100),
  VEDAM: optionalText(100),
  GOTHRAM: optionalText(100),
  BloodGroup: optionalText(10),
})
export type EditMemberFormValues = z.infer<typeof editMemberSchema>

export const addFamilyMemberSchema = z.object({
  Name: z.string().trim().min(1, 'Name is required').max(100),
  RELATIONSHIP: z.string().trim().min(1, 'Relationship is required').max(50),
  DOB: dateString,
  Mobile: phone,
  Illam: optionalText(100),
  Area: optionalText(100),
})
export type AddFamilyMemberFormValues = z.infer<typeof addFamilyMemberSchema>
