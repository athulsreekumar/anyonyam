import { z } from 'zod'

export const professionSearchSchema = z.object({
  query: z.string().trim().min(1, 'Enter a profession to search for').max(100),
})
export type ProfessionSearchFormValues = z.infer<typeof professionSearchSchema>
